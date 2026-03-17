'use client'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import CouponInput from './CouponInput'

const FALLBACK = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80'
const DELIVERY_CHARGES: Record<string, number> = { standard: 99, express: 199, sameday: 299 }
const FREE_SHIPPING_ABOVE = 999
const GST_RATE = 0.18

export default function OrderSummary() {
  const { items, total: subtotal } = useCartStore()
  const { deliveryOption, coupon } = useCheckoutStore()

  const baseShipping = deliveryOption === 'standard' && subtotal > FREE_SHIPPING_ABOVE
    ? 0
    : DELIVERY_CHARGES[deliveryOption] ?? 99

  const discount = coupon?.discount ?? 0
  const tax = Math.round(subtotal * GST_RATE)
  const total = Math.max(0, subtotal + baseShipping - discount + tax)

  return (
    <div className="bg-neutral-950 text-white rounded-3xl overflow-hidden sticky top-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <h2 className="font-bold text-lg">Order Summary</h2>
        <p className="text-neutral-400 text-xs mt-0.5">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      {/* Items */}
      <div className="px-6 py-4 space-y-3 max-h-56 overflow-y-auto border-b border-white/10">
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-3">
            <div className="w-12 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
              <img
                src={(item as { image?: string }).image || FALLBACK}
                alt={(item as { name?: string }).name || 'Product'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-200 line-clamp-1">{(item as { name?: string }).name}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {(item as { size?: string }).size} · {(item as { color?: string }).color} · Qty {(item as { quantity?: number }).quantity}
              </p>
            </div>
            <p className="text-xs font-bold text-white flex-shrink-0">
              ₹{((item as { price?: number; quantity?: number }).price! * (item as { price?: number; quantity?: number }).quantity!).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="px-6 py-4 border-b border-white/10">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Coupon Code</p>
        <CouponInput />
      </div>

      {/* Price breakdown */}
      <div className="px-6 py-5 space-y-3">
        <div className="flex justify-between text-sm text-neutral-400">
          <span>Subtotal</span>
          <span className="text-white font-medium">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-400">
          <span>Shipping</span>
          {baseShipping === 0
            ? <span className="text-emerald-400 font-medium">FREE</span>
            : <span className="text-white font-medium">₹{baseShipping}</span>}
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-400">Coupon Discount</span>
            <span className="text-emerald-400 font-medium">−₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-neutral-400">
          <span>GST (18%)</span>
          <span className="text-white font-medium">₹{tax.toLocaleString()}</span>
        </div>

        <div className="h-px bg-white/10 my-1" />

        <div className="flex justify-between text-lg font-black">
          <span>Total</span>
          <span className="text-amber-400">₹{total.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/50 rounded-xl py-2">
            <span>🎉</span>
            <span>You save ₹{discount.toLocaleString()} with coupon!</span>
          </div>
        )}
      </div>
    </div>
  )
}
