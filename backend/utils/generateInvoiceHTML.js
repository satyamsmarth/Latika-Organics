function generateInvoiceHTML(order, paymentId = "") {
  const logoUrl =
    "https://res.cloudinary.com/dizwzwsww/image/upload/v1780548137/Latika_Logo_kpiu4b.png";

  const invoiceNumber = `INV-${order._id
    .toString()
    .slice(-6)
    .toUpperCase()}`;

  const date = new Date(order.createdAt).toLocaleString("en-IN");

  const subtotal = order.total || 0;
  const total = subtotal;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Order:${order._id}`;

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8" />

<style>

*{
  box-sizing:border-box;
}

body{
  margin:0;
  padding:20px;
  background:#f5f6f8;
  font-family:Arial,Helvetica,sans-serif;
  color:#222;
}

.container{
  max-width:800px;
  margin:auto;
  background:#ffffff;
  padding:35px;
  border-radius:10px;
  box-shadow:0 4px 20px rgba(0,0,0,0.08);
}

table{
  width:100%;
  border-collapse:collapse;
}

td{
  font-size:13px;
  padding:6px 0;
  vertical-align:top;
}

.title{
  font-size:28px;
  font-weight:700;
  color:#2E7D32;
}

.right{
  text-align:right;
}

.bold{
  font-weight:700;
}

.muted{
  color:#666;
  font-size:12px;
}

.small{
  color:#777;
  font-size:11px;
}

.section{
  margin-top:28px;
  page-break-inside:avoid;
}

.border-top{
  border-top:1px solid #e5e7eb;
}

.meta{
  margin-top:8px;
}

.meta div{
  font-size:12px;
  color:#555;
  margin-top:4px;
}

.paid{
  display:inline-block;
  margin-top:10px;
  background:#E8F5E9;
  color:#1B5E20;
  padding:6px 14px;
  border-radius:30px;
  font-size:11px;
  font-weight:700;
}

.product{
  display:flex;
  align-items:center;
  gap:12px;
}

.product img{
  width:42px;
  height:42px;
  object-fit:cover;
  border-radius:6px;
  border:1px solid #eee;
}

.items-table th{
  padding:12px 8px;
  font-size:13px;
  text-align:left;
  border-bottom:1px solid #ddd;
}

.items-table td{
  padding:12px 8px;
  border-bottom:1px solid #f0f0f0;
}

.items-table tr{
  page-break-inside:avoid;
}

.total-box{
  width:280px;
  margin-left:auto;
}

.total-box td{
  padding:10px 0;
}

.total-row{
  border-top:2px solid #ddd;
  font-size:16px;
  font-weight:700;
}

.thank-you{
  margin-top:30px;
  padding:18px;
  text-align:center;
  background:#F1F8E9;
  border:1px solid #DCECCB;
  border-radius:8px;
}

.thank-you h3{
  margin:0;
  color:#2E7D32;
  font-size:18px;
}

.thank-you p{
  margin-top:8px;
  color:#555;
  font-size:13px;
}

.footer{
  margin-top:30px;
  border-top:1px solid #e5e7eb;
  padding-top:18px;
}

.qr{
  width:100px;
  height:100px;
}

@media print{

  body{
    background:#fff;
    padding:0;
  }

  .container{
    max-width:100%;
    box-shadow:none;
    border-radius:0;
    padding:20px;
  }

  .section,
  .footer,
  .thank-you,
  table,
  tr,
  td{
    page-break-inside:avoid !important;
  }

}

</style>

</head>

<body>

<div class="container">

  <!-- HEADER -->

  <table>

    <tr>

      <td>

        <img
          src="${logoUrl}"
          height="48"
        />

        <div
          style="
            margin-top:8px;
            font-weight:700;
          "
        >
          Latika Organics
        </div>

        <div class="muted">
          Healthy & Natural Products
        </div>

      </td>

      <td class="right">

        <div class="title">
          INVOICE
        </div>

        <div class="meta">

          <div>
            <strong>${invoiceNumber}</strong>
          </div>

          <div>
            ${date}
          </div>

          ${
            paymentId
              ? `
          <div>
            Payment: ${paymentId}
          </div>
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

  <!-- CUSTOMER -->

  <div class="section">

    <table>

      <tr>

        <td width="50%">

          <span class="bold">
            Customer
          </span><br/>

          ${order.name || "N/A"}<br/>

          ${order.phone || ""}<br/>

          ${order.email || ""}

        </td>

        <td width="50%">

          <span class="bold">
            Delivery Address
          </span><br/>

          <strong>
            ${order.name || ""}
          </strong><br/>

          ${
            order.address?.address ||
            order.address?.street ||
            ""
          }<br/>

          ${order.address?.city || ""}

          ${
            order.address?.pincode
              ? ` - ${order.address.pincode}`
              : ""
          }

        </td>

      </tr>

    </table>

  </div>

  <!-- ITEMS -->

  <div class="section">

    <table class="items-table">

      <tr>

        <th>
          Product
        </th>

        <th class="right">
          Qty
        </th>

        <th class="right">
          Price
        </th>

        <th class="right">
          Total
        </th>

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
                  "https://via.placeholder.com/50"
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

  </div>

  <!-- TOTAL -->

  <div class="section">

    <div class="total-box">

      <table>

        <tr>

          <td class="right">
            Subtotal
          </td>

          <td class="right">
            ${formatCurrency(subtotal)}
          </td>

        </tr>

        <tr class="total-row">

          <td class="right">
            Total
          </td>

          <td class="right">
            ${formatCurrency(total)}
          </td>

        </tr>

      </table>

    </div>

  </div>

  <!-- THANK YOU BANNER -->

  <div class="thank-you">

    <h3>
      Thank You for Shopping with Latika Organics 🌿
    </h3>

    <p>
      We appreciate your trust in our natural and healthy products.
      Your support motivates us to continue delivering premium organic
      wellness solutions.
    </p>

  </div>

  <!-- FOOTER -->

  <div class="footer">

    <table>

      <tr>

        <td
          class="small"
          style="line-height:1.7;"
        >

          <strong>
            Latika Organics
          </strong><br/>

          Healthy & Natural Products<br/>

          Nashik, Maharashtra, India<br/><br/>

          <strong>
            Support:
          </strong>

          support@latikaorganics.com<br/>

          <span style="color:#999;">

            This is a computer-generated invoice
            and does not require a signature.

          </span>

        </td>

        <td align="right">

          <img
            src="${qrUrl}"
            class="qr"
          /><br/>

          <span class="small">
            Scan for order details
          </span>

        </td>

      </tr>

    </table>

  </div>

</div>

</body>
</html>
`;
}

module.exports = generateInvoiceHTML;