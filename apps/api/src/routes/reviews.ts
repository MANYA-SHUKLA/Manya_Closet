import { Router } from 'express'
import { authenticate, isAdmin } from '../middleware/auth'
import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController'

const router: Router = Router({ mergeParams: true })

router.get('/', getProductReviews)
router.post('/', authenticate, addReview)
router.put('/:reviewId', authenticate, updateReview)
router.delete('/:reviewId', authenticate, deleteReview)

export default router
