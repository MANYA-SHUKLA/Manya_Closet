import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'
import routes from './routes'
import webhookRoutes from './routes/webhook'
import { errorHandler } from './middleware/error'
import './config/passport'
import passport from 'passport'

const app: express.Application = express()

// Security
app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))

// Webhook routes — MUST be before express.json() so body arrives as raw Buffer
app.use('/api/webhooks', webhookRoutes)

// Rate limiting — strict on auth, relaxed on general API
app.use(
  '/api/auth',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many requests, please try again later' } })
)
app.use(
  '/api',
  rateLimit({ windowMs: 1 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many requests' } })
)

// Parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// Session is required by passport-oauth2 to store/verify the OAuth state parameter.
// User auth remains stateless JWT — session is never used for that.
app.use(session({
  secret: env.JWT_ACCESS_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax' },
}))
app.use(passport.initialize())

// Logging
if (env.NODE_ENV !== 'test') app.use(morgan('dev'))

// Routes
app.use('/api', routes)

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok', env: env.NODE_ENV }))

// 404
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

// Error handler
app.use(errorHandler)

export default app
