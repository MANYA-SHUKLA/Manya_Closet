import express from 'express';
import {
  getUserOrders,
  getOrderById,
  cancelOrder,
  requestReturn,
  downloadInvoice
} from '../controllers/orderController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getUserOrders);
router.get('/:orderId/invoice', downloadInvoice); // Must come before /:orderId
router.post('/:orderId/cancel', cancelOrder);
router.post('/:orderId/return', requestReturn);
router.get('/:orderId', getOrderById);

export default router;
