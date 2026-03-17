import mongoose, { Schema, Document } from 'mongoose'

export interface IReviewDocument extends Document {
  product: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  rating: number
  comment: string
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
)

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

export const ReviewModel = mongoose.model<IReviewDocument>('Review', ReviewSchema)
