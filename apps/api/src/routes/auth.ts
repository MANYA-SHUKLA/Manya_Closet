import { Router } from 'express'
import passport from 'passport'
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  googleAuthCallback,
} from '../controllers/authController'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/auth'
import { z } from 'zod'

const router: Router = Router()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const forgotSchema = z.object({ email: z.string().email() })

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
})

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', authenticate, logout)
router.post('/refresh', refreshToken)
router.post('/forgot-password', validate(forgotSchema), forgotPassword)
router.post('/reset-password', validate(resetSchema), resetPassword)

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleAuthCallback
)

export default router
