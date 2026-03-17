export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface IOrderItem {
  product: string
  name: string
  image: string
  price: number
  quantity: number
  size: string
  color: string
}

export interface IShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface IOrder {
  _id: string
  user: string
  items: IOrderItem[]
  shippingAddress: IShippingAddress
  subtotal: number
  shippingCharge: number
  discount: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentId?: string
  razorpayOrderId?: string
  createdAt: string
  updatedAt: string
}
