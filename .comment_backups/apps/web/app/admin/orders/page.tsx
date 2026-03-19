'use client'
import { useState } from 'react'
import { useAdminOrders, useUpdateOrderStatus, AdminOrder } from '@/hooks/useAdmin'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'] as const
type OrderStatus = typeof STATUSES[number]

const STATUS_COLORS: Record<string, string> = {
  pending:          'bg-amber-100 text-amber-700',
  confirmed:        'bg-blue-100 text-blue-700',
  shipped:          'bg-indigo-100 text-indigo-700',
  delivered:        'bg-green-100 text-green-700',
  return_requested: 'bg-orange-100 text-orange-700',
  cancelled:        'bg-red-100 text-red-700',
  refunded:         'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<string, string> = {
  return_requested: 'Return Requested',
}

const NEXT_STATUS: Record<string, OrderStatus[]> = {
  pending:          ['confirmed', 'cancelled'],
  confirmed:        ['shipped', 'cancelled'],
  shipped:          ['delivered'],
  delivered:        ['refunded'],
  return_requested: ['refunded'],
  cancelled:        [],
  refunded:         [],
}

function RefundModal({ order, onConfirm, onClose }: {
  order: AdminOrder
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="text-3xl text-center mb-3">💸</div>
          <h2 className="font-bold text-gray-900 text-center mb-2">Issue Refund?</h2>
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            This will refund order <span className="font-semibold text-gray-700">#{order._id.slice(-8).toUpperCase()}</span> (₹{order.total.toLocaleString()}).
            Stock will be restored and the customer will be notified by email.
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors">
            Confirm Refund
          </button>
        </div>
      </div>
    </div>
  )
}

function OrderRow({ order, onStatusChange, onRefund, isUpdating }: {
  order: AdminOrder
  onStatusChange: (id: string, status: string) => void
  onRefund: (order: AdminOrder) => void
  isUpdating: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const nextOptions = NEXT_STATUS[order.status] ?? []
  const canRefund = order.status === 'delivered' || order.status === 'return_requested'

  return (
    <>
      <tr className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${expanded ? 'bg-gray-50/50' : ''}`}>
        <td className="px-6 py-4" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <svg
              className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div>
              <p className="font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
              <p className="text-xs text-gray-400 capitalize mt-0.5">{order.paymentMethod}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4" onClick={() => setExpanded(!expanded)}>
          <p className="font-medium text-gray-900 text-sm">{order.user?.name ?? '—'}</p>
          <p className="text-xs text-gray-400">{order.user?.email}</p>
        </td>
        <td className="px-6 py-4 text-gray-500 text-xs" onClick={() => setExpanded(!expanded)}>
          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </td>
        <td className="px-6 py-4 text-right font-semibold text-gray-900" onClick={() => setExpanded(!expanded)}>
          ₹{order.total.toLocaleString()}
        </td>
        <td className="px-6 py-4" onClick={() => setExpanded(!expanded)}>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
            {order.paymentStatus}
          </span>
        </td>
        <td className="px-6 py-4" onClick={() => setExpanded(!expanded)}>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {canRefund && (
              <button
                disabled={isUpdating}
                onClick={() => onRefund(order)}
                className="px-3 py-1.5 text-xs font-medium text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50 border border-orange-200"
              >
                Refund
              </button>
            )}
            {nextOptions.filter(s => s !== 'refunded').length > 0 && (
              <select
                disabled={isUpdating}
                value=""
                onChange={(e) => e.target.value && onStatusChange(order._id, e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
              >
                <option value="">Move to…</option>
                {nextOptions.filter(s => s !== 'refunded').map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            )}
            {!canRefund && nextOptions.length === 0 && (
              <span className="text-xs text-gray-400">—</span>
            )}
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-gray-100 bg-gray-50/70">
          <td colSpan={7} className="px-6 py-4">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Order Items ({order.items.length})
                </p>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} · ₹{item.price.toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 flex-shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {order.shippingAddress && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Shipping Address
                  </p>
                  <div className="text-sm text-gray-700 space-y-0.5">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AdminOrdersPage() {
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [refundTarget, setRefundTarget] = useState<AdminOrder | null>(null)

  const { data, refetch } = useAdminOrders({ page, status: filterStatus || undefined })
  const { mutate: updateStatus } = useUpdateOrderStatus()

  const orders = data?.data ?? []
  const pagination = data?.pagination

  const handleStatusChange = (orderId: string, status: string) => {
    setUpdatingId(orderId)
    updateStatus(
      { id: orderId, status },
      {
        onSuccess: () => { refetch(); setUpdatingId(null) },
        onError: () => setUpdatingId(null),
      }
    )
  }

  return (
    <div className="p-4 sm:p-8">
      {refundTarget && (
        <RefundModal
          order={refundTarget}
          onConfirm={() => { handleStatusChange(refundTarget._id, 'refunded'); setRefundTarget(null) }}
          onClose={() => setRefundTarget(null)}
        />
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          {pagination && <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total</p>}
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => { setFilterStatus(''); setPage(1) }}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!filterStatus ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setFilterStatus(s); setPage(1) }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filterStatus === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-3">Click a row to expand order details</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  onRefund={setRefundTarget}
                  isUpdating={updatingId === order._id}
                />
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Page {page} of {pagination.pages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}
                className="px-4 py-1.5 border border-gray-200 rounded-lg text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                Prev
              </button>
              <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}
                className="px-4 py-1.5 border border-gray-200 rounded-lg text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
