function generateInvoiceHTML(order, paymentId = "") {

const logoUrl =
"https://res.cloudinary.com/dizwzwsww/image/upload/v1780548137/Latika_Logo_kpiu4b.png";

const invoiceNumber =
`INV-${order._id.toString().slice(-6).toUpperCase()}`;

const date =
new Date(order.createdAt).toLocaleString("en-IN");

const subtotal = order.total || 0;
const total = subtotal;

const qrUrl =
`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Invoice:${invoiceNumber}`;

return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8"/>

<style>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  font-family:Arial,sans-serif;
  background:#f3f4f6;
  padding:20px;
  color:#1f2937;
}

.container{
  width:100%;
  max-width:820px;
  margin:auto;
  background:#ffffff;
  border-radius:18px;
  overflow:hidden;
  box-shadow:0 10px 30px rgba(0,0,0,0.08);
}

/* HEADER */

.header{
  background:
    linear-gradient(
      135deg,
      #14532d,
      #16a34a
    );

  color:white;
  padding:35px;
}

.header-table{
  width:100%;
}

.logo{
  height:70px;
}

.brand{
  margin-top:12px;
  font-size:30px;
  font-weight:700;
}

.tagline{
  margin-top:6px;
  font-size:13px;
  opacity:0.9;
}

.invoice-side{
  text-align:right;
}

.invoice-title{
  font-size:38px;
  font-weight:700;
}

.invoice-meta{
  margin-top:12px;
  line-height:1.8;
  font-size:13px;
}

.paid{
  display:inline-block;
  margin-top:12px;
  background:white;
  color:#166534;
  padding:8px 18px;
  border-radius:999px;
  font-size:12px;
  font-weight:bold;
}

/* BODY */

.content{
  padding:30px;
}

.section{
  margin-bottom:24px;
}

.card{
  background:#f8fafc;
  border:1px solid #e5e7eb;
  border-radius:12px;
  padding:18px;
}

.card-title{
  font-size:14px;
  font-weight:700;
  color:#166534;
  margin-bottom:12px;
}

.info-table{
  width:100%;
}

/* PRODUCT TABLE */

.product-table{
  width:100%;
  border-collapse:collapse;
}

.product-table th{
  background:#166534;
  color:white;
  padding:12px;
  font-size:13px;
  text-align:left;
}

.product-table td{
  padding:12px;
  border-bottom:1px solid #e5e7eb;
  font-size:13px;
}

.product-table tr:nth-child(even){
  background:#fafafa;
}

.product-image{
  width:45px;
  height:45px;
  object-fit:cover;
  border-radius:8px;
  margin-right:10px;
  vertical-align:middle;
}

/* TOTAL CARD */

.total-box{
  width:300px;
  margin-left:auto;
  background:#dcfce7;
  border-radius:12px;
  padding:20px;
}

.total-table{
  width:100%;
}

.total-table td{
  padding:6px 0;
}

.grand-total{
  font-size:22px;
  font-weight:700;
  color:#166534;
}

/* FOOTER */

.footer{
  margin-top:35px;
  border-top:1px solid #e5e7eb;
  padding-top:20px;
}

.footer-table{
  width:100%;
}

.small{
  font-size:12px;
  color:#6b7280;
  line-height:1.8;
}

.qr{
  width:130px;
}

.verify{
  margin-top:8px;
  font-size:11px;
  color:#6b7280;
}

.thankyou{
  margin-top:20px;
  text-align:center;
  color:#166534;
  font-weight:700;
  font-size:16px;
}

</style>

</head>

<body>

<div class="container">

  <!-- HEADER -->

  <div class="header">

```
<table class="header-table">

  <tr>

    <td>

      <img
        src="${logoUrl}"
        class="logo"
      />

      <div class="brand">
        Latika Organics
      </div>

      <div class="tagline">
        Pure • Natural • Cold Pressed Oils
      </div>

    </td>

    <td class="invoice-side">

      <div class="invoice-title">
        INVOICE
      </div>

      <div class="invoice-meta">

        <div>
          <strong>${invoiceNumber}</strong>
        </div>

        <div>
          ${date}
        </div>

        ${
          paymentId
            ? `<div>Payment ID: ${paymentId}</div>`
            : ""
        }

      </div>

      <div class="paid">
        ✔ PAYMENT VERIFIED
      </div>

    </td>

  </tr>

</table>
```

  </div>

  <!-- CONTENT -->

  <div class="content">

```
<div class="section">

  <table class="info-table">

    <tr>

      <td width="48%">

        <div class="card">

          <div class="card-title">
            CUSTOMER DETAILS
          </div>

          <strong>
            ${order.name || "Customer"}
          </strong>

          <br/><br/>

          📞 ${order.phone || ""}

          <br/>

          ✉️ ${order.email || ""}

        </div>

      </td>

      <td width="4%"></td>

      <td width="48%">

        <div class="card">

          <div class="card-title">
            DELIVERY ADDRESS
          </div>

          ${order.address?.street || ""}

          <br/>

          ${order.address?.city || ""}

          <br/>

          ${order.address?.state || ""}

          <br/>

          ${order.address?.pincode || ""}

        </div>

      </td>

    </tr>

  </table>

</div>

<!-- PRODUCTS -->

<div class="section">

  <table class="product-table">

    <thead>

      <tr>

        <th>Product</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>

      </tr>

    </thead>

    <tbody>

      ${(order.items || [])
        .map(item => `
          <tr>

            <td>

              ${
                item.image
                  ? `
                    <img
                      src="${item.image}"
                      class="product-image"
                    />
                  `
                  : ""
              }

              ${item.name}

            </td>

            <td>
              ${item.quantity}
            </td>

            <td>
              ₹${item.price}
            </td>

            <td>
              ₹${item.price * item.quantity}
            </td>

          </tr>
        `)
        .join("")}

    </tbody>

  </table>

</div>

<!-- TOTAL -->

<div class="total-box">

  <table class="total-table">

    <tr>

      <td>Subtotal</td>

      <td align="right">
        ₹${subtotal}
      </td>

    </tr>

    <tr>

      <td>Shipping</td>

      <td align="right">
        FREE
      </td>

    </tr>

    <tr>

      <td>Taxes</td>

      <td align="right">
        Included
      </td>

    </tr>

    <tr>

      <td colspan="2">
        <hr style="margin:10px 0;border:none;border-top:1px solid #a7f3d0">
      </td>

    </tr>

    <tr>

      <td class="grand-total">
        Total
      </td>

      <td
        align="right"
        class="grand-total"
      >
        ₹${total}
      </td>

    </tr>

  </table>

</div>

<!-- FOOTER -->

<div class="footer">

  <table class="footer-table">

    <tr>

      <td>

        <div class="small">

          <strong>
            Latika Organics
          </strong>

          <br/>

          Pure • Natural • Cold Pressed Oils

          <br/>

          Nashik, Maharashtra, India

          <br/><br/>

          Support:
          support@latikaorganics.com

          <br/>

          Website:
          www.latikaorganics.com

          <br/><br/>

          This is a computer-generated
          invoice and does not require
          a signature.

        </div>

      </td>

      <td align="right">

        <img
          src="${qrUrl}"
          class="qr"
        />

        <div class="verify">
          Scan to verify invoice
        </div>

      </td>

    </tr>

  </table>

  <div class="thankyou">
    Thank you for choosing
    Latika Organics 🌿
  </div>

</div>
```

  </div>

</div>

</body>
</html>
`;

}

module.exports = generateInvoiceHTML;
