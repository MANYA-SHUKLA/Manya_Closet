import { IOrder } from '@manya-closet/types'
import { IUser } from '@manya-closet/types'

export function printInvoice(order: IOrder, user: IUser | null) {
  const win = window.open('', '_blank', 'width=820,height=960')
  if (!win) return

  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const rows = order.items.map((item) => `
    <tr>
      <td>${item.name}<br><small>${item.size} · ${item.color}</small></td>
      <td>${item.quantity}</td>
      <td>₹${item.price.toLocaleString()}</td>
      <td>₹${(item.price * item.quantity).toLocaleString()}</td>
    </tr>`).join('')

  const discountRow = order.discount > 0
    ? `<tr class="discount"><td colspan="3">Coupon Discount</td><td>−₹${order.discount.toLocaleString()}</td></tr>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<title>Invoice #${order._id.slice(-8).toUpperCase()} — Manya's Closet</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;background:#fff;padding:48px;max-width:760px;margin:0 auto}
  @media print{body{padding:24px}}
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:28px;border-bottom:2.5px solid #111;margin-bottom:28px}
  .brand{font-size:26px;font-weight:900;letter-spacing:-0.5px}.brand span{color:#f59e0b}
  .invoice-label{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#aaa;margin-bottom:4px}
  .invoice-id{font-size:22px;font-weight:900;color:#111}
  .invoice-meta{font-size:13px;color:#666;margin-top:6px;line-height:1.7}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:#f0fdf4;color:#16a34a;margin-top:4px}
  .badge.pending{background:#fffbeb;color:#b45309}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:28px}
  .section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#bbb;margin-bottom:8px}
  .address{font-size:14px;line-height:1.8;color:#333}
  .address strong{color:#111}
  table{width:100%;border-collapse:collapse;font-size:14px}
  thead tr{border-bottom:2px solid #111}
  th{padding:10px 0;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#aaa;font-weight:600}
  th:not(:first-child){text-align:right}
  td{padding:12px 0;border-bottom:1px solid #f4f4f4;color:#333;vertical-align:top}
  td:not(:first-child){text-align:right}
  td small{font-size:12px;color:#aaa;display:block;margin-top:2px}
  .totals{margin-top:20px;margin-left:auto;width:260px}
  .totals tr td{border:none;padding:5px 0;font-size:14px;color:#666}
  .totals tr td:last-child{text-align:right}
  .totals tr.discount td{color:#16a34a}
  .divider td{padding:6px 0!important}
  .divider-line{height:1px;background:#e5e5e5}
  .total-row td{font-size:18px;font-weight:900;color:#111;padding-top:10px!important;border-top:2px solid #111!important}
  .total-row td:last-child{color:#f59e0b}
  .footer{margin-top:48px;padding-top:20px;border-top:1px solid #eee;text-align:center;font-size:12px;color:#bbb;line-height:1.8}
</style>
</head><body>
<div class="header">
  <div>
    <div class="brand">Manya<span>'s</span> Closet</div>
    <div style="font-size:12px;color:#aaa;margin-top:3px">Fashion &amp; Lifestyle</div>
  </div>
  <div style="text-align:right">
    <div class="invoice-label">Invoice</div>
    <div class="invoice-id">#${order._id.slice(-8).toUpperCase()}</div>
    <div class="invoice-meta">
      ${date}<br>
      Order by: ${user?.name ?? order.shippingAddress.fullName}
    </div>
    <span class="badge${order.paymentStatus !== 'paid' ? ' pending' : ''}">
      ${order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Payment Pending'}
    </span>
  </div>
</div>

<div class="grid">
  <div>
    <div class="section-title">Bill To</div>
    <div class="address">
      <strong>${user?.name ?? order.shippingAddress.fullName}</strong><br>
      ${user?.email ? user.email + '<br>' : ''}
      ${order.shippingAddress.phone}
    </div>
  </div>
  <div>
    <div class="section-title">Ship To</div>
    <div class="address">
      <strong>${order.shippingAddress.fullName}</strong><br>
      ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} – ${order.shippingAddress.pincode}<br>
      ${order.shippingAddress.country}
    </div>
  </div>
</div>

<table>
  <thead>
    <tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr>
  </thead>
  <tbody>${rows}</tbody>
</table>

<table class="totals">
  <tbody>
    <tr><td>Subtotal</td><td>₹${order.subtotal.toLocaleString()}</td></tr>
    <tr><td>Shipping</td><td>${order.shippingCharge === 0 ? 'FREE' : '₹' + order.shippingCharge}</td></tr>
    ${discountRow}
    <tr class="divider"><td colspan="2"><div class="divider-line"></div></td></tr>
    <tr class="total-row"><td>Total</td><td>₹${order.total.toLocaleString()}</td></tr>
  </tbody>
</table>

<div class="footer">
  Thank you for shopping with Manya's Closet<br>
  This is a computer-generated invoice and does not require a physical signature.
</div>

<script>window.onload=()=>window.print()</script>
</body></html>`

  win.document.write(html)
  win.document.close()
}
