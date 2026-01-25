import express from 'express';
import {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

router.get('/', getAllCoupons);
router.get('/:couponId', getCouponById);
router.post('/', createCoupon);
router.put('/:couponId', updateCoupon);
router.delete('/:couponId', deleteCoupon);

export default router;

