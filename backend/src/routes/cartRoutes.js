import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  mergeGuestCart
} from '../controllers/cartController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Cart routes support both authenticated and guest users
// optionalAuth middleware will attach user if token is present, but won't require it
router.use(optionalAuth);

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.delete('/', clearCart);
router.post('/merge', mergeGuestCart); // Merge guest cart on login

export default router;

