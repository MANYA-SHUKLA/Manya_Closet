'use client'
import { create } from 'zustand'

export interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface CouponData {
  code: string
  discount: number
  message: string
}

export type DeliveryOption = 'standard' | 'express' | 'sameday'
export type PaymentMethod = 'razorpay' | 'cod'
export type CheckoutStep = 'address' | 'delivery' | 'payment'

interface CheckoutState {
  step: CheckoutStep
  address: ShippingAddress
  deliveryOption: DeliveryOption
  paymentMethod: PaymentMethod
  coupon: CouponData | null
  setStep: (s: CheckoutStep) => void
  setAddress: (a: ShippingAddress) => void
  setDelivery: (d: DeliveryOption) => void
  setPayment: (p: PaymentMethod) => void
  setCoupon: (c: CouponData | null) => void
  reset: () => void
}

const blankAddress: ShippingAddress = {
  fullName: '', phone: '', addressLine1: '', addressLine2: '',
  city: '', state: '', pincode: '', country: 'India',
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  step: 'address',
  address: blankAddress,
  deliveryOption: 'standard',
  paymentMethod: 'razorpay',
  coupon: null,
  setStep: (step) => set({ step }),
  setAddress: (address) => set({ address }),
  setDelivery: (deliveryOption) => set({ deliveryOption }),
  setPayment: (paymentMethod) => set({ paymentMethod }),
  setCoupon: (coupon) => set({ coupon }),
  reset: () => set({ step: 'address', address: blankAddress, deliveryOption: 'standard', paymentMethod: 'razorpay', coupon: null }),
}))
