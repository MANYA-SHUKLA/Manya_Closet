import express from 'express';
import {
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

router.get('/', getAllOrders);
router.put('/:orderId/status', updateOrderStatus);

export default router;
