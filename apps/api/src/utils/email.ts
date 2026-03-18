import nodemailer from 'nodemailer'
import { env } from '../config/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT) || 587,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
})

export const sendNewsletterWelcome = async (email: string) => {
  await transporter.sendMail({
    from: `"Manya's Closet" <${env.SMTP_USER}>`,
    to: email,
    subject: "You're on the list! 🎉 Welcome to Manya's Closet",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:0">
        <div style="background:linear-gradient(135deg,#0f0e1e,#1e1a4a);padding:48px 32px;text-align:center;border-radius:16px 16px 0 0">
          <h1 style="color:#fff;font-size:36px;font-family:Georgia,serif;margin:0 0 8px">Manya's <em style="color:#f59e0b">Closet</em></h1>
          <p style="color:#a5b4fc;font-size:12px;letter-spacing:3px;margin:0;text-transform:uppercase">Premium Fashion</p>
        </div>
        <div style="background:#fff;padding:40px 32px;border-radius:0 0 16px 16px;border:1px solid #e5e7eb;border-top:none">
          <h2 style="color:#111827;font-size:24px;font-family:Georgia,serif;margin:0 0 16px">You're officially on the list!</h2>
          <p style="color:#6b7280;line-height:1.7;margin:0 0 24px">
            Thank you for subscribing to Manya's Closet. You'll be the first to know about:
          </p>
          <ul style="color:#6b7280;line-height:2;padding-left:20px;margin:0 0 32px">
            <li>✨ New collection drops</li>
            <li>🎉 Exclusive subscriber-only deals</li>
            <li>🛍️ Flash sales and early access events</li>
            <li>💌 Style tips and trend reports</li>
          </ul>
          <a href="${env.CLIENT_URL}/shop"
             style="display:inline-block;padding:14px 32px;background:#6366f1;color:#fff;font-weight:600;border-radius:100px;text-decoration:none;font-size:14px">
            Shop the Collection →
          </a>
          <p style="color:#9ca3af;font-size:11px;margin:24px 0 0">
            You subscribed with ${email}.
            If this wasn't you, you can ignore this email.
          </p>
        </div>
      </div>
    `,
  })
}

export const sendNewsletterAdminNotification = async (subscriberEmail: string, totalCount: number) => {
  const adminEmail = env.ADMIN_EMAIL || env.SMTP_USER
  if (!adminEmail) return
  await transporter.sendMail({
    from: `"Manya's Closet" <${env.SMTP_USER}>`,
    to: adminEmail,
    subject: `📬 New Newsletter Subscriber — ${subscriberEmail}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#f9fafb;border-radius:16px;border:1px solid #e5e7eb">
        <h2 style="color:#111827;margin:0 0 16px">New Newsletter Subscriber</h2>
        <p style="color:#6b7280;margin:0 0 8px">A new user subscribed to the Manya's Closet newsletter.</p>
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:16px 0">
          <p style="margin:0 0 6px;font-size:13px;color:#6b7280">Email</p>
          <p style="margin:0;font-weight:600;color:#111827">${subscriberEmail}</p>
        </div>
        <div style="background:#eef2ff;border-radius:12px;padding:16px;text-align:center">
          <p style="margin:0;font-size:13px;color:#6366f1">Total subscribers: <strong>${totalCount}</strong></p>
        </div>
      </div>
    `,
  })
}

interface OrderItem {
  name: string
  quantity: number
  price: number
  size?: string
  color?: string
}

interface OrderEmailData {
  _id: unknown
  items: OrderItem[]
  subtotal: number
  shippingCharge: number
  discount: number
  total: number
  status: string
  paymentStatus: string
  shippingAddress: { fullName: string; addressLine1: string; city: string; state: string; pincode: string }
}

const BRAND_HEADER = `
  <div style="background:linear-gradient(135deg,#0f0e1e,#1e1a4a);padding:32px;text-align:center">
    <h1 style="color:#fff;font-size:28px;font-family:Georgia,serif;margin:0">
      Manya&apos;s <em style="color:#f59e0b">Closet</em>
    </h1>
  </div>
`

function orderItemsTable(items: OrderItem[]) {
  return items.map((item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-size:14px">
        ${item.name}${item.size ? ` — ${item.size}` : ''}${item.color ? ` / ${item.color}` : ''}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:center;color:#6b7280;font-size:14px">
        ×${item.quantity}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;color:#111827;font-size:14px;font-weight:600">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('')
}

export const sendOrderConfirmation = async (order: OrderEmailData, userName: string, userEmail: string) => {
  const addr = order.shippingAddress
  await transporter.sendMail({
    from: `"Manya's Closet" <${env.SMTP_USER}>`,
    to: userEmail,
    subject: `Order Confirmed #${String(order._id).slice(-8).toUpperCase()} — Manya's Closet`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:0;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
        ${BRAND_HEADER}
        <div style="padding:32px;background:#fff">
          <h2 style="color:#111827;margin:0 0 8px">Thank you, ${userName}! 🎉</h2>
          <p style="color:#6b7280;margin:0 0 24px">Your order has been confirmed and is being processed.</p>

          <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px">
            <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px">Order ID</p>
            <p style="margin:0;font-weight:700;color:#111827">#${String(order._id).slice(-8).toUpperCase()}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            <thead>
              <tr>
                <th style="text-align:left;font-size:12px;color:#9ca3af;padding-bottom:8px;text-transform:uppercase;letter-spacing:1px">Item</th>
                <th style="text-align:center;font-size:12px;color:#9ca3af;padding-bottom:8px;text-transform:uppercase;letter-spacing:1px">Qty</th>
                <th style="text-align:right;font-size:12px;color:#9ca3af;padding-bottom:8px;text-transform:uppercase;letter-spacing:1px">Price</th>
              </tr>
            </thead>
            <tbody>${orderItemsTable(order.items)}</tbody>
          </table>

          <div style="border-top:2px solid #f3f4f6;padding-top:16px;space-y:4px">
            ${order.shippingCharge > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:#6b7280;font-size:13px">Shipping</span><span style="color:#111827;font-size:13px">₹${order.shippingCharge}</span></div>` : ''}
            ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:#10b981;font-size:13px">Discount</span><span style="color:#10b981;font-size:13px">−₹${order.discount}</span></div>` : ''}
            <div style="display:flex;justify-content:space-between;margin-top:8px">
              <span style="font-weight:700;font-size:16px;color:#111827">Total</span>
              <span style="font-weight:700;font-size:16px;color:#6366f1">₹${order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-top:24px">
            <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px">Delivering to</p>
            <p style="margin:0;color:#111827;font-size:14px;line-height:1.6">
              ${addr.fullName}<br/>
              ${addr.addressLine1}, ${addr.city}, ${addr.state} — ${addr.pincode}
            </p>
          </div>

          <a href="${env.CLIENT_URL}/account/orders"
             style="display:block;margin-top:28px;padding:14px;background:#6366f1;color:#fff;font-weight:600;border-radius:12px;text-decoration:none;text-align:center;font-size:14px">
            Track Your Order →
          </a>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center">
          <p style="margin:0;font-size:12px;color:#9ca3af">© 2026 Manya's Closet. Questions? <a href="mailto:${env.SMTP_USER}" style="color:#6366f1;text-decoration:none">Contact us</a></p>
        </div>
      </div>
    `,
  })
}

const STATUS_COPY: Record<string, { emoji: string; headline: string; body: string }> = {
  shipped:   { emoji: '🚚', headline: 'Your order is on its way!', body: 'Your order has been shipped and is heading to you. You can expect it within the estimated delivery window.' },
  delivered: { emoji: '✅', headline: 'Order Delivered!', body: 'Your order has been delivered. We hope you love your new look! Please leave a review to help other shoppers.' },
  cancelled: { emoji: '❌', headline: 'Order Cancelled', body: 'Your order has been cancelled. If you paid online, your refund will be processed within 5-7 business days.' },
  refunded:  { emoji: '💸', headline: 'Refund Initiated', body: 'Your refund has been initiated and will reflect in your account within 5-7 business days.' },
}

export const sendOrderStatusUpdate = async (
  orderId: string,
  status: string,
  userName: string,
  userEmail: string
) => {
  const copy = STATUS_COPY[status]
  if (!copy) return
  await transporter.sendMail({
    from: `"Manya's Closet" <${env.SMTP_USER}>`,
    to: userEmail,
    subject: `${copy.emoji} ${copy.headline} — Order #${orderId.slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
        ${BRAND_HEADER}
        <div style="padding:32px;background:#fff">
          <div style="font-size:48px;text-align:center;margin-bottom:16px">${copy.emoji}</div>
          <h2 style="color:#111827;text-align:center;margin:0 0 12px">${copy.headline}</h2>
          <p style="color:#6b7280;text-align:center;line-height:1.6;margin:0 0 28px">
            Hi ${userName}, ${copy.body}
          </p>
          <div style="background:#f9fafb;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px">
            <p style="margin:0;font-size:13px;color:#9ca3af">Order ID</p>
            <p style="margin:4px 0 0;font-weight:700;color:#111827">#${orderId.slice(-8).toUpperCase()}</p>
          </div>
          <a href="${env.CLIENT_URL}/account/orders"
             style="display:block;padding:14px;background:#6366f1;color:#fff;font-weight:600;border-radius:12px;text-decoration:none;text-align:center;font-size:14px">
            View Order Details →
          </a>
        </div>
      </div>
    `,
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from: `"Manya's Closet" <${env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
        <h2 style="color:#171717">Reset your password</h2>
        <p style="color:#525252">Click the button below to reset your password. This link expires in <strong>10 minutes</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;margin:24px 0;padding:12px 28px;background:#f59e0b;color:#000;font-weight:600;border-radius:100px;text-decoration:none">
          Reset Password
        </a>
        <p style="color:#a3a3a3;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  })
}
