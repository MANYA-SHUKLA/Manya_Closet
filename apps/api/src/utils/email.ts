import nodemailer from 'nodemailer'
import { env } from '../config/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT) || 587,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
})

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from: `"Manya's Closet" <${env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
        <h2 style="color:#171717">Reset your password</h2>
        <p style="color:#525252">Click the button below to reset your password. This link expires in <strong>10 minutes</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;margin:24px 0;padding:12px 28px;background:#f59e0b;color:#000;font-weight:600;border-radius:100px;text-decoration:none">
          Reset Password
        </a>
        <p style="color:#a3a3a3;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  })
}
