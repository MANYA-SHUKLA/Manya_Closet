import { Request, Response } from 'express'
import crypto from 'crypto'
import { OrderModel } from '../models/Order'
import { CartModel } from '../models/Cart'
import { CouponModel } from '../models/Coupon'
import { ProductModel } from '../models/Product'
import { AppError } from '../middleware/error'
import { env } from '../config/env'
import { calculateDiscount } from '../utils/calculateDiscount'

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

/** Decrement stock for each ordered variant */
async function decrementStock(items: { product: unknown; size: string; color: string; quantity: number }[]) {
  await Promise.all(
    items.map((item) =>
      ProductModel.updateOne(
        { _id: item.product, 'variants.size': item.size, 'variants.color': item.color },
        { $inc: { 'variants.$.stock': -item.quantity } }
      )
    )
  )
}

/** Restore stock (on cancellation/refund) */
async function restoreStock(items: { product: unknown; size: string; color: string; quantity: number }[]) {
  await Promise.all(
    items.map((item) =>
      ProductModel.updateOne(
        { _id: item.product, 'variants.size': item.size, 'variants.color': item.color },
        { $inc: { 'variants.$.stock': item.quantity } }
      )
    )
  )
}

export const createOrder = async (req: Request, res: Response) => {
  const { shippingAddress, deliveryOption = 'standard', couponCode, paymentMethod = 'razorpay' } = req.body

  const cart = await CartModel.findOne({ user: req.user!._id })
  if (!cart || cart.items.length === 0) throw new AppError('Cart is empty', 400)

  const subtotal = cart.total
  const delivery = DELIVERY_OPTIONS[deliveryOption] ?? DELIVERY_OPTIONS.standard
  const shippingCharge = subtotal > FREE_SHIPPING_ABOVE && deliveryOption === 'standard' ? 0 : delivery.charge

  // Verify stock availability before placing order
  for (const item of cart.items) {
    const product = await ProductModel.findById(item.product)
    if (!product || !product.isActive) throw new AppError(`Product "${item.name}" is no longer available`, 400)
    const variant = product.variants.find((v) => v.size === item.size && v.color === item.color)
    if (!variant || variant.stock < item.quantity) {
      throw new AppError(`Insufficient stock for "${item.name}" (${item.size}/${item.color})`, 400)
    }
  }

  // Apply coupon — atomic: only increments usedCount if all conditions pass
  let discount = 0
  let appliedCoupon: string | undefined
  if (couponCode) {
    const coupon = await CouponModel.findOneAndUpdate(
      {
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gte: new Date() },
        $expr: { $lt: ['$usedCount', '$maxUses'] },
        minOrderAmount: { $lte: subtotal },
      },
      { $inc: { usedCount: 1 } },
      { new: false },
    )
    if (coupon) {
      discount = calculateDiscount(coupon, subtotal)
      appliedCoupon = coupon.code
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

  // Decrement stock & clear cart
  await Promise.all([
    decrementStock(cart.items),
    CartModel.findOneAndUpdate({ user: req.user!._id }, { items: [], total: 0 }),
  ])

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
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10)
  const skip = (page - 1) * limit

  const [orders, total] = await Promise.all([
    OrderModel.find({ user: req.user!._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    OrderModel.countDocuments({ user: req.user!._id }),
  ])

  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

export const getOrder = async (req: Request, res: Response) => {
  const order = await OrderModel.findOne({ _id: req.params.id, user: req.user!._id })
  if (!order) throw new AppError('Order not found', 404)
  res.json({ success: true, data: order })
}

/** User cancels their own order (only if pending/confirmed) */
export const cancelOrder = async (req: Request, res: Response) => {
  const order = await OrderModel.findOne({ _id: req.params.id, user: req.user!._id })
  if (!order) throw new AppError('Order not found', 404)

  const cancellableStatuses = ['pending', 'confirmed']
  if (!cancellableStatuses.includes(order.status)) {
    throw new AppError(`Cannot cancel an order with status "${order.status}"`, 400)
  }

  order.status = 'cancelled'
  await order.save()

  // Restore stock for cancelled order
  await restoreStock(order.items)

  res.json({ success: true, data: order })
}

// ── Admin ────────────────────────────────────────────────────────────

export const getAllOrders = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20)
  const skip = (page - 1) * limit

  const filter: Record<string, unknown> = {}
  if (req.query.status) filter.status = req.query.status
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus

  const [orders, total] = await Promise.all([
    OrderModel.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    OrderModel.countDocuments(filter),
  ])

  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status, paymentStatus } = req.body
  const update: Record<string, string> = {}
  if (status) update.status = status
  if (paymentStatus) update.paymentStatus = paymentStatus

  const order = await OrderModel.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!order) throw new AppError('Order not found', 404)

  // Restore stock if admin cancels or refunds
  if (status === 'cancelled' || status === 'refunded') {
    await restoreStock(order.items)
  }

  res.json({ success: true, data: order })
}
