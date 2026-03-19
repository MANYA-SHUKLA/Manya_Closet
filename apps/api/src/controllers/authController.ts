import { Request, Response } from 'express'
import crypto from 'crypto'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { UserModel } from '../models/User'
import { AppError } from '../middleware/error'
import { env } from '../config/env'
import { sendPasswordResetEmail, sendLoginNotification } from '../utils/email'

const signTokens = (id: string) => {
  const accOpts: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'] }
  const refOpts: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] }
  return {
    accessToken: jwt.sign({ id }, env.JWT_ACCESS_SECRET, accOpts),
    refreshToken: jwt.sign({ id }, env.JWT_REFRESH_SECRET, refOpts),
  }
}

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
}

const sendTokens = (res: Response, userId: string, user: object, status = 200) => {
  const { accessToken, refreshToken } = signTokens(userId)
  UserModel.findByIdAndUpdate(userId, { refreshToken }).exec()
  return res
    .status(status)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({ success: true, data: { user } })
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const existing = await UserModel.findOne({ email })
  if (existing) throw new AppError('Email already in use', 400)
  const user = await UserModel.create({ name, email, password })
  const plain = user.toObject() as unknown as Record<string, unknown>
  delete plain.password
  return sendTokens(res, user.id, plain, 201)
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await UserModel.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401)
  }
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'Unknown'
  sendLoginNotification(user.name, user.email, ip).catch(() => null)
  const plain = user.toObject() as unknown as Record<string, unknown>
  delete plain.password
  return sendTokens(res, user.id, plain)
}

export const logout = async (req: Request, res: Response) => {
  await UserModel.findByIdAndUpdate(req.user!._id, { refreshToken: null })
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({ success: true, message: 'Logged out' })
}

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken
  if (!token) throw new AppError('No refresh token', 401)

  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string }
  const user = await UserModel.findById(decoded.id).select('+refreshToken')
  if (!user || user.refreshToken !== token) throw new AppError('Invalid refresh token', 401)

  const { accessToken, refreshToken: newRefresh } = signTokens(user.id)
  await UserModel.findByIdAndUpdate(user.id, { refreshToken: newRefresh })

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', newRefresh, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({ success: true, message: 'Token refreshed' })
}

export const forgotPassword = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ email: req.body.email })
  // Always return 200 to prevent email enumeration
  if (!user) {
    return res.json({ success: true, message: 'If that email exists, a reset link was sent.' })
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  try {
    await sendPasswordResetEmail(user.email, resetToken)
  } catch {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })
    throw new AppError('Failed to send email. Try again later.', 500)
  }

  res.json({ success: true, message: 'If that email exists, a reset link was sent.' })
}

export const resetPassword = async (req: Request, res: Response) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.body.token)
    .digest('hex')

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires')

  if (!user) throw new AppError('Token is invalid or has expired', 400)

  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  const plain = user.toObject() as unknown as Record<string, unknown>
  delete plain.password
  return sendTokens(res, user.id, plain)
}

// Google OAuth — called after passport callback
export const googleAuthCallback = async (req: Request, res: Response) => {
  const user = req.user!
  const { accessToken, refreshToken } = signTokens(user._id.toString())
  await UserModel.findByIdAndUpdate(user._id, { refreshToken })

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .redirect(env.CLIENT_URL)
}
