const transporter = require("../config/mailer");
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const pdf = require("html-pdf-node");
const mongoose = require("mongoose");

// ✅ COMMON INVOICE ENGINE
const generateInvoiceHTML = require("../utils/generateInvoiceHTML");

/* =========================
   GET ALL ORDERS
========================= */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders, count: orders.length });
  } catch (err) {
    console.log("GET ALL ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =========================
   USER ORDERS BY PHONE
========================= */
router.get("/user/:phone", async (req, res) => {
  try {

    const orders = await Order.find({
      $or: [
        { phone: req.params.phone },
        { userId: req.params.phone }
      ]
    }).sort({ createdAt: -1 });

    res.json({ orders, count: orders.length });

  } catch (err) {
    console.log("USER ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =========================
   🔥 INVOICE (MOVED ABOVE TO AVOID ROUTE CONFLICT)
========================= */
router.get("/invoice/:orderId", async (req, res) => {

  try {

    const { orderId } = req.params;

    // ✅ FIX: Prevent crash on invalid ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).send("Invalid Order ID");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    const html = generateInvoiceHTML(order);

    const invoiceNumber =
      order.invoiceNumber ||
      `INV-${order._id.toString().slice(-6).toUpperCase()}`;

    const pdfBuffer = await pdf.generatePdf(
      { content: html },
      { format: "A4" }
    );

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${invoiceNumber}.pdf`
    });

    res.send(pdfBuffer);

  } catch (err) {

    console.log("INVOICE ERROR:", err);

    res.status(500).send("Invoice generation failed");
  }

});


/* =========================
   USER ORDERS BY USERID
========================= */
router.get("/:userId", async (req, res) => {
  try {

    const orders = await Order.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json({ orders, count: orders.length });

  } catch (err) {
    console.log("USERID ORDERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =========================
   UPDATE ORDER STATUS
========================= */
router.put("/update-status/:orderId", async (req, res) => {
  try {

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Status updated", order });

  } catch (err) {
    console.log("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;