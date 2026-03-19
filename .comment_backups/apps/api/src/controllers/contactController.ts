import { Request, Response } from 'express'
import { sendContactEmailToAdmin, sendContactConfirmationToUser } from '../utils/email'

export const submitContact = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !subject || !message) {
    res.status(400).json({ success: false, message: 'All fields are required' })
    return
  }

  await Promise.all([
    sendContactEmailToAdmin(name, email, subject, message),
    sendContactConfirmationToUser(name, email, subject),
  ])

  res.json({ success: true, message: 'Message sent' })
}
