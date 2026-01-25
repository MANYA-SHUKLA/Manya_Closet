import express from 'express';
import {
  createPayment,
  verifyPayment,
  getPaymentStatus
} from '../controllers/paymentController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Payment routes
router.post('/create', authenticate, createPayment);
router.post('/create-order', authenticate, createPayment); // Alias for documentation compatibility
router.get('/status/:orderId', authenticate, getPaymentStatus);

// Webhook route (no authentication - Razorpay calls this directly)
// Use express.raw() to get raw body for webhook signature verification
router.post('/verify', express.raw({ type: 'application/json' }), verifyPayment);

export default router;

