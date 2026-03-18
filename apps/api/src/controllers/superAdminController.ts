import { Request, Response } from 'express'
import { UserModel } from '../models/User'
import { OrderModel } from '../models/Order'
import { ProductModel } from '../models/Product'
import { AppError } from '../middleware/error'
import { UserRole } from '@manya-closet/types'

export const getDashboardStats = async (_req: Request, res: Response) => {
  const [totalUsers, totalOrders, totalProducts, revenueData] = await Promise.all([
    UserModel.countDocuments(),
    OrderModel.countDocuments(),
    ProductModel.countDocuments({ isActive: true }),
    OrderModel.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ])

  const revenue = revenueData[0]?.total ?? 0

  res.json({
    success: true,
    data: { totalUsers, totalOrders, totalProducts, revenue },
  })
}

export const updateUserRole = async (req: Request, res: Response) => {
  const { role } = req.body as { role: UserRole }
  const validRoles: UserRole[] = ['user', 'admin']
  if (!validRoles.includes(role)) throw new AppError('Invalid role', 400)

  if (req.params.id === (req.user!._id as string).toString()) {
    throw new AppError('Cannot change your own role', 400)
  }

  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  )
  if (!user) throw new AppError('User not found', 404)
  res.json({ success: true, data: user })
}

export const deleteUser = async (req: Request, res: Response) => {
  if (req.params.id === (req.user!._id as string).toString()) {
    throw new AppError('Cannot delete yourself', 400)
  }
  await UserModel.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'User deleted' })
}

export const getSystemLogs = async (_req: Request, res: Response) => {
  // Placeholder — wire to a logging service in production
  res.json({ success: true, data: [], message: 'Connect a logging service (e.g. Winston + MongoDB)' })
}
