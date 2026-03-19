'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/axios'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useCartStore } from '@/store/cartStore'

interface Props {
  subtotal?: number
}

export default function CouponInput({ subtotal: subtotalProp }: Props) {
  const [code, setCode] = useState('')
  const { coupon, setCoupon } = useCheckoutStore()
  const cartTotal = useCartStore((s) => s.total)
  const subtotal = subtotalProp ?? cartTotal

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
    </div>
  )
}
