function generateInvoiceHTML(order, paymentId = "") {
  const logoUrl =
    "https://res.cloudinary.com/dizwzwsww/image/upload/v1780548137/Latika_Logo_kpiu4b.png";

  const invoiceNumber = `INV-${order._id
    .toString()
    .slice(-6)
    .toUpperCase()}`;

  const date = new Date(order.createdAt).toLocaleString("en-IN");

  const subtotal = Number(order.total || 0);
  const total = subtotal;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=Order:${order._id}`;

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>

@page{
  size:A4;
  margin:14mm;
}

*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:Arial,Helvetica,sans-serif;
  color:#222;
  background:#fff;
}

.container{
  width:100%;
  border:1px solid #e5e7eb;
}

.top-strip{
  height:10px;
  background:linear-gradient(
    90deg,
    #1b5e20,
    #2e7d32,
    #4caf50
  );
}

.content{
  padding:28px;
}

table{
  width:100%;
  border-collapse:collapse;
}

.right{
  text-align:right;
}

.muted{
  color:#666;
  font-size:12px;
}

.invoice-title{
  font-size:32px;
  font-weight:700;
  color:#2e7d32;
}

.paid{
  display:inline-block;
  margin-top:10px;
  background:#e8f5e9;
  color:#1b5e20;
  padding:6px 14px;
  border-radius:20px;
  font-size:12px;
  font-weight:700;
}

.info-grid{
  margin-top:25px;
}

.info-grid td{
  width:50%;
  vertical-align:top;
  padding:0 8px;
}

.card{
  border:1px solid #e5e7eb;
  border-radius:10px;
  padding:16px;
  min-height:130px;
}

.card-title{
  color:#2e7d32;
  font-weight:700;
  font-size:15px;
  margin-bottom:10px;
}

.items{
  margin-top:25px;
}

.items th{
  background:#2e7d32;
  color:#fff;
  padding:14px;
  font-size:13px;
}

.items td{
  padding:14px;
  border-bottom:1px solid #eee;
}

.product{
  display:flex;
  align-items:center;
  gap:12px;
}

.product img{
  width:60px;
  height:60px;
  object-fit:cover;
  border-radius:8px;
  border:1px solid #eee;
}

.total-box{
  width:320px;
  margin-left:auto;
  margin-top:20px;
  border:1px solid #e5e7eb;
  border-radius:10px;
  overflow:hidden;
}

.total-box td{
  padding:14px;
}

.total-row{
  background:#f1f8e9;
  color:#1b5e20;
  font-weight:700;
  font-size:18px;
}

.thank-you{
  margin-top:30px;
  border:1px solid #dcecc8;
  border-radius:12px;
  background:#f8fcf6;
  padding:20px;
}

.thank-you-table td{
  vertical-align:middle;
}

.thank-title{
  margin:0;
  color:#2e7d32;
  font-size:24px;
}

.thank-text{
  margin-top:10px;
  color:#555;
  line-height:1.7;
  font-size:14px;
}

.qr{
  width:120px;
  height:120px;
}

.benefits{
  margin-top:20px;
  padding:15px 0;
  border-top:1px solid #eee;
  border-bottom:1px solid #eee;
}

.benefits td{
  text-align:center;
  color:#2e7d32;
  font-weight:700;
  font-size:13px;
}

.footer{
  margin-top:20px;
  font-size:12px;
  color:#666;
  line-height:1.8;
}

@media print{
  body{
    background:#fff;
  }

  .container{
    border:none;
  }
}

</style>

</head>

<body>

<div class="container">

  <div class="top-strip"></div>

  <div class="content">

    <!-- HEADER -->

    <table>

      <tr>

        <td>

          <img
            src="${logoUrl}"
            height="60"
          />

          <div
            style="
              margin-top:8px;
              font-weight:700;
              font-size:18px;
            "
          >
            Latika Organics
          </div>

          <div class="muted">
            Healthy & Natural Products
          </div>

        </td>

        <td class="right">

          <div class="invoice-title">
            INVOICE
          </div>

          <div style="margin-top:10px;">

            <strong>
              ${invoiceNumber}
            </strong>

            <br/>

            ${date}

            ${
              paymentId
                ? `
            <br/>
            Payment: ${paymentId}
            `
                : ""
            }

          </div>

          <div class="paid">
            PAID
          </div>

        </td>

      </tr>

    </table>

    <!-- CUSTOMER + ADDRESS -->

    <table class="info-grid">

      <tr>

        <td>

          <div class="card">

            <div class="card-title">
              Customer Details
            </div>

            <strong>
              ${order.name || "N/A"}
            </strong>

            <br/><br/>

            ${order.phone || ""}

            <br/>

            ${order.email || ""}

          </div>

        </td>

        <td>

          <div class="card">

            <div class="card-title">
              Delivery Address
            </div>

            <strong>
              ${order.name || ""}
            </strong>

            <br/><br/>

            ${
              order.address?.address ||
              order.address?.street ||
              ""
            }

            <br/>

            ${order.address?.city || ""}

            ${
              order.address?.pincode
                ? ` - ${order.address.pincode}`
                : ""
            }

          </div>

        </td>

      </tr>

    </table>

    <!-- PRODUCTS -->

    <table class="items">

      <tr>

        <th>Product</th>
        <th class="right">Qty</th>
        <th class="right">Price</th>
        <th class="right">Total</th>

      </tr>

      ${(order.items || [])
        .map(
          (item) => `
        <tr>

          <td>

            <div class="product">

              <img
                src="${
                  item.image ||
                  "https://via.placeholder.com/60"
                }"
              />

              <span>
                ${item.name}
              </span>

            </div>

          </td>

          <td class="right">
            ${item.quantity}
          </td>

          <td class="right">
            ${formatCurrency(item.price)}
          </td>

          <td class="right">
            ${formatCurrency(
              item.price * item.quantity
            )}
          </td>

        </tr>
      `
        )
        .join("")}

    </table>

    <!-- TOTAL -->

    <div class="total-box">

      <table>

        <tr>

          <td>
            Subtotal
          </td>

          <td class="right">
            ${formatCurrency(subtotal)}
          </td>

        </tr>

        <tr class="total-row">

          <td>
            Total
          </td>

          <td class="right">
            ${formatCurrency(total)}
          </td>

        </tr>

      </table>

    </div>

    <!-- THANK YOU -->

    <div class="thank-you">

      <table class="thank-you-table">

        <tr>

          <td>

            <h2 class="thank-title">
              Thank You for Shopping with Latika Organics 💚
            </h2>

            <div class="thank-text">

              We appreciate your trust in our natural
              and healthy products. Your support helps
              us continue delivering premium organic
              wellness solutions.

            </div>

          </td>

          <td
            class="right"
            width="150"
          >

            <img
              src="${qrUrl}"
              class="qr"
            />

          </td>

        </tr>

      </table>

    </div>

    <!-- BENEFITS -->

    <table class="benefits">

      <tr>

        <td>🌿 100% Natural</td>

        <td>🧪 Lab Tested</td>

        <td>♻️ Eco Friendly</td>

        <td>❤️ Made With Care</td>

      </tr>

    </table>

    <!-- FOOTER -->

    <div class="footer">

      <strong>
        Latika Organics
      </strong>

      <br/>

      Healthy & Natural Products

      <br/>

      Nashik, Maharashtra, India

      <br/>

      support@latikaorganics.com

      <br/><br/>

      This is a computer-generated invoice
      and does not require a signature.

    </div>

  </div>

</div>

</body>
</html>
`;
}

module.exports = generateInvoiceHTML;