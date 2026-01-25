import express from 'express';
import {
  createCheckout,
  getCheckoutSummary
} from '../controllers/checkoutController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All checkout routes require authentication
router.use(authenticate);

router.get('/summary', getCheckoutSummary);
router.post('/', createCheckout);

export default router;

