'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useOrders } from '@/hooks/useOrders'
import { useMyReturns, useCreateReturn, ReturnItem } from '@/hooks/useReturns'

const RETURN_WINDOW_DAYS = 7

const REASONS = [
  { value: 'defective',        label: 'Defective / Damaged product' },
  { value: 'wrong_item',       label: 'Wrong item received' },
  { value: 'size_issue',       label: 'Size / Fit issue' },
  { value: 'not_as_described', label: 'Not as described' },
  { value: 'other',            label: 'Other' },
]

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700',
  approved:  'bg-emerald-100 text-emerald-700',
  rejected:  'bg-rose-100 text-rose-700',
  completed: 'bg-indigo-100 text-indigo-700',
}

const POLICY = [
  {
    icon: '📦',
    title: '7-Day Return Window',
    body: 'Initiate your return within 7 days of delivery. Items must be unused, unwashed, and in original packaging.',
  },
  {
    icon: '✅',
    title: 'Eligible Items',
    body: 'Clothing, footwear, and accessories in their original condition with tags attached are eligible for return.',
  },
  {
    icon: '💳',
    title: 'Refund Process',
    body: 'Approved refunds are processed within 5–7 business days to your original payment method.',
  },
  {
    icon: '🚚',
    title: 'Free Pickup',
    body: 'We arrange a free doorstep pickup for approved returns. No need to visit a store or courier center.',
  },
]

function isWithinReturnWindow(deliveredAt: string) {
  const d = new Date(deliveredAt)
  const windowEnd = new Date(d.getTime() + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000)
  return new Date() <= windowEnd
}

