import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export interface IUserDocument extends Document {
  name: string
  email: string
  password?: string
  avatar?: string
  role: 'user' | 'admin' | 'superadmin'
  isVerified: boolean
  googleId?: string
  refreshToken?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  comparePassword(password: string): Promise<boolean>
  createPasswordResetToken(): string
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
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
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

UserSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 min
  return token
}

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema)
