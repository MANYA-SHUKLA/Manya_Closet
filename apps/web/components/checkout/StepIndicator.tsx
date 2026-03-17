'use client'
import { CheckoutStep } from '@/store/checkoutStore'

const STEPS: { key: CheckoutStep; label: string; icon: string }[] = [
  { key: 'address',  label: 'Address',  icon: '📍' },
  { key: 'delivery', label: 'Delivery', icon: '🚚' },
  { key: 'payment',  label: 'Payment',  icon: '💳' },
]

const ORDER: CheckoutStep[] = ['address', 'delivery', 'payment']

export default function StepIndicator({ current }: { current: CheckoutStep }) {
  const currentIdx = ORDER.indexOf(current)

  return (
    <div className="flex items-center gap-0">
      {STEPS.map(({ key, label, icon }, i) => {
        const done    = i < currentIdx
        const active  = i === currentIdx
        const pending = i > currentIdx

        return (
          <div key={key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                done    ? 'bg-emerald-500 shadow-lg shadow-emerald-200' :
                active  ? 'bg-amber-500 shadow-lg shadow-amber-200 ring-4 ring-amber-100' :
                          'bg-neutral-100'
              }`}>
                {done ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={pending ? 'grayscale opacity-40' : ''}>{icon}</span>
                )}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap ${
                active ? 'text-amber-600' : done ? 'text-emerald-600' : 'text-neutral-400'
              }`}>
                {label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500 ${
                i < currentIdx ? 'bg-emerald-400' : 'bg-neutral-200'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
