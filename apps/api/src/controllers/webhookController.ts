import crypto from 'crypto'
import { Request, Response } from 'express'
import { env } from '../config/env'
import { OrderModel } from '../models/Order'
import { AppError } from '../middleware/error'

export const razorpayWebhook = async (req: Request, res: Response) => {
  const secret = env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) {
    console.warn('RAZORPAY_WEBHOOK_SECRET not set — skipping webhook verification')
    return res.status(200).json({ received: true })
  }

  const signature = req.headers['x-razorpay-signature'] as string
  if (!signature) throw new AppError('Missing x-razorpay-signature header', 400)

  const rawBody = req.body as Buffer
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))) {
    throw new AppError('Invalid webhook signature', 400)
  }

  const payload = JSON.parse(rawBody.toString()) as {
    event: string
    payload: {
      payment?: { entity: { id: string; order_id: string } }
      order?: { entity: { id: string } }
    }
  }

  const { event } = payload

  if (event === 'payment.captured') {
    const { order_id: razorpayOrderId, id: paymentId } = payload.payload.payment!.entity
    await OrderModel.findOneAndUpdate(
      { razorpayOrderId },
      { paymentStatus: 'paid', status: 'confirmed', paymentId }
    )
  }

  if (event === 'payment.failed') {
    const { order_id: razorpayOrderId } = payload.payload.payment!.entity
    await OrderModel.findOneAndUpdate({ razorpayOrderId }, { paymentStatus: 'failed' })
  }

  if (event === 'order.paid') {
    const { id: razorpayOrderId } = payload.payload.order!.entity
    await OrderModel.findOneAndUpdate(
      { razorpayOrderId },
      { paymentStatus: 'paid', status: 'confirmed' }
    )
  }

  res.status(200).json({ received: true })
}
