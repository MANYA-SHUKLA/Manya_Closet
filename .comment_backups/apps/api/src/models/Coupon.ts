import mongoose, { Schema, Document } from 'mongoose'

export interface ICouponDocument extends Document {
  code: string
  type: 'percentage' | 'flat'
  value: number
  minOrderAmount: number
  maxDiscount?: number
  maxUses: number
  usedCount: number
  expiresAt: Date
  isActive: boolean
}

const CouponSchema = new Schema<ICouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'flat'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    maxUses: { type: Number, default: 1000 },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const CouponModel = mongoose.model<ICouponDocument>('Coupon', CouponSchema)
