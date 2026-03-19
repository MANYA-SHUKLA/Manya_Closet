'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useOrder, useRequestReturn } from '@/hooks/useOrders'
import { useAuthStore } from '@/store/authStore'
import OrderStepper from '@/components/account/OrderStepper'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/account/StatusBadge'
import { printInvoice } from '@/lib/printInvoice'

const DELIVERY_DAYS: Record<string, number> = { standard: 7, express: 3, sameday: 1 }

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { data: order, isLoading } = useOrder(orderId)
  const user = useAuthStore((s) => s.user)
  const [returnModal, setReturnModal] = useState(false)
  const [returnReason, setReturnReason] = useState('')
  const { mutate: requestReturn, isPending: returning, isSuccess: returnDone } = useRequestReturn(orderId)

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!order) return (
    <div className="bg-white rounded-3xl border border-neutral-100 p-16 text-center">
      <p className="text-4xl mb-4">😕</p>
      <h2 className="text-lg font-bold text-neutral-900 mb-4">Order not found</h2>
      <Link href="/account/orders" className="text-amber-600 hover:underline text-sm">
        ← Back to orders
      </Link>
    </div>
  )

  const deliveryDays = DELIVERY_DAYS.standard
  const estimatedDate = new Date(new Date(order.createdAt).getTime() + deliveryDays * 24 * 60 * 60 * 1000)
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link href="/account/orders" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors mb-2 block">
            ← Back to orders
          </Link>
          <h1 className="text-xl font-black text-neutral-900">
            Order <code className="font-black">#{order._id.slice(-8).toUpperCase()}</code>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">{orderDate}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
          {order.status === 'delivered' && (
            <button
              onClick={() => setReturnModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold rounded-xl hover:bg-orange-100 transition-all"
            >
              ↩ Request Return
            </button>
          )}
          <button
            onClick={() => printInvoice(order, user)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-amber-500 hover:text-black transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Invoice
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 p-7">
        <h2 className="font-bold text-neutral-900 mb-6">Order Tracking</h2>
        <OrderStepper status={order.status} />
        {order.status !== 'cancelled' && order.status !== 'refunded' && order.status !== 'delivered' && (
          <p className="text-xs text-neutral-500 mt-4 text-center">
            Estimated delivery:{' '}
            <strong>{estimatedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
          </p>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 p-7">
        <h2 className="font-bold text-neutral-900 mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-neutral-50 last:border-0">
              <div className="w-14 h-16 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900 line-clamp-1">{item.name}</p>
                <p className="text-xs text-neutral-400 mt-0.5">Qty {item.quantity} · {item.size} · {item.color}</p>
              </div>
              <p className="text-sm font-bold text-neutral-900 flex-shrink-0">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-neutral-950 text-white rounded-3xl p-6 space-y-3">
          <h2 className="font-bold mb-1">Payment Summary</h2>
          {[
            { label: 'Subtotal', val: `₹${order.subtotal.toLocaleString()}` },
            { label: 'Shipping', val: order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}` },
            ...(order.discount > 0 ? [{ label: 'Discount', val: `-₹${order.discount.toLocaleString()}` }] : []),
          ].map(({ label, val }) => (
            <div key={label} className="flex justify-between text-sm text-neutral-400">
              <span>{label}</span>
              <span className={val === 'FREE' || val.startsWith('-') ? 'text-emerald-400' : 'text-white'}>{val}</span>
            </div>
          ))}
          <div className="h-px bg-white/10" />
          <div className="flex justify-between font-black">
            <span>Total Paid</span>
            <span className="text-amber-400">₹{order.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 p-6">
          <h2 className="font-bold text-neutral-900 mb-3">Delivering to</h2>
          <div className="text-sm text-neutral-600 space-y-1">
            <p className="font-semibold text-neutral-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
            <p className="text-neutral-400">📞 {order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>

      {returnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
              <div>
                <h2 className="font-bold text-neutral-900">Request Return</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Order #{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setReturnModal(false)} className="text-neutral-400 hover:text-neutral-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {returnDone ? (
              <div className="px-6 py-10 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-bold text-neutral-900 mb-1">Return Requested</h3>
                <p className="text-sm text-neutral-500">Our team has been notified and will get back to you shortly.</p>
                <button onClick={() => setReturnModal(false)}
                  className="mt-6 px-6 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-amber-500 hover:text-black transition-all">
                  Close
                </button>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm text-neutral-600">Please tell us why you&apos;d like to return this order. Our team will review your request and get back to you.</p>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  rows={4}
                  placeholder="e.g. Wrong size, damaged item, not as described..."
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 resize-none"
                />
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setReturnModal(false)}
                    className="flex-1 py-2.5 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    disabled={!returnReason.trim() || returning}
                    onClick={() => requestReturn(returnReason)}
                    className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    {returning ? 'Submitting…' : 'Submit Request'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
