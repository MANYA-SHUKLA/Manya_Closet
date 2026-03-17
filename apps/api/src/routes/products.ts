import { Router } from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  addReview,
} from '../controllers/productController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.get('/', getProducts)
router.get('/:slug', getProduct)
router.post('/', authenticate, authorize('admin'), createProduct)
router.put('/:id', authenticate, authorize('admin'), updateProduct)
router.delete('/:id', authenticate, authorize('admin'), deleteProduct)

router.get('/:id/reviews', getProductReviews)
router.post('/:id/reviews', authenticate, addReview)

export default router
