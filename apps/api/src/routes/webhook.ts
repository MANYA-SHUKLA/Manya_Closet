import { Router } from 'express'
import express from 'express'
import { razorpayWebhook } from '../controllers/webhookController'

const router: Router = Router()

// express.raw() must be applied per-route so the webhook body arrives as a Buffer
// (global express.json() is mounted after webhooks in app.ts)
router.post('/razorpay', express.raw({ type: 'application/json' }), razorpayWebhook)

export default router
