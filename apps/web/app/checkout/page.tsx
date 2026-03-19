'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import StepIndicator from '@/components/checkout/StepIndicator'
import AddressForm from '@/components/checkout/AddressForm'
import DeliveryOptions from '@/components/checkout/DeliveryOptions'
import PaymentMethod from '@/components/checkout/PaymentMethod'
import OrderSummary from '@/components/checkout/OrderSummary'

export default function CheckoutPage() {
  const user = useAuthStore((s) => s.user)
  const items = useCartStore((s) => s.items)
  const step  = useCheckoutStore((s) => s.step)
  const router = useRouter()

  useEffect(() => {
    if (!user) router.replace('/login?redirect=/checkout')
  }, [user, router])

  // items.length check is kept as a render guard only (no redirect — clearing
  // cart after order placement must not compete with the order-success redirect)
  if (!user || items.length === 0) return null

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <div className="bg-white border-b border-neutral-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-lg font-bold text-neutral-900">Checkout</h1>
          <StepIndicator current={step} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left — active step form */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-7 shadow-sm">
            {step === 'address'  && <AddressForm />}
            {step === 'delivery' && <DeliveryOptions />}
            {step === 'payment'  && <PaymentMethod />}
          </div>

          {/* Right — always-visible order summary */}
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
