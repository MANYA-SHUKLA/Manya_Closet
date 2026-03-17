import { Request, Response } from 'express'
import crypto from 'crypto'
import { OrderModel } from '../models/Order'
import { CartModel } from '../models/Cart'
import { CouponModel } from '../models/Coupon'
import { AppError } from '../middleware/error'
import { env } from '../config/env'

const DELIVERY_OPTIONS: Record<string, { label: string; charge: number; days: string }> = {
  standard: { label: 'Standard Delivery', charge: 99, days: '5-7 business days' },
  express:  { label: 'Express Delivery',  charge: 199, days: '2-3 business days' },
  sameday:  { label: 'Same Day Delivery', charge: 299, days: 'By 9 PM today' },
}
const FREE_SHIPPING_ABOVE = 999

let razorpay: InstanceType<typeof import('razorpay')['default']> | null = null
const getRazorpay = async () => {
  if (!razorpay && env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    const Razorpay = (await import('razorpay')).default
    razorpay = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
  }
  return razorpay
}

export const createOrder = async (req: Request, res: Response) => {
  const { shippingAddress, deliveryOption = 'standard', couponCode, paymentMethod = 'razorpay' } = req.body

  const cart = await CartModel.findOne({ user: req.user!._id })
  if (!cart || cart.items.length === 0) throw new AppError('Cart is empty', 400)

  const subtotal = cart.total
  const delivery = DELIVERY_OPTIONS[deliveryOption] ?? DELIVERY_OPTIONS.standard
  const shippingCharge = subtotal > FREE_SHIPPING_ABOVE && deliveryOption === 'standard' ? 0 : delivery.charge

  // Apply coupon
  let discount = 0
  let appliedCoupon: string | undefined
  if (couponCode) {
    const coupon = await CouponModel.findOne({ code: couponCode.toUpperCase(), isActive: true })
    if (coupon && coupon.expiresAt >= new Date() && coupon.usedCount < coupon.maxUses && subtotal >= coupon.minOrderAmount) {
      discount = coupon.type === 'percentage'
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)
      appliedCoupon = coupon.code
      await CouponModel.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } })
    }
  }

  const total = Math.max(0, subtotal + shippingCharge - discount)

  let razorpayOrderId: string | undefined
  if (paymentMethod === 'razorpay') {
    const rz = await getRazorpay()
    if (rz) {
      const rzOrder = await rz.orders.create({
        amount: total * 100,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      })
      razorpayOrderId = rzOrder.id
    }
  }

  const order = await OrderModel.create({
    user: req.user!._id,
    items: cart.items,
    shippingAddress,
    subtotal,
    shippingCharge,
    discount,
    total,
    razorpayOrderId,
    status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
  })

  // Clear cart
  await CartModel.findOneAndUpdate({ user: req.user!._id }, { items: [], total: 0 })

  res.status(201).json({
    success: true,
    data: {
      order,
      razorpayOrderId,
      key: env.RAZORPAY_KEY_ID,
      deliveryLabel: delivery.label,
      estimatedDelivery: delivery.days,
      appliedCoupon,
    },
  })
}

export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body

  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  if (expected !== razorpay_signature) throw new AppError('Payment verification failed', 400)

  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    { paymentStatus: 'paid', status: 'confirmed', paymentId: razorpay_payment_id },
    { new: true }
  )

  res.json({ success: true, data: order })
}

export const getMyOrders = async (req: Request, res: Response) => {
  const orders = await OrderModel.find({ user: req.user!._id }).sort({ createdAt: -1 })
  res.json({ success: true, data: orders })
}

export const getOrder = async (req: Request, res: Response) => {
  const order = await OrderModel.findOne({ _id: req.params.id, user: req.user!._id })
  if (!order) throw new AppError('Order not found', 404)
  res.json({ success: true, data: order })
}

export const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await OrderModel.find().populate('user', 'name email').sort({ createdAt: -1 })
  res.json({ success: true, data: orders })
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  const order = await OrderModel.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  )
  if (!order) throw new AppError('Order not found', 404)
  res.json({ success: true, data: order })
}
