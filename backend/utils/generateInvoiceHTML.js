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
    `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=Order:${order._id}`;

  return `
  <html>
  <head>
    <style>

      body {
        font-family: Arial, sans-serif;
        background: #f5f5f7;
        padding: 25px;
      }

      .container {
        width: 760px;
        margin: auto;
        background: #fff;
        padding: 35px;
      }

      .muted {
        font-size: 12px;
        color: #666;
      }

      .title {
        font-size: 22px;
        font-weight: bold;
      }

      .section {
        margin-top: 30px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      td {
        padding: 6px 0;
        font-size: 13px;
      }

      .right {
        text-align: right;
      }

      .border-top {
        border-top: 1px solid #ddd;
      }

      .bold {
        font-weight: bold;
      }

      .small {
        font-size: 11px;
        color: #777;
      }

      .product {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .product img {
        width: 38px;
        height: 38px;
        object-fit: cover;
        border-radius: 6px;
      }

      .paid {
        display: inline-block;
        margin-top: 8px;
        padding: 4px 12px;
        background: #e6f4ea;
        color: #15803d;
        font-size: 11px;
        border-radius: 20px;
        font-weight: bold;
      }

      .meta {
        margin-top: 8px;
      }

      .meta div {
        font-size: 12px;
        color: #555;
        margin-top: 2px;
      }

    </style>
  </head>

  <body>

    <div class="container">

      <!-- HEADER -->
      <table>
        <tr>

          <td>
            <img src="${logoUrl}" height="42" /><br/>
            <span class="bold">Latika Organics</span><br/>
            <span class="muted">Healthy & Natural Products</span>
          </td>

          <td class="right">

            <div class="title">INVOICE</div>

            <div class="meta">
              <div><strong>${invoiceNumber}</strong></div>
              <div>${date}</div>
              ${paymentId ? `<div>Payment: ${paymentId}</div>` : ""}
            </div>

            <div class="paid">PAID</div>

          </td>

        </tr>
      </table>

      <!-- CUSTOMER -->
      <div class="section">

        <table>

          <tr>

            <td width="50%">
              <span class="bold">Customer</span><br/>
              ${order.name || "N/A"}<br/>
              ${order.phone || ""}<br/>
              ${order.email || ""}
            </td>

            <td width="50%">
              <span class="bold">Delivery Address</span><br/>

              <strong>${order.name || ""}</strong><br/>

              ${order.address?.address ||
                order.address?.street ||
                ""}<br/>

              ${order.address?.city || ""}

              ${order.address?.pincode
                ? ` - ${order.address.pincode}`
                : ""}
            </td>

          </tr>

        </table>

      </div>

      <!-- ITEMS -->
      <div class="section">

        <table>

          <tr class="border-top">
            <td class="bold">Product</td>
            <td class="right bold">Qty</td>
            <td class="right bold">Price</td>
            <td class="right bold">Total</td>
          </tr>

          ${(order.items || [])
            .map(
              (i) => `
            <tr>

              <td>
                <div class="product">

                  <img
                    src="${
                      i.image ||
                      "https://via.placeholder.com/40"
                    }"
                  />

                  ${i.name}

                </div>
              </td>

              <td class="right">
                ${i.quantity}
              </td>

              <td class="right">
                ₹${i.price}
              </td>

              <td class="right">
                ₹${i.price * i.quantity}
              </td>

            </tr>
          `
            )
            .join("")}

        </table>

      </div>

      <!-- TOTAL -->
      <div class="section">

        <table>

          <tr>
            <td class="right">Subtotal</td>
            <td class="right">₹${subtotal}</td>
          </tr>

          <tr class="border-top bold">
            <td
              class="right"
              style="font-size:16px;"
            >
              Total
            </td>

            <td
              class="right"
              style="font-size:16px;"
            >
              ₹${total}
            </td>

          </tr>

        </table>

      </div>

      <!-- FOOTER -->
      <div
        class="section"
        style="border-top:1px solid #ddd;padding-top:18px;"
      >

        <table>

          <tr>

            <td
              class="small"
              style="line-height:1.7;"
            >

              <strong>Latika Organics</strong><br/>

              Healthy & Natural Products<br/>

              Nashik, Maharashtra, India<br/><br/>

              <strong>Support:</strong>
              support@latikaorganics.com<br/>

              <span style="color:#999;">
                This is a computer-generated invoice
                and does not require a signature.
              </span>

            </td>

            <td align="right">

              <img src="${qrUrl}" /><br/>

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