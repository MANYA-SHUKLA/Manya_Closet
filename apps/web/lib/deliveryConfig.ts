export const DELIVERY_CHARGES: Record<string, number> = { standard: 99, express: 199, sameday: 299 }
export const FREE_SHIPPING_ABOVE = 999
export const GST_RATE = 0.18

export function calcShipping(deliveryOption: string, subtotal: number): number {
  return deliveryOption === 'standard' && subtotal > FREE_SHIPPING_ABOVE
    ? 0
    : (DELIVERY_CHARGES[deliveryOption] ?? 99)
}

export function calcOrderTotal(subtotal: number, shipping: number, discount: number): number {
  return Math.max(0, subtotal + shipping - discount + Math.round(subtotal * GST_RATE))
}
