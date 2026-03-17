import mongoose, { Schema, Document } from 'mongoose'
import { OrderStatus, PaymentStatus } from '@manya-closet/types'

export interface IOrderDocument extends Document {
  user: mongoose.Types.ObjectId
  items: {
    product: mongoose.Types.ObjectId
    name: string
    image: string
    price: number
    quantity: number
    size: string
    color: string
  }[]
  shippingAddress: {
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    country: string
  }
  subtotal: number
  shippingCharge: number
  discount: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentId?: string
  razorpayOrderId?: string
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    subtotal: Number,
    shippingCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentId: String,
    razorpayOrderId: String,
  },
  { timestamps: true }
)

OrderSchema.index({ user: 1, createdAt: -1 })

export const OrderModel = mongoose.model<IOrderDocument>('Order', OrderSchema)
