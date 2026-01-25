import express from 'express';
import { applyCoupon } from '../controllers/couponController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Apply coupon route (requires authentication)
router.post('/apply', authenticate, applyCoupon);

export default router;

