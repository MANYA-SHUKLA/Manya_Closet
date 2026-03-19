import { OrderStatus } from '@manya-closet/types'

const STEPS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export default function OrderStepper({ status }: { status: OrderStatus }) {
  const currentStep = STEPS.indexOf(status)
  const isCancelled = status === 'cancelled' || status === 'refunded'

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 py-3">
        <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center">
          <span className="text-rose-500 text-sm font-bold">✕</span>
        </div>
        <div>
          <p className="text-sm font-bold text-rose-600 capitalize">{status}</p>
          <p className="text-xs text-neutral-400 mt-0.5">This order has been {status}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done   = i <= currentStep
        const active = i === currentStep
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done
                  ? active
                    ? 'bg-amber-500 text-black ring-4 ring-amber-100'
                    : 'bg-emerald-500 text-white'
                  : 'bg-neutral-200 text-neutral-400'
              }`}>
                {!active && done ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] font-medium capitalize whitespace-nowrap ${
                done ? 'text-neutral-700' : 'text-neutral-400'
              }`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 rounded-full ${
                i < currentStep ? 'bg-emerald-400' : 'bg-neutral-200'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
