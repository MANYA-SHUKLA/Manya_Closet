'use client'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useCartStore } from '@/store/cartStore'

interface AvailableCoupon {
  _id: string
  code: string
  type: 'percentage' | 'flat'
  value: number
  minOrderAmount: number
  maxDiscount?: number
  expiresAt: string
}

interface Props {
  subtotal?: number
}

export default function CouponInput({ subtotal: subtotalProp }: Props) {
  const [code, setCode] = useState('')
  const [showAvailable, setShowAvailable] = useState(false)
  const { coupon, setCoupon } = useCheckoutStore()
  const cartTotal = useCartStore((s) => s.total)
  const subtotal = subtotalProp ?? cartTotal

  const { data: availableCoupons } = useQuery<AvailableCoupon[]>({
    queryKey: ['coupons-available'],
    queryFn: async () => {
      const { data } = await api.get('/coupons/available')
      return data.data
    },
  })

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: async (c: string) => {
      const { data } = await api.post('/coupons/validate', { code: c, subtotal })
      return data.data as { code: string; discount: number; message: string }
    },
    onSuccess: (data) => {
      setCoupon(data)
      setShowAvailable(false)
    },
  })

  const removeCoupon = () => {
    setCoupon(null)
    setCode('')
    reset()
  }

  const applyCode = (c: string) => {
    setCode(c)
    mutate(c)
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 text-lg">🎟️</span>
          <div>
            <p className="text-emerald-700 text-xs font-bold">{coupon.code}</p>
            <p className="text-emerald-600 text-xs">{coupon.message}</p>
          </div>
        </div>
        <button onClick={removeCoupon} className="text-gray-400 hover:text-rose-500 transition-colors text-xs">
          Remove
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        />
        <button
          onClick={() => code && mutate(code)}
          disabled={isPending || !code}
          className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
        >
          {isPending ? '…' : 'Apply'}
        </button>
      </div>

      {error && (
        <p className="text-rose-500 text-xs pl-1">
          {(error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Invalid coupon'}
        </p>
      )}

      {/* Available coupons toggle */}
      {availableCoupons && availableCoupons.length > 0 && (
        <div>
          <button
            onClick={() => setShowAvailable((v) => !v)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            <span>🎟️</span>
            {showAvailable ? 'Hide' : 'View'} available coupons ({availableCoupons.length})
          </button>

          {showAvailable && (
            <div className="mt-2 space-y-2 max-h-52 overflow-y-auto pr-1">
              {availableCoupons.map((c) => {
                const eligible = subtotal >= c.minOrderAmount
                return (
                  <div
                    key={c._id}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors ${
                      eligible
                        ? 'border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer'
                        : 'border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => eligible && applyCode(c.code)}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold rounded-md tracking-wide">
                        {c.code}
                      </span>
                      <div>
                        <p className="text-white text-xs font-medium">
                          {c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`}
                          {c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ''}
                        </p>
                        {c.minOrderAmount > 0 && (
                          <p className="text-neutral-500 text-[11px]">
                            {eligible ? '✓ Eligible' : `Min order ₹${c.minOrderAmount}`}
                          </p>
                        )}
                      </div>
                    </div>
                    {eligible && (
                      <span className="text-indigo-400 text-xs font-semibold shrink-0">Apply →</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
