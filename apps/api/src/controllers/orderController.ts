import { Request, Response } from 'express'
import crypto from 'crypto'
import { OrderModel } from '../models/Order'
import { CartModel } from '../models/Cart'
import { CouponModel } from '../models/Coupon'
import { ProductModel } from '../models/Product'
import { UserModel } from '../models/User'
import { AppError } from '../middleware/error'
import { env } from '../config/env'
import { calculateDiscount } from '../utils/calculateDiscount'
import { sendOrderConfirmation, sendOrderStatusUpdate, sendNewOrderAdminNotification, sendReturnRequestAdminNotification } from '../utils/email'
import { getIO } from '../sockets'

const DELIVERY_OPTIONS: Record<string, { label: string; charge: number; days: string }> = {
  standard: { label: 'Standard Delivery', charge: 99, days: '5-7 business days' },
  express:  { label: 'Express Delivery',  charge: 199, days: '2-3 business days' },
  sameday:  { label: 'Same Day Delivery', charge: 299, days: 'By 9 PM today' },
}
const FREE_SHIPPING_ABOVE = 999

let razorpay: any = null
const getRazorpay = async () => {
  if (!razorpay && env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    const Razorpay = (await import('razorpay')).default
    razorpay = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
  }
  return razorpay
}

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

  // Verify stock availability
  for (const item of cart.items) {
    const product = await ProductModel.findById(item.product)
    if (!product || !product.isActive) throw new AppError(`Product "${item.name}" is no longer available`, 400)
    const variant = product.variants.find((v) => v.size === item.size && v.color === item.color)
    if (!variant || variant.stock < item.quantity) {
      throw new AppError(`Insufficient stock for "${item.name}" (${item.size}/${item.color})`, 400)
    }
  }

  // Calculate coupon discount (don't commit usedCount yet for Razorpay — committed on verifyPayment)
  let discount = 0
  let appliedCoupon: string | undefined
  if (couponCode) {
    const coupon = await CouponModel.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      expiresAt: { $gte: new Date() },
      $expr: { $lt: ['$usedCount', '$maxUses'] },
      minOrderAmount: { $lte: subtotal },
    })
    if (coupon) {
      discount = calculateDiscount(coupon, subtotal)
      appliedCoupon = coupon.code
      // For COD commit the coupon use immediately
      if (paymentMethod === 'cod') {
        await CouponModel.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } })
      }
    }
  }

  const total = Math.max(0, subtotal + shippingCharge - discount)

  // ── Razorpay: just create the payment order, NO MongoDB order yet ──
  if (paymentMethod === 'razorpay') {
    const rz = await getRazorpay()
    if (!rz) throw new AppError('Payment gateway unavailable', 503)

    const rzOrder = await rz.orders.create({
      amount: total * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })

    return res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: rzOrder.id,
        key: env.RAZORPAY_KEY_ID,
        amount: total * 100,
        deliveryLabel: delivery.label,
        estimatedDelivery: delivery.days,
        appliedCoupon,
      },
    })
  }

  // ── COD: save order immediately ────────────────────────────────────
  const order = await OrderModel.create({
    user: req.user!._id,
    items: cart.items,
    shippingAddress,
    subtotal,
    shippingCharge,
    discount,
    total,
    status: 'confirmed',
    paymentStatus: 'pending',
  })

  await Promise.all([
    decrementStock(cart.items),
    CartModel.findOneAndUpdate({ user: req.user!._id }, { items: [], total: 0 }),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = req.user as any
  const orderObj = order.toObject() as any
  sendOrderConfirmation(orderObj, u.name, u.email).catch(() => null)
  sendNewOrderAdminNotification(orderObj, u.name, u.email).catch(() => null)

  getIO()?.to('admin').emit('admin:new-order', { orderId: order._id, total: order.total, status: order.status })

  res.status(201).json({
    success: true,
    data: { order, deliveryLabel: delivery.label, estimatedDelivery: delivery.days, appliedCoupon },
  })
}

export const verifyPayment = async (req: Request, res: Response) => {
  const {
    razorpay_order_id, razorpay_payment_id, razorpay_signature,
    shippingAddress, deliveryOption = 'standard', couponCode,
  } = req.body

  // 1. Verify Razorpay signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')
  if (expected !== razorpay_signature) throw new AppError('Payment verification failed', 400)

  // 2. Re-read cart and recalculate totals
  const cart = await CartModel.findOne({ user: req.user!._id })
  if (!cart || cart.items.length === 0) throw new AppError('Cart not found', 400)

  const subtotal = cart.total
  const delivery = DELIVERY_OPTIONS[deliveryOption] ?? DELIVERY_OPTIONS.standard
  const shippingCharge = subtotal > FREE_SHIPPING_ABOVE && deliveryOption === 'standard' ? 0 : delivery.charge

  // 3. Apply coupon atomically (commits usedCount now)
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

  // 4. Create the order in MongoDB now that payment is confirmed
  const order = await OrderModel.create({
    user: req.user!._id,
    items: cart.items,
    shippingAddress,
    subtotal,
    shippingCharge,
    discount,
    total,
    razorpayOrderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    status: 'confirmed',
    paymentStatus: 'paid',
  })

  // 5. Decrement stock & clear cart
  await Promise.all([
    decrementStock(cart.items),
    CartModel.findOneAndUpdate({ user: req.user!._id }, { items: [], total: 0 }),
  ])

  // 6. Send emails & socket event
  const u = req.user as any
  const orderObj = order.toObject() as any
  sendOrderConfirmation(orderObj, u.name, u.email).catch(() => null)
  sendNewOrderAdminNotification(orderObj, u.name, u.email).catch(() => null)

  getIO()?.to('admin').emit('admin:new-order', { orderId: order._id, total: order.total, status: order.status })

  res.json({ success: true, data: { order, appliedCoupon } })
}

export const getMyOrders = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10)
  const skip = (page - 1) * limit

  const filter: Record<string, unknown> = { user: req.user!._id }

  const [orders, total] = await Promise.all([
    OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    OrderModel.countDocuments(filter),
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

  await restoreStock(order.items)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = req.user as any
  sendOrderStatusUpdate(String(order._id), 'cancelled', u.name, u.email).catch(() => null)

  res.json({ success: true, data: order })
}

export const requestReturn = async (req: Request, res: Response) => {
  const { reason } = req.body
  if (!reason?.trim()) throw new AppError('Please provide a reason for the return', 400)

  const order = await OrderModel.findOne({ _id: req.params.id, user: req.user!._id })
  if (!order) throw new AppError('Order not found', 404)
  if (order.status !== 'delivered') throw new AppError('Only delivered orders can be returned', 400)

  order.status = 'return_requested'
  await order.save()

  const u = req.user as any
  sendReturnRequestAdminNotification(String(order._id), u.name, u.email, reason.trim(), order.total).catch(() => null)

  getIO()?.to('admin').emit('admin:return-request', {
    orderId: order._id,
    userName: u.name,
    total: order.total,
  })

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

  // COD orders: auto-mark payment as paid when delivered
  const existing = await OrderModel.findById(req.params.id)
  if (!existing) throw new AppError('Order not found', 404)
  if (status === 'delivered' && !existing.razorpayOrderId && existing.paymentStatus === 'pending') {
    update.paymentStatus = 'paid'
  }

  const order = await OrderModel.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!order) throw new AppError('Order not found', 404)

  // Restore stock if admin cancels or refunds
  if (status === 'cancelled' || status === 'refunded') {
    await restoreStock(order.items)
  }

  // Email user on notable status changes
  if (status && ['confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'].includes(status)) {
    const user = await UserModel.findById(order.user).select('name email')
    if (user) {
      sendOrderStatusUpdate(String(order._id), status, user.name as string, user.email as string).catch(() => null)
    }
  }

  // Real-time: push status update to user's room + admin room
  const io = getIO()
  if (io) {
    io.to(`user:${order.user}`).emit('order:update', { orderId: order._id, status: order.status, paymentStatus: order.paymentStatus })
    io.to('admin').emit('admin:order-update', { orderId: order._id, status: order.status })
  }

  res.json({ success: true, data: order })
}
