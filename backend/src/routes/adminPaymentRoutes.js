import express from 'express';
import { getAllPayments, processRefund } from '../controllers/paymentController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

router.get('/', getAllPayments);
router.post('/:paymentId/refund', processRefund);

export default router;

