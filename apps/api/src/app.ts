import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { env } from './config/env'
import routes from './routes'
import webhookRoutes from './routes/webhook'
import { errorHandler } from './middleware/error'
import './config/passport'
import passport from 'passport'

const app: express.Application = express()

app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))

app.use('/api/webhooks', webhookRoutes)
const authRateLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: { success: false, message: 'Too many requests, please try again later' }, 
  skip: (req) => req.path.includes('google') || req.path.includes('refresh')
})

app.use('/api/auth', authRateLimiter)
app.use(
  '/api',
  rateLimit({ windowMs: 1 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many requests' } })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  secret: env.JWT_ACCESS_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax' },
}))
app.use(passport.initialize())

if (env.NODE_ENV !== 'test') app.use(morgan('dev'))

app.get('/', (_req, res) => res.json({ 
  success: true, 
  message: 'Welcome to Manya Closet API',
  made_with_love_by: 'Manya Shukla',
  year: 2026,
  docs: '/swagger',
  health: '/health'
}))

app.get('/swagger', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'swagger.yaml'))
})

app.use('/api', routes)

app.get('/health', (_req, res) => res.json({ status: 'ok', env: env.NODE_ENV }))

app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

app.use(errorHandler)

export default app
