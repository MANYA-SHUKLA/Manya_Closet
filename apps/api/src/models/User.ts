import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUserDocument extends Document {
  name: string
  email: string
  password?: string
  avatar?: string
  role: 'user' | 'admin' | 'superadmin'
  isVerified: boolean
  googleId?: string
  refreshToken?: string
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    avatar: String,
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    googleId: String,
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password!)
}

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema)
