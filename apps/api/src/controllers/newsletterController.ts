import { Request, Response } from 'express'
import { NewsletterModel } from '../models/Newsletter'
import { sendNewsletterWelcome, sendNewsletterAdminNotification } from '../utils/email'

export const subscribe = async (req: Request, res: Response) => {
  const { email } = req.body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ success: false, message: 'Valid email is required' })
    return
  }

  const existing = await NewsletterModel.findOne({ email: email.toLowerCase() })
  if (existing) {
    res.json({ success: true, message: 'You are already subscribed!' })
    return
  }

  await NewsletterModel.create({ email: email.toLowerCase() })
  const total = await NewsletterModel.countDocuments()

  // Fire emails without blocking the response
  Promise.all([
    sendNewsletterWelcome(email),
    sendNewsletterAdminNotification(email, total),
  ]).catch(() => null) // swallow email errors — subscription still succeeds

  res.status(201).json({ success: true, message: 'Subscribed successfully! Check your inbox.' })
}

export const getSubscribers = async (_req: Request, res: Response) => {
  const subscribers = await NewsletterModel.find().sort({ subscribedAt: -1 })
  res.json({ success: true, data: subscribers, total: subscribers.length })
}
