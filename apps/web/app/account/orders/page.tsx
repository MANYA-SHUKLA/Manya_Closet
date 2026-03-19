'use client'
import Link from 'next/link'
import { useOrders } from '@/hooks/useOrders'
import { OrderStatusBadge } from '@/components/account/StatusBadge'
import { FALLBACK_IMAGES } from '@/lib/imageUtils'

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-20 bg-gray-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-sm text-gray-400 mb-6">Your orders will appear here once you place one.</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-amber-500 hover:text-black transition-all text-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const firstImg = order.items[0]?.image || FALLBACK_IMAGES[0]
            const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
            return (
              <div key={order._id} className="bg-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all overflow-hidden">
                <div className="flex items-center gap-5 p-5">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-100">
                      <img src={firstImg} alt="" className="w-full h-full object-cover" />
                    </div>
                    {order.items.length > 1 && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">+{order.items.length - 1}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                        <code className="text-sm font-bold text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </code>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{date}</span>
                      <span>·</span>
                      <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      <span>·</span>
                      <span className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link
                    href={`/account/orders/${order._id}`}
                    className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-amber-600 transition-colors"
                  >
                    View
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
