'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import CouponInput from '@/components/checkout/CouponInput'

const GST_RATE = 0.18
const FREE_SHIPPING_ABOVE = 999
const SHIPPING_CHARGE = 99

interface Props {
  subtotal: number
  itemCount: number
}

export default function CartSummary({ subtotal, itemCount }: Props) {
  const user = useAuthStore((s) => s.user)
  const coupon = useCheckoutStore((s) => s.coupon)
  const shipping = subtotal > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_CHARGE
  const couponDiscount = coupon?.discount ?? 0
  const tax = Math.round(subtotal * GST_RATE)
  const total = subtotal + shipping + tax - couponDiscount
  const savingsForFreeShipping = FREE_SHIPPING_ABOVE - subtotal

  return (
    <div className="bg-neutral-950 text-white rounded-3xl p-7 space-y-6 sticky top-24">
      <h2 className="text-xl font-bold">Order Summary</h2>

      {subtotal > 0 && subtotal <= FREE_SHIPPING_ABOVE && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>Add ₹{savingsForFreeShipping} more for free shipping</span>
            <span>{Math.round((subtotal / FREE_SHIPPING_ABOVE) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_ABOVE) * 100)}%` }}
            />
          </div>
        </div>
      )}
      {subtotal > FREE_SHIPPING_ABOVE && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
          <span>🎉</span> Free shipping unlocked!
        </div>
      )}

      <CouponInput subtotal={subtotal} />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-neutral-300">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-medium text-white">₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-neutral-300">
          <span>Shipping</span>
          {shipping === 0 ? (
            <span className="text-emerald-400 font-medium">FREE</span>
          ) : (
            <span className="font-medium text-white">₹{shipping}</span>
          )}
        </div>

        <div className="flex justify-between text-neutral-300">
          <span>GST (18%)</span>
          <span className="font-medium text-white">₹{tax.toLocaleString()}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span>Coupon ({coupon!.code})</span>
            <span className="font-medium">−₹{couponDiscount.toLocaleString()}</span>
          </div>
        )}

        <div className="h-px bg-white/10" />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-amber-400">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <Link
        href={user ? '/checkout' : '/login?redirect=/checkout'}
        className="block w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-2xl text-center transition-all hover:shadow-lg hover:shadow-amber-500/30 active:scale-95"
      >
        {user ? 'Proceed to Checkout →' : 'Sign in to Checkout →'}
      </Link>

      <div className="flex items-center justify-center gap-4 text-xs text-neutral-600">
        <span>🔒 Secure checkout</span>
        <span>·</span>
        <span>Razorpay</span>
      </div>
    </div>
  )
}
