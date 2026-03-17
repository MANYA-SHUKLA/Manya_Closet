import mongoose, { Schema, Document } from 'mongoose'

export interface IProductDocument extends Document {
  name: string
  slug: string
  description: string
  price: number
  discountPrice?: number
  images: string[]
  category: string
  brand: string
  variants: { size: string; color: string; stock: number; sku: string }[]
  ratings: number
  reviewCount: number
  isFeatured: boolean
  isActive: boolean
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    category: { type: String, required: true },
    brand: { type: String, required: true },
    variants: [
      {
        size: String,
        color: String,
        stock: { type: Number, default: 0 },
        sku: String,
      },
    ],
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

ProductSchema.index({ name: 'text', description: 'text', brand: 'text' })
ProductSchema.index({ category: 1, price: 1 })

export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema)
