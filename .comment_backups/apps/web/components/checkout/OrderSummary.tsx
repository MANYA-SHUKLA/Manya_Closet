'use client'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import CouponInput from './CouponInput'
import { FALLBACK_IMAGES } from '@/lib/imageUtils'
import { calcShipping, calcOrderTotal, GST_RATE } from '@/lib/deliveryConfig'

export default function OrderSummary() {
  const { items, total: subtotal } = useCartStore()
  const { deliveryOption, coupon } = useCheckoutStore()

  const baseShipping = calcShipping(deliveryOption, subtotal)
  const discount = coupon?.discount ?? 0
  const tax = Math.round(subtotal * GST_RATE)
  const total = calcOrderTotal(subtotal, baseShipping, discount)

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden sticky top-24 shadow-sm">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-gray-50">
        <h2 className="font-bold text-lg text-gray-900">Order Summary</h2>
        <p className="text-gray-400 text-xs mt-0.5">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="px-6 py-4 space-y-3 max-h-56 overflow-y-auto border-b border-gray-100">
        {items.map((item, i) => (
          <div key={typeof item.product === 'string' ? item.product : item.product._id + i} className="flex items-center gap-3">
            <div className="w-12 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={item.image || FALLBACK_IMAGES[0]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {item.size} · {item.color} · Qty {item.quantity}
              </p>
            </div>
            <p className="text-xs font-bold text-gray-900 flex-shrink-0">
              ₹{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Coupon Code</p>
        <CouponInput />
      </div>

      <div className="px-6 py-5 space-y-3">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span className="text-gray-900 font-medium">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          {baseShipping === 0
            ? <span className="text-emerald-600 font-medium">FREE</span>
            : <span className="text-gray-900 font-medium">₹{baseShipping}</span>}
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">Coupon Discount</span>
            <span className="text-emerald-600 font-medium">−₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-500">
          <span>GST (18%)</span>
          <span className="text-gray-900 font-medium">₹{tax.toLocaleString()}</span>
        </div>

        <div className="h-px bg-gray-100 my-1" />

        <div className="flex justify-between text-lg font-black">
          <span className="text-gray-900">Total</span>
          <span className="text-indigo-600">₹{total.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-100 rounded-xl py-2">
            <span>🎉</span>
            <span>You save ₹{discount.toLocaleString()} with coupon!</span>
          </div>
        )}
      </div>
    </div>
  )
}