export default function ReturnsPage() {
  const user = useAuthStore((s) => s.user)
  const { data: orders = [] } = useOrders()
  const { data: myReturns = [], isLoading: loadingReturns } = useMyReturns()
  const { mutate: submitReturn, isPending, error, isSuccess, reset } = useCreateReturn()

  const [showForm, setShowForm]       = useState(false)
  const [selectedOrder, setSelectedOrder] = useState('')
  const [selectedItems, setSelectedItems] = useState<ReturnItem[]>([])
  const [reason, setReason]           = useState('')
  const [description, setDescription] = useState('')

  const returnedOrderIds = new Set(myReturns.map((r) => r.order._id))
  const eligibleOrders = orders.filter(
    (o) => o.status === 'delivered' && !returnedOrderIds.has(o._id) && isWithinReturnWindow(o.updatedAt as string)
  )

  const orderItems = orders.find((o) => o._id === selectedOrder)?.items ?? []

  function toggleItem(item: typeof orderItems[0]) {
    const exists = selectedItems.find((i) => i.product === item.product._id)
    if (exists) {
      setSelectedItems((prev) => prev.filter((i) => i.product !== item.product._id))
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          product:  item.product._id,
          name:     item.name,
          image:    item.image,
          quantity: item.quantity,
          price:    item.price,
          size:     item.size,
          color:    item.color,
        },
      ])
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedOrder || !selectedItems.length || !reason) return
    submitReturn({ orderId: selectedOrder, items: selectedItems, reason, description })
  }

  function resetForm() {
    setShowForm(false)
    setSelectedOrder('')
    setSelectedItems([])
    setReason('')
    setDescription('')
    reset()
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">

      {/* Hero */}
      <div className="bg-neutral-950 text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 text-center">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Hassle-free</p>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Returns &amp; Exchanges
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto">
            Not happy with your order? We&apos;ve got you covered. Return eligible items within 7 days of delivery.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 space-y-12">

        {/* Policy cards */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Return Policy</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POLICY.map(({ icon, title, body }) => (
              <div key={title} className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3 shadow-sm">
                <span className="text-3xl">{icon}</span>
                <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Non-eligible note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 text-sm text-amber-800">
          <strong>Not eligible for return:</strong> Innerwear, swimwear, customised items, and products marked as final sale.
        </div>

        {/* My returns — logged-in only */}
        {user ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">My Return Requests</h2>
                <p className="text-xs text-gray-400 mt-0.5">Track the status of returns you&apos;ve initiated</p>
              </div>
              {eligibleOrders.length > 0 && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-amber-500 hover:text-black text-white text-sm font-semibold rounded-xl transition-all"
                >
                  + Request Return
                </button>
              )}
            </div>

            {/* Return request form */}
            {showForm && (
              <div className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">New Return Request</h3>
                  <button onClick={resetForm} className="text-xs text-gray-400 hover:text-rose-500 transition-colors">
                    Cancel
                  </button>
                </div>

                {isSuccess ? (
                  <div className="text-center py-8 space-y-3">
                    <span className="text-5xl">✅</span>
                    <p className="font-bold text-gray-900">Return request submitted!</p>
                    <p className="text-sm text-gray-500">We&apos;ll review it within 1–2 business days and email you.</p>
                    <button
                      onClick={resetForm}
                      className="mt-4 px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-amber-500 hover:text-black transition-all"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1 — select order */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Select Order</label>
                      <select
                        value={selectedOrder}
                        onChange={(e) => { setSelectedOrder(e.target.value); setSelectedItems([]) }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        required
                      >
                        <option value="">— Pick an order —</option>
                        {eligibleOrders.map((o) => (
                          <option key={o._id} value={o._id}>
                            #{o._id.slice(-8).toUpperCase()} · ₹{o.total.toLocaleString()} ·{' '}
                            {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Step 2 — select items */}
                    {selectedOrder && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Select Items to Return</label>
                        <div className="space-y-2">
                          {orderItems.map((item, idx) => {
                            const checked = !!selectedItems.find((i) => i.product === item.product._id)
                            return (
                              <label
                                key={idx}
                                className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-colors ${
                                  checked ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleItem(item)}
                                  className="accent-amber-500 w-4 h-4 flex-shrink-0"
                                />
                                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-400">{item.size} · {item.color} · Qty {item.quantity}</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900 flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 3 — reason */}
                    {selectedItems.length > 0 && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">Reason for Return</label>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {REASONS.map(({ value, label }) => (
                              <label
                                key={value}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                                  reason === value ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="reason"
                                  value={value}
                                  checked={reason === value}
                                  onChange={() => setReason(value)}
                                  className="accent-amber-500 flex-shrink-0"
                                />
                                <span className="text-sm text-gray-800">{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Additional Details <span className="text-gray-400 font-normal">(optional)</span>
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue in more detail..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                          />
                        </div>

                        {/* Refund preview */}
                        <div className="flex items-center justify-between px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <span className="text-sm text-emerald-700">Estimated refund</span>
                          <span className="text-sm font-bold text-emerald-700">
                            ₹{selectedItems.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString()}
                          </span>
                        </div>

                        {error && (
                          <p className="text-rose-500 text-xs">
                            {(error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Something went wrong'}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={isPending || !reason}
                          className="w-full py-4 bg-gray-900 hover:bg-amber-500 hover:text-black text-white font-bold rounded-2xl transition-all disabled:opacity-50"
                        >
                          {isPending ? 'Submitting…' : 'Submit Return Request'}
                        </button>
                      </>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* Existing return requests */}
            {loadingReturns ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 animate-pulse h-24" />
                ))}
              </div>
            ) : myReturns.length === 0 && !showForm ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-14 text-center">
                <p className="text-4xl mb-4">📦</p>
                <h3 className="font-bold text-gray-900 mb-1">No return requests yet</h3>
                <p className="text-sm text-gray-400 mb-6">
                  {eligibleOrders.length > 0
                    ? 'You have delivered orders eligible for return.'
                    : 'Once your orders are delivered, you can request returns here.'}
                </p>
                {eligibleOrders.length > 0 && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-amber-500 hover:text-black transition-all"
                  >
                    Request a Return
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {myReturns.map((ret) => (
                  <div key={ret._id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Return Request</p>
                        <code className="text-sm font-bold text-gray-900">#{ret._id.slice(-8).toUpperCase()}</code>
                        <p className="text-xs text-gray-400 mt-1">
                          Order #{ret.order._id.slice(-8).toUpperCase()} ·{' '}
                          {new Date(ret.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[ret.status]}`}>
                        {ret.status}
                      </span>
                    </div>

                    <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                      {ret.items.map((item, i) => (
                        <div key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                          <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded-lg" />
                          <div>
                            <p className="text-xs font-medium text-gray-900 max-w-[120px] truncate">{item.name}</p>
                            <p className="text-[11px] text-gray-400">Qty {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                      <div className="text-xs text-gray-500">
                        <span className="capitalize">{REASONS.find((r) => r.value === ret.reason)?.label ?? ret.reason}</span>
                        {ret.description && <span className="ml-2 text-gray-400">· {ret.description}</span>}
                      </div>
                      <p className="text-sm font-bold text-emerald-600">₹{ret.refundAmount.toLocaleString()} refund</p>
                    </div>

                    {ret.adminNote && (
                      <div className="mt-3 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <p className="text-xs text-indigo-700"><strong>Note from us:</strong> {ret.adminNote}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Guest CTA */
          <div className="bg-white rounded-3xl border border-gray-100 p-14 text-center shadow-sm">
            <p className="text-5xl mb-5">🔐</p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sign in to manage returns</h3>
            <p className="text-sm text-gray-400 mb-6">Track your return requests and initiate new ones from your account.</p>
            <Link
              href="/login?redirect=/returns"
              className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-amber-500 hover:text-black transition-all text-sm"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Help */}
        <div className="text-center text-sm text-gray-400">
          Questions about your return?{' '}
          <Link href="/contact" className="text-amber-600 hover:underline font-medium">Contact us</Link>
        </div>
      </div>
    </div>
  )
}
