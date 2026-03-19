import mongoose, { Schema, Document } from 'mongoose'

export interface ICategoryDocument extends Document {
  name: string
  slug: string
  description?: string
  image?: string
  parent?: mongoose.Types.ObjectId
  sortOrder: number
  isActive: boolean
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    image:       { type: String },
    parent:      { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    sortOrder:   { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
)

CategorySchema.index({ parent: 1, sortOrder: 1 })

export const CategoryModel = mongoose.model<ICategoryDocument>('Category', CategorySchema)
