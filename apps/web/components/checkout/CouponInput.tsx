'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/axios'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useCartStore } from '@/store/cartStore'

export default function CouponInput() {
  const [code, setCode] = useState('')
  const { coupon, setCoupon } = useCheckoutStore()
  const subtotal = useCartStore((s) => s.total)

  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: async (c: string) => {
      const { data } = await api.post('/coupons/validate', { code: c, subtotal })
      return data.data as { code: string; discount: number; message: string }
    },
    onSuccess: (data) => setCoupon(data),
  })

  const removeCoupon = () => {
    setCoupon(null)
    setCode('')
    reset()
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-950/80 border border-emerald-700/50 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-lg">🎟️</span>
          <div>
            <p className="text-emerald-300 text-xs font-bold">{coupon.code}</p>
            <p className="text-emerald-400 text-xs">{coupon.message}</p>
          </div>
        </div>
        <button onClick={removeCoupon} className="text-neutral-500 hover:text-rose-400 transition-colors text-xs">
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
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <button
          onClick={() => code && mutate(code)}
          disabled={isPending || !code}
          className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
        >
          {isPending ? '…' : 'Apply'}
        </button>
      </div>
      {error && (
        <p className="text-rose-400 text-xs pl-1">
          {(error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Invalid coupon'}
        </p>
      )}
    </div>
  )
}
