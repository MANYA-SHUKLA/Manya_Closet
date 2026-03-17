'use client'
import { useCheckoutStore, DeliveryOption } from '@/store/checkoutStore'
import { useCartStore } from '@/store/cartStore'

const OPTIONS: {
  key: DeliveryOption
  label: string
  desc: string
  icon: string
  charge: (subtotal: number) => number
  badge?: string
}[] = [
  {
    key: 'standard',
    label: 'Standard Delivery',
    desc: '5–7 business days',
    icon: '📦',
    charge: (s) => s > 999 ? 0 : 99,
    badge: 'Free above ₹999',
  },
  {
    key: 'express',
    label: 'Express Delivery',
    desc: '2–3 business days',
    icon: '⚡',
    charge: () => 199,
    badge: 'Faster',
  },
  {
    key: 'sameday',
    label: 'Same Day Delivery',
    desc: 'By 9 PM today',
    icon: '🚀',
    charge: () => 299,
    badge: 'Fastest',
  },
]

export default function DeliveryOptions() {
  const { deliveryOption, setDelivery, setStep } = useCheckoutStore()
  const subtotal = useCartStore((s) => s.total)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-1">Delivery Options</h2>
        <p className="text-sm text-neutral-500">Choose how fast you want it</p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map(({ key, label, desc, icon, charge, badge }) => {
          const fee = charge(subtotal)
          const selected = deliveryOption === key

          return (
            <button
              key={key}
              onClick={() => setDelivery(key)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-amber-400 bg-amber-50 shadow-md shadow-amber-100'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              {/* Icon */}
              <span className="text-3xl flex-shrink-0">{icon}</span>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold text-sm ${selected ? 'text-amber-800' : 'text-neutral-900'}`}>
                    {label}
                  </span>
                  {badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      key === 'sameday' ? 'bg-violet-100 text-violet-700' :
                      key === 'express' ? 'bg-sky-100 text-sky-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                {fee === 0 ? (
                  <div>
                    <span className="text-emerald-600 font-bold text-sm">FREE</span>
                    <p className="text-xs text-neutral-400 line-through">₹99</p>
                  </div>
                ) : (
                  <span className={`font-bold text-sm ${selected ? 'text-amber-700' : 'text-neutral-800'}`}>
                    ₹{fee}
                  </span>
                )}
              </div>

              {/* Radio */}
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                selected ? 'border-amber-500 bg-amber-500' : 'border-neutral-300'
              }`}>
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep('address')}
          className="flex-1 py-3.5 border border-neutral-200 text-neutral-700 font-semibold rounded-2xl hover:bg-neutral-50 transition-colors text-sm"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep('payment')}
          className="flex-[2] py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-200 active:scale-95 text-sm"
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  )
}
