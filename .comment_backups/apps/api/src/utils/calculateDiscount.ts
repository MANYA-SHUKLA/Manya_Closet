interface DiscountCoupon {
  type: 'percentage' | 'flat'
  value: number
  maxDiscount?: number
}

export function calculateDiscount(coupon: DiscountCoupon, subtotal: number): number {
  let discount = coupon.type === 'percentage'
    ? Math.round((subtotal * coupon.value) / 100)
    : coupon.value
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
  return discount
}
