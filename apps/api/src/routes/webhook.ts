import { Router } from 'express'
import express from 'express'
import { razorpayWebhook } from '../controllers/webhookController'

const router: Router = Router()

router.post('/razorpay', express.raw({ type: 'application/json' }), razorpayWebhook)

export default router
