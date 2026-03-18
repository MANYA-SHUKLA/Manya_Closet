import { Router } from 'express'
import {
  getProducts, getProduct,
  createProduct, updateProduct, deleteProduct,
  getProductReviews, addReview,
  getInventory, updateInventory, getLowStock,
  getProductFilters,
} from '../controllers/productController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Static routes before /:slug to avoid slug matching
router.get('/filters', getProductFilters)
router.get('/low-stock', authenticate, authorize('admin'), getLowStock)

router.get('/', getProducts)
router.get('/:slug', getProduct)
router.post('/', authenticate, authorize('admin'), createProduct)
router.put('/:id', authenticate, authorize('admin'), updateProduct)
router.delete('/:id', authenticate, authorize('admin'), deleteProduct)

router.get('/:id/reviews', getProductReviews)
router.post('/:id/reviews', authenticate, addReview)

router.get('/:id/inventory', authenticate, authorize('admin'), getInventory)
router.patch('/:id/inventory', authenticate, authorize('admin'), updateInventory)

export default router
