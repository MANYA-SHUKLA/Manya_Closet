import express from 'express';
import { getAllReviews, getPendingReviews, approveReview, rejectReview } from '../controllers/reviewController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

router.get('/', getAllReviews);
router.get('/pending', getPendingReviews);
router.put('/:reviewId/approve', approveReview);
router.put('/:reviewId/reject', rejectReview);

export default router;

