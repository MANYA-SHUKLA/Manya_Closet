import mongoose, { Schema, Document } from 'mongoose'

export interface INewsletterDocument extends Document {
  email: string
  subscribedAt: Date
}

const NewsletterSchema = new Schema<INewsletterDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now },
})

export const NewsletterModel = mongoose.model<INewsletterDocument>('Newsletter', NewsletterSchema)
