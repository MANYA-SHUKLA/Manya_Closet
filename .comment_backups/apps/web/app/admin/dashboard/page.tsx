'use client'
import { useAdminDashboard } from '@/hooks/useAdmin'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading } = useAdminDashboard()

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const { stats, salesByDay, ordersByStatus, recentOrders } = data
  const maxSales = Math.max(...salesByDay.map((d) => d.sales), 1)

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your store</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Sales"
          value={`₹${stats.totalSales.toLocaleString()}`}
          sub="from paid orders"
          color="text-indigo-600"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          sub="all time"
          color="text-gray-900"
        />
        <StatCard
          label="Customers"
          value={stats.totalUsers.toLocaleString()}
          sub="registered users"
          color="text-gray-900"
        />
        <StatCard
          label="Products"
          value={stats.totalProducts.toLocaleString()}
          sub="active listings"
          color="text-gray-900"
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Sales — Last 30 Days</h2>
          {salesByDay.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No paid orders in the last 30 days</p>
          ) : (
            <div className="flex items-end gap-1 h-36 overflow-x-auto pb-2">
              {salesByDay.map((day) => (
                <div key={day._id} className="flex flex-col items-center gap-1 flex-shrink-0 group">
                  <div className="relative">
                    <div
                      className="w-6 bg-indigo-500 rounded-t-sm group-hover:bg-indigo-600 transition-colors"
                      style={{ height: `${Math.max(4, (day.sales / maxSales) * 120)}px` }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      ₹{day.sales.toLocaleString()}<br />{day.count} orders
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-400 rotate-45 origin-left">{day._id.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {ordersByStatus.map((s) => (
              <div key={s._id} className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[s._id] ?? 'bg-gray-100 text-gray-700'}`}>
                  {s._id}
                </span>
                <span className="text-sm font-semibold text-gray-900">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.user?.name ?? '—'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">₹{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
