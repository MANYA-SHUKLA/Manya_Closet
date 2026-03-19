import { Request, Response } from 'express'
import { ReturnModel } from '../models/Return'
import { OrderModel } from '../models/Order'
import { AppError } from '../middleware/error'

const RETURN_WINDOW_DAYS = 7

export const createReturn = async (req: Request, res: Response) => {
  const { orderId, items, reason, description } = req.body
  if (!orderId || !items?.length || !reason) {
    throw new AppError('orderId, items, and reason are required', 400)
  }

  const order = await OrderModel.findOne({ _id: orderId, user: req.user!._id })
  if (!order) throw new AppError('Order not found', 404)
  if (order.status !== 'delivered') throw new AppError('Only delivered orders can be returned', 400)

  const deliveredAt = new Date(order.updatedAt as Date)
  const windowEnd = new Date(deliveredAt.getTime() + RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000)
  if (new Date() > windowEnd) {
    throw new AppError(`Return window of ${RETURN_WINDOW_DAYS} days has passed`, 400)
  }

  const existing = await ReturnModel.findOne({ order: orderId })
  if (existing) throw new AppError('A return request already exists for this order', 400)

  const refundAmount = items.reduce(
    (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
    0
  )

  const returnReq = await ReturnModel.create({
    user: req.user!._id,
    order: orderId,
    items,
    reason,
    description: description ?? '',
    refundAmount,
  })

  res.status(201).json({ success: true, data: returnReq })
}

export const getMyReturns = async (req: Request, res: Response) => {
  const returns = await ReturnModel.find({ user: req.user!._id })
    .populate('order', 'total status createdAt')
    .sort({ createdAt: -1 })
  res.json({ success: true, data: returns })
}

export const getReturn = async (req: Request, res: Response) => {
  const ret = await ReturnModel.findOne({ _id: req.params.id, user: req.user!._id })
    .populate('order', 'total status createdAt')
  if (!ret) throw new AppError('Return request not found', 404)
  res.json({ success: true, data: ret })
}

// ── Admin ──────────────────────────────────────────────────────────────────

export const getAllReturns = async (req: Request, res: Response) => {
  const page  = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(50, parseInt(req.query.limit as string) || 20)
  const skip  = (page - 1) * limit

  const filter: Record<string, unknown> = {}
  if (req.query.status) filter.status = req.query.status

  const [returns, total] = await Promise.all([
    ReturnModel.find(filter)
      .populate('user', 'name email')
      .populate('order', 'total status createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ReturnModel.countDocuments(filter),
  ])

  res.json({ success: true, data: returns, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
}

export const updateReturnStatus = async (req: Request, res: Response) => {
  const { status, adminNote } = req.body
  const ret = await ReturnModel.findByIdAndUpdate(
    req.params.id,
    { status, ...(adminNote ? { adminNote } : {}) },
    { new: true, runValidators: true }
  )
  if (!ret) throw new AppError('Return request not found', 404)
  res.json({ success: true, data: ret })
}
