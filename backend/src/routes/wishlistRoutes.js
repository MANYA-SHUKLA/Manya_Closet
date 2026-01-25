import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistItem
} from '../controllers/wishlistController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticate);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove', removeFromWishlist);
router.get('/check/:productId', checkWishlistItem);

export default router;

