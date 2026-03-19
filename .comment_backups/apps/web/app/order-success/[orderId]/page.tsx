'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import api from '@/lib/axios'
import { IOrder } from '@manya-closet/types'
import { useAuthStore } from '@/store/authStore'
import { printInvoice } from '@/lib/printInvoice'
import OrderStepper from '@/components/account/OrderStepper'
import confetti from 'canvas-confetti'

function launchConfetti() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e'] })
}

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<IOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    let cancelled = false
    api.get(`/orders/${orderId}`)
      .then(({ data }) => { if (!cancelled) { setOrder(data.data); launchConfetti() } })
      .catch(() => null)
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [orderId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-bold text-neutral-900">Order not found</h2>
        <Link href="/" className="text-amber-600 hover:underline text-sm mt-3 block">Go home</Link>
      </div>
    </div>
  )

  const estimatedDate = new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="bg-white rounded-3xl border border-neutral-100 p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-neutral-900 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-neutral-500 text-sm">
            Thank you for shopping with Manya&apos;s Closet. Your order is being processed.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-100 rounded-full">
            <span className="text-xs text-neutral-500">Order ID</span>
            <code className="text-sm font-bold text-neutral-800">#{order._id.slice(-8).toUpperCase()}</code>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 p-7 shadow-sm">
          <h2 className="font-bold text-neutral-900 mb-6">Order Status</h2>
          <OrderStepper status={order.status} />
          <p className="text-xs text-neutral-500 mt-4 text-center">
            Estimated delivery: <strong>{estimatedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 p-7 shadow-sm">
          <h2 className="font-bold text-neutral-900 mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-neutral-50 last:border-0">
                <div className="w-12 h-14 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Qty {item.quantity} · {item.size} · {item.color}</p>
                </div>
                <p className="text-sm font-bold text-neutral-900">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-950 text-white rounded-3xl p-7 space-y-3">
          <h2 className="font-bold mb-2">Payment Summary</h2>
          {[
            { label: 'Subtotal',  val: `₹${order.subtotal.toLocaleString()}` },
            { label: 'Shipping',  val: order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}` },
            ...(order.discount > 0 ? [{ label: 'Discount', val: `-₹${order.discount.toLocaleString()}` }] : []),
          ].map(({ label, val }) => (
            <div key={label} className="flex justify-between text-sm text-neutral-400">
              <span>{label}</span>
              <span className={val === 'FREE' || val.startsWith('-') ? 'text-emerald-400' : 'text-white'}>{val}</span>
            </div>
          ))}
          <div className="h-px bg-white/10" />
          <div className="flex justify-between font-black text-lg">
            <span>Total Paid</span>
            <span className="text-amber-400">₹{order.total.toLocaleString()}</span>
          </div>
          <div className="text-xs text-neutral-500 pt-1">
            {order.paymentStatus === 'paid' ? '✓ Payment confirmed' : '⏳ Payment pending'}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 p-7 shadow-sm">
          <h2 className="font-bold text-neutral-900 mb-3">Delivering to</h2>
          <div className="text-sm text-neutral-600 space-y-1">
            <p className="font-semibold text-neutral-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
            <p className="text-neutral-500">📞 {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/account/orders"
            className="flex-1 py-3.5 bg-neutral-900 text-white font-bold rounded-2xl text-center hover:bg-neutral-700 transition-all"
          >
            Track My Orders
          </Link>
          <button
            onClick={() => printInvoice(order, user)}
            className="flex-1 py-3.5 border border-neutral-200 text-neutral-700 font-semibold rounded-2xl text-center hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Invoice
          </button>
          <Link
            href="/shop"
            className="flex-1 py-3.5 border border-neutral-200 text-neutral-700 font-semibold rounded-2xl text-center hover:bg-neutral-50 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
