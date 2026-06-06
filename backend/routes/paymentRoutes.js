const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { Resend } = require("resend");
const pdf = require("html-pdf-node");

const generateInvoiceHTML = require("../utils/generateInvoiceHTML");

const resend = new Resend(process.env.RESEND_API_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= CREATE ORDER ================= */

router.post("/create-order", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        error: "Cart is empty",
      });
    }

    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
    });

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      total,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

/* ================= VERIFY PAYMENT + SAVE ORDER ================= */

router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    if (
      !orderData ||
      !orderData.items ||
      orderData.items.length === 0
    ) {
      return res.status(400).json({
        message: "Invalid order data",
      });
    }

    const total = orderData.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const order = await Order.create({
      userId: orderData?.userId || "",

      name: orderData?.name || "",
      email: orderData?.email || "",
      phone: orderData?.phone || "",

      items: orderData.items,

      total,

      status: "Order Placed",

      address: {
        street:
          orderData?.address?.street ||
          orderData?.address?.address ||
          "",
        city: orderData?.address?.city || "",
        state: orderData?.address?.state || "",
        pincode: orderData?.address?.pincode || "",
      },
    });

    const io = req.app.get("io");

    if (io) {
      io.emit("new-order", {
        orderId: order._id,
      });
    }

    // RETURN SUCCESS IMMEDIATELY
    res.json({
      success: true,
      order,
    });

    // BACKGROUND EMAIL TASK
    (async () => {
      try {
        const invoiceNumber = `INV-${order._id
          .toString()
          .slice(-6)
          .toUpperCase()}`;

        const htmlInvoice = generateInvoiceHTML(
          order,
          razorpay_payment_id
        );

        const pdfBuffer = await pdf.generatePdf(
          { content: htmlInvoice },
          { format: "A4" }
        );

        if (order.email) {
          await resend.emails.send({
            from: "Latika Gruh Udyog <orders@latikagruhudyog.in>",
            to: order.email,
            subject: "Order Confirmed - Latika Organics 🌿",
            html: `
              <h2>Order Confirmed</h2>
              <p>
                Hi ${order.name || "Customer"},
                your order has been placed successfully.
              </p>

              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Total:</strong> ₹${order.total}</p>

              <p>
                Thank you for shopping with Latika Organics.
              </p>
            `,
            attachments: [
              {
                filename: `${invoiceNumber}.pdf`,
                content: pdfBuffer.toString("base64"),
              },
            ],
          });

          console.log("📧 CUSTOMER EMAIL SENT");
        }

        if (process.env.ADMIN_EMAIL) {
          await resend.emails.send({
            from: "Latika Gruh Udyog <orders@latikagruhudyog.in>",
            to: process.env.ADMIN_EMAIL,
            subject: "🛒 New Order Received",
            html: `
              <h2>New Order Received</h2>

              <p><strong>Name:</strong> ${order.name}</p>
              <p><strong>Phone:</strong> ${order.phone}</p>
              <p><strong>Email:</strong> ${order.email}</p>
              <p><strong>Total:</strong> ₹${order.total}</p>
              <p><strong>Order ID:</strong> ${order._id}</p>

              <p>
                ${order.address.street},
                ${order.address.city},
                ${order.address.state}
                -
                ${order.address.pincode}
              </p>
            `,
          });

          console.log("📧 ADMIN EMAIL SENT");
        }
      } catch (emailError) {
        console.log("EMAIL ERROR:", emailError);
      }
    })();
  } catch (error) {
    console.log("VERIFY ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;