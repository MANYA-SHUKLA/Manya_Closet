import { Request, Response } from 'express'
import { CouponModel } from '../models/Coupon'
import { AppError } from '../middleware/error'

export const validateCoupon = async (req: Request, res: Response) => {
  const { code, subtotal } = req.body
  if (!code || !subtotal) throw new AppError('Code and subtotal required', 400)

  const coupon = await CouponModel.findOne({ code: code.toUpperCase(), isActive: true })
  if (!coupon) throw new AppError('Invalid or expired coupon', 400)
  if (coupon.expiresAt < new Date()) throw new AppError('Coupon has expired', 400)
  if (coupon.usedCount >= coupon.maxUses) throw new AppError('Coupon usage limit reached', 400)
  if (subtotal < coupon.minOrderAmount) {
    throw new AppError(`Minimum order of ₹${coupon.minOrderAmount} required for this coupon`, 400)
  }

  let discount =
    coupon.type === 'percentage'
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value

  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)

  res.json({
    success: true,
    data: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
      message: coupon.type === 'percentage'
        ? `${coupon.value}% off applied — You save ₹${discount}`
        : `₹${discount} flat discount applied`,
    },
  })
}

// Admin
export const createCoupon = async (req: Request, res: Response) => {
  const coupon = await CouponModel.create(req.body)
  res.status(201).json({ success: true, data: coupon })
}

export const getAllCoupons = async (_req: Request, res: Response) => {
  const coupons = await CouponModel.find().sort({ createdAt: -1 })
  res.json({ success: true, data: coupons })
}

export const toggleCoupon = async (req: Request, res: Response) => {
  const coupon = await CouponModel.findById(req.params.id)
  if (!coupon) throw new AppError('Coupon not found', 404)
  coupon.isActive = !coupon.isActive
  await coupon.save()
  res.json({ success: true, data: coupon })
}
