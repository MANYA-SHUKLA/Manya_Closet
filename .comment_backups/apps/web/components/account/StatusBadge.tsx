import { OrderStatus, PaymentStatus } from '@manya-closet/types'

const ORDER_COLORS: Record<OrderStatus, string> = {
  pending:    'bg-amber-100 text-amber-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-violet-100 text-violet-700',
  shipped:    'bg-sky-100 text-sky-700',
  delivered:        'bg-emerald-100 text-emerald-700',
  return_requested: 'bg-orange-100 text-orange-700',
  cancelled:        'bg-rose-100 text-rose-700',
  refunded:   'bg-neutral-100 text-neutral-600',
}

const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  pending:  'bg-amber-100 text-amber-700',
  paid:     'bg-emerald-100 text-emerald-700',
  failed:   'bg-rose-100 text-rose-700',
  refunded: 'bg-neutral-100 text-neutral-600',
}

const ORDER_LABELS: Partial<Record<OrderStatus, string>> = {
  return_requested: 'Return Requested',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${ORDER_COLORS[status]}`}>
      {ORDER_LABELS[status] ?? status}
    </span>
  )
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${PAYMENT_COLORS[status]}`}>
      {status}
    </span>
  )
}
