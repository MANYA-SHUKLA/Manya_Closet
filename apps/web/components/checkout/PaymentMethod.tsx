'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { useCheckoutStore, type PaymentMethod } from '@/store/checkoutStore'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { calcShipping, calcOrderTotal } from '@/lib/deliveryConfig'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

let razorpayLoadPromise: Promise<boolean> | null = null
function loadRazorpay(): Promise<boolean> {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve(true)
  if (!razorpayLoadPromise) {
    razorpayLoadPromise = new Promise((res) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => res(true)
      script.onerror = () => { razorpayLoadPromise = null; res(false) }
      document.body.appendChild(script)
    })
  }
  return razorpayLoadPromise
}

export default function PaymentMethod() {
  const router = useRouter()
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const { address, deliveryOption, coupon, paymentMethod, setPayment, setStep, reset } = useCheckoutStore()
  const { total: subtotal, clear: clearCart } = useCartStore()

  const [error, setError] = useState('')

  const shipping = calcShipping(deliveryOption, subtotal)
  const discount = coupon?.discount ?? 0
  const total = calcOrderTotal(subtotal, shipping, discount)

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: () =>
      api.post('/orders', {
        shippingAddress: address,
        deliveryOption,
        couponCode: coupon?.code,
        paymentMethod,
      }),
    onSuccess: async ({ data }) => {
      const { order, razorpayOrderId, key } = data.data

      if (paymentMethod === 'cod') {
        qc.invalidateQueries({ queryKey: ['orders'] })
        clearCart()
        reset()
        router.push(`/order-success/${order._id}`)
        return
      }

      // Razorpay payment
      const loaded = await loadRazorpay()
      if (!loaded) { setError('Failed to load payment gateway'); return }

      const options = {
        key,
        amount: total * 100,
        currency: 'INR',
        name: "Manya's Closet",
        description: 'Fashion Order',
        order_id: razorpayOrderId,
        prefill: { name: user?.name, email: user?.email, contact: address.phone },
        theme: { color: '#f59e0b' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await api.post('/orders/verify-payment', {
              ...response,
              orderId: order._id,
            })
            qc.invalidateQueries({ queryKey: ['orders'] })
            clearCart()
            reset()
            router.push(`/order-success/${order._id}`)
          } catch {
            setError('Payment verification failed. Contact support.')
          }
        },
        modal: { ondismiss: () => setError('Payment cancelled') },
      }

      new window.Razorpay(options).open()
    },
    onError: (e: { response?: { data?: { message?: string } } }) => {
      setError(e.response?.data?.message ?? 'Failed to place order')
    },
  })

  const METHODS: { key: PaymentMethod; label: string; desc: string; icon: string }[] = [
    { key: 'razorpay', label: 'Pay Online', desc: 'Cards, UPI, Net Banking, Wallets', icon: '💳' },
    { key: 'cod',      label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Payment Method</h2>
        <p className="text-sm text-gray-500">Choose how you&apos;d like to pay</p>
      </div>

      <div className="space-y-3">
        {METHODS.map(({ key, label, desc, icon }) => (
          <button
            key={key}
            onClick={() => setPayment(key)}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
              paymentMethod === key
                ? 'border-indigo-400 bg-indigo-50 shadow-md shadow-indigo-100'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <span className="text-3xl">{icon}</span>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${paymentMethod === key ? 'text-indigo-800' : 'text-gray-900'}`}>
                {label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              paymentMethod === key ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
            }`}>
              {paymentMethod === key && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>

      {paymentMethod === 'razorpay' && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="text-xs font-semibold text-gray-700">100% Secure Payment</p>
            <p className="text-xs text-gray-400 mt-0.5">Powered by Razorpay · SSL encrypted</p>
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
          {error}
        </div>
      )}

      {/* Total & CTA */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Amount to pay</span>
          <span className="text-2xl font-black text-indigo-600">₹{total.toLocaleString()}</span>
        </div>
        <button
          onClick={() => placeOrder()}
          disabled={isPending}
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 disabled:opacity-60 text-sm"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Placing Order…
            </span>
          ) : paymentMethod === 'cod'
            ? '🛍️ Place Order (COD)'
            : '💳 Pay ₹' + total.toLocaleString()}
        </button>
      </div>

      <button
        onClick={() => setStep('delivery')}
        className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        ← Back to Delivery
      </button>
    </div>
  )
}
