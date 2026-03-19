import mongoose, { Schema, Document } from 'mongoose'

export type ReturnReason = 'defective' | 'wrong_item' | 'size_issue' | 'not_as_described' | 'other'
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed'

export interface IReturnDocument extends Document {
  user: mongoose.Types.ObjectId
  order: mongoose.Types.ObjectId
  items: {
    product: mongoose.Types.ObjectId
    name: string
    image: string
    quantity: number
    price: number
    size: string
    color: string
  }[]
  reason: ReturnReason
  description: string
  status: ReturnStatus
  refundAmount: number
  adminNote?: string
}

const ReturnSchema = new Schema<IReturnDocument>(
  {
    user:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    items: [
      {
        product:  { type: Schema.Types.ObjectId, ref: 'Product' },
        name:     String,
        image:    String,
        quantity: Number,
        price:    Number,
        size:     String,
        color:    String,
      },
    ],
    reason:       { type: String, enum: ['defective', 'wrong_item', 'size_issue', 'not_as_described', 'other'], required: true },
    description:  { type: String, default: '' },
    status:       { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    refundAmount: { type: Number, default: 0 },
    adminNote:    { type: String },
  },
  { timestamps: true }
)

ReturnSchema.index({ user: 1, createdAt: -1 })

export const ReturnModel = mongoose.model<IReturnDocument>('Return', ReturnSchema)
