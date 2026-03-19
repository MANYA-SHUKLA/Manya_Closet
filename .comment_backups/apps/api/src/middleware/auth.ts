import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from './error'
import { UserModel } from '../models/User'
import { UserRole } from '@manya-closet/types'

const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  admin: 2,
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace('Bearer ', '')

  if (!token) throw new AppError('Unauthorized', 401)

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string }
    const user = await UserModel.findById(decoded.id).select('-password')
    if (!user) throw new AppError('User not found', 401)
    if (user.isBlocked) throw new AppError('Account has been suspended', 403)
    req.user = user.toObject() as unknown as Express.User
    next()
  } catch {
    throw new AppError('Invalid or expired token', 401)
  }
}

export const authorize = (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError('Unauthorized', 401)

    const userLevel = ROLE_HIERARCHY[req.user.role as UserRole] ?? 0
    const requiredLevel = Math.min(...roles.map((r) => ROLE_HIERARCHY[r]))

    if (userLevel < requiredLevel) {
      throw new AppError('Forbidden: insufficient permissions', 403)
    }
    next()
  }

export const isAdmin = authorize('admin')
