'use client'
import { useState, useEffect } from 'react'
import {
  useAdminCoupons, useCreateCoupon, useUpdateCoupon,
  useToggleCoupon, useDeleteCoupon, AdminCoupon,
} from '@/hooks/useAdmin'

interface CouponForm {
  code: string
  type: 'percentage' | 'flat'
  value: string
  minOrderAmount: string
  maxDiscount: string
  maxUses: string
  expiresAt: string
  isActive: boolean
}

const EMPTY_FORM: CouponForm = {
  code: '', type: 'percentage', value: '', minOrderAmount: '0',
  maxDiscount: '', maxUses: '1000',
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  isActive: true,
}

function toForm(c: AdminCoupon): CouponForm {
  return {
    code: c.code, type: c.type, value: String(c.value),
    minOrderAmount: String(c.minOrderAmount),
    maxDiscount: c.maxDiscount ? String(c.maxDiscount) : '',
    maxUses: String(c.maxUses),
    expiresAt: new Date(c.expiresAt).toISOString().slice(0, 10),
    isActive: c.isActive,
  }
}

function CouponDrawer({
  coupon, onClose,
}: {
  coupon: AdminCoupon | null
  onClose: () => void
}) {
  const [form, setForm] = useState<CouponForm>(coupon ? toForm(coupon) : EMPTY_FORM)
  const [error, setError] = useState('')
  const { mutate: create, isPending: creating } = useCreateCoupon()
  const { mutate: update, isPending: updating } = useUpdateCoupon()

  useEffect(() => {
    setForm(coupon ? toForm(coupon) : EMPTY_FORM)
    setError('')
  }, [coupon])

  const isPending = creating || updating
  const set = (k: keyof CouponForm, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.code.trim() || !form.value || !form.expiresAt) {
      setError('Code, value, and expiry date are required.')
      return
    }
    const body = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      ...(form.maxDiscount ? { maxDiscount: Number(form.maxDiscount) } : {}),
      maxUses: Number(form.maxUses) || 1000,
      expiresAt: new Date(form.expiresAt).toISOString(),
      isActive: form.isActive,
    }

    const onError = (err: unknown) => {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to save coupon')
    }

    if (coupon) {
      update({ id: coupon._id, data: body }, { onSuccess: onClose, onError })
    } else {
      create(body, { onSuccess: onClose, onError })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-[440px] bg-white shadow-2xl overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900">{coupon ? 'Edit Coupon' : 'New Coupon'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5">
          {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Coupon Code *</label>
            <input
              value={form.code}
              onChange={(e) => set('code', e.target.value.toUpperCase())}
              disabled={!!coupon}
              placeholder="e.g. SAVE20"
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 disabled:bg-gray-50 disabled:text-gray-500"
            />
            {coupon && <p className="text-xs text-gray-400 mt-1">Code cannot be changed after creation</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount Type *</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {(['percentage', 'flat'] as const).map((t) => (
                <button
                  key={t} type="button"
                  onClick={() => set('type', t)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${form.type === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {t === 'percentage' ? '% Percentage' : '₹ Flat Amount'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Value * {form.type === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input type="number" value={form.value} onChange={(e) => set('value', e.target.value)} min={0}
                max={form.type === 'percentage' ? 100 : undefined}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
            </div>
            {form.type === 'percentage' && (
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Max Discount (₹)</label>
                <input type="number" value={form.maxDiscount} onChange={(e) => set('maxDiscount', e.target.value)} min={0}
                  placeholder="No cap"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Min Order (₹)</label>
              <input type="number" value={form.minOrderAmount} onChange={(e) => set('minOrderAmount', e.target.value)} min={0}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={(e) => set('maxUses', e.target.value)} min={1}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Expiry Date *</label>
            <input type="date" value={form.expiresAt} onChange={(e) => set('expiresAt', e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-600" />
            Active (available for use at checkout)
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
              {isPending ? 'Saving…' : coupon ? 'Update' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminCouponsPage() {
  const [drawer, setDrawer] = useState<{ open: boolean; coupon: AdminCoupon | null }>({ open: false, coupon: null })
  const { data: coupons = [], refetch } = useAdminCoupons()
  const { mutate: toggleActive } = useToggleCoupon()
  const { mutate: deleteCoupon } = useDeleteCoupon()

  const now = new Date()
  const active = coupons.filter((c) => c.isActive && new Date(c.expiresAt) > now)
  const expired = coupons.filter((c) => new Date(c.expiresAt) <= now)
  const inactive = coupons.filter((c) => !c.isActive && new Date(c.expiresAt) > now)
  const totalUsed = coupons.reduce((s, c) => s + c.usedCount, 0)

  return (
    <div className="p-4 sm:p-8">
      {drawer.open && (
        <CouponDrawer
          coupon={drawer.coupon}
          onClose={() => { setDrawer({ open: false, coupon: null }); refetch() }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-0.5">{coupons.length} total</p>
        </div>
        <button
          onClick={() => setDrawer({ open: true, coupon: null })}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active', value: active.length, color: 'text-green-600' },
          { label: 'Inactive', value: inactive.length, color: 'text-gray-500' },
          { label: 'Expired', value: expired.length, color: 'text-red-500' },
          { label: 'Total Redeemed', value: totalUsed, color: 'text-indigo-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Conditions</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usage</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expires</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => {
              const isExpired = new Date(coupon.expiresAt) <= now
              const usagePct = Math.min(100, (coupon.usedCount / coupon.maxUses) * 100)
              const daysLeft = Math.ceil((new Date(coupon.expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

              return (
                <tr key={coupon._id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${isExpired ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-gray-900 tracking-wider">{coupon.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {coupon.type === 'percentage' ? `${coupon.value}% off` : `₹${coupon.value} off`}
                    </p>
                    {coupon.maxDiscount && (
                      <p className="text-xs text-gray-400">max ₹{coupon.maxDiscount}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {coupon.minOrderAmount > 0 ? `Min ₹${coupon.minOrderAmount}` : 'No min order'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[80px]">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 60 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {coupon.usedCount} / {coupon.maxUses}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isExpired ? (
                      <span className="text-xs font-medium text-red-500">Expired</span>
                    ) : (
                      <div>
                        <p className="text-xs text-gray-700">{new Date(coupon.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <p className={`text-xs mt-0.5 ${daysLeft <= 3 ? 'text-red-500 font-medium' : daysLeft <= 7 ? 'text-amber-600' : 'text-gray-400'}`}>
                          {daysLeft === 1 ? 'Expires tomorrow' : `${daysLeft} days left`}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleActive(coupon._id, { onSuccess: () => refetch() })}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        coupon.isActive && !isExpired
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {coupon.isActive && !isExpired ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setDrawer({ open: true, coupon })}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete coupon "${coupon.code}"?`)) {
                            deleteCoupon(coupon._id, { onSuccess: () => refetch() })
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <p className="text-gray-400 text-sm">No coupons yet</p>
                  <button
                    onClick={() => setDrawer({ open: true, coupon: null })}
                    className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Create your first coupon →
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
