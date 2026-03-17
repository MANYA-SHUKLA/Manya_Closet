import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/User'
import { AppError } from '../middleware/error'
import { env } from '../config/env'

const signTokens = (id: string) => ({
  accessToken: jwt.sign({ id }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  }),
  refreshToken: jwt.sign({ id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  }),
})

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const existing = await UserModel.findOne({ email })
  if (existing) throw new AppError('Email already in use', 400)

  const user = await UserModel.create({ name, email, password })
  const { accessToken, refreshToken } = signTokens(user.id)

  await UserModel.findByIdAndUpdate(user.id, { refreshToken })

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(201)
    .json({ success: true, message: 'Registered', data: { user: { ...user.toObject(), password: undefined } } })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await UserModel.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401)
  }

  const { accessToken, refreshToken } = signTokens(user.id)
  await UserModel.findByIdAndUpdate(user.id, { refreshToken })

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({ success: true, message: 'Logged in', data: { user: { ...user.toObject(), password: undefined } } })
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

  const { accessToken, refreshToken: newRefreshToken } = signTokens(user.id)
  await UserModel.findByIdAndUpdate(user.id, { refreshToken: newRefreshToken })

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({ success: true, message: 'Token refreshed' })
}

export const googleCallback = async (_req: Request, res: Response) => {
  // Handled by passport strategy — placeholder
  res.redirect(env.CLIENT_URL)
}
