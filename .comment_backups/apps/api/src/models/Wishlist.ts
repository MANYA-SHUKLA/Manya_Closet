import mongoose, { Schema, Document } from 'mongoose'

export interface IWishlistDocument extends Document {
  user: mongoose.Types.ObjectId
  products: mongoose.Types.ObjectId[]
}

const WishlistSchema = new Schema<IWishlistDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
)

export const WishlistModel = mongoose.model<IWishlistDocument>('Wishlist', WishlistSchema)
