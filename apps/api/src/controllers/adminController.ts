import { Request, Response } from 'express'
import { OrderModel } from '../models/Order'
import { UserModel } from '../models/User'
import { ProductModel } from '../models/Product'
import { AppError } from '../middleware/error'

export const getDashboard = async (_req: Request, res: Response) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  // Exclude Razorpay orders where payment was never completed
  const realOrderFilter = {
    $or: [
      { razorpayOrderId: { $in: [null, ''] } },
      { razorpayOrderId: { $nin: [null, ''] }, paymentStatus: { $ne: 'pending' } },
    ],
  }

  const [totalOrders, totalUsers, totalProducts, salesByDay, ordersByStatus, recentOrders] =
    await Promise.all([
      OrderModel.countDocuments(realOrderFilter),
      UserModel.countDocuments({ role: 'user' }),
      ProductModel.countDocuments({ isActive: true }),
      OrderModel.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            sales: { $sum: '$total' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      OrderModel.aggregate([
        { $match: realOrderFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      OrderModel.find(realOrderFilter)
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
        .lean(),
    ])

  const totalSales = salesByDay.reduce((s: number, d: { sales: number }) => s + d.sales, 0)

  res.json({
    success: true,
    data: { stats: { totalSales, totalOrders, totalUsers, totalProducts }, salesByDay, ordersByStatus, recentOrders },
  })
}

export const getAdminProducts = async (req: Request, res: Response) => {
  const { search, page = '1', limit = '20', status } = req.query as Record<string, string>

  const filters: Record<string, unknown> = {}
  if (status === 'active') filters.isActive = true
  else if (status === 'inactive') filters.isActive = false
  if (search) filters.$text = { $search: search }

  const pageNum = Math.max(1, +page)
  const limitNum = Math.min(50, +limit)

  const [products, total] = await Promise.all([
    ProductModel.find(filters)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    ProductModel.countDocuments(filters),
  ])

  res.json({
    success: true,
    data: products,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
  })
}

export const getAdminUsers = async (req: Request, res: Response) => {
  const { search, page = '1', limit = '20', role, blocked } = req.query as Record<string, string>

  const filters: Record<string, unknown> = {}
  if (role) filters.role = role
  if (blocked === 'true') filters.isBlocked = true
  else if (blocked === 'false') filters.isBlocked = false
  if (search) filters.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ]

  const pageNum = Math.max(1, +page)
  const limitNum = Math.min(50, +limit)

  const [users, total] = await Promise.all([
    UserModel.find(filters)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('-password -refreshToken -passwordResetToken')
      .lean(),
    UserModel.countDocuments(filters),
  ])

  res.json({
    success: true,
    data: users,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
  })
}

export const toggleBlockUser = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.id)
  if (!user) throw new AppError('User not found', 404)
  if (user.role === 'admin') throw new AppError('Cannot block an admin account', 400)
  user.isBlocked = !user.isBlocked
  await user.save()
  res.json({ success: true, data: { isBlocked: user.isBlocked } })
}
