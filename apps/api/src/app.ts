import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'
import routes from './routes'
import { errorHandler } from './middleware/error'
import './config/passport'
import passport from 'passport'

const app = express()

// Security
app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))

// Rate limiting
app.use(
  '/api/auth',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many requests' })
)

// Parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
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
