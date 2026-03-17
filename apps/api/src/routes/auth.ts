import { Router } from 'express'
import { register, login, logout, refreshToken, googleCallback } from '../controllers/authController'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', authenticate, logout)
router.post('/refresh', refreshToken)
router.get('/google', googleCallback)

export default router
