import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Public route
router.get('/:productId', getProductReviews);

// Protected route
router.post('/', authenticate, createReview);

export default router;

