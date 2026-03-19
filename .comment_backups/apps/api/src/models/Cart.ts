import mongoose, { Schema, Document } from 'mongoose'

export interface ICartDocument extends Document {
  user: mongoose.Types.ObjectId
  items: {
    _id?: mongoose.Types.ObjectId
    product: mongoose.Types.ObjectId
    name: string
    image: string
    price: number
    quantity: number
    size: string
    color: string
  }[]
  total: number
}

const CartSchema = new Schema<ICartDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        size: String,
        color: String,
      },
    ],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const CartModel = mongoose.model<ICartDocument>('Cart', CartSchema)
