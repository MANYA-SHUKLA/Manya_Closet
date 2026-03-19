import { Router } from 'express'
import {
  getProducts, getProduct,
  createProduct, updateProduct, deleteProduct,
  getProductReviews, addReview,
  getInventory, updateInventory, getLowStock,
  getProductFilters, autocomplete, getRelatedProducts,
} from '../controllers/productController'
import { authenticate, authorize } from '../middleware/auth'

const router: Router = Router()

router.get('/filters', getProductFilters)
router.get('/search/autocomplete', autocomplete)
router.get('/low-stock', authenticate, authorize('admin'), getLowStock)

router.get('/', getProducts)
router.get('/:slug', getProduct)
router.post('/', authenticate, authorize('admin'), createProduct)
router.put('/:id', authenticate, authorize('admin'), updateProduct)
router.delete('/:id', authenticate, authorize('admin'), deleteProduct)

router.get('/:id/related', getRelatedProducts)
router.get('/:id/reviews', getProductReviews)
router.post('/:id/reviews', authenticate, addReview)

router.get('/:id/inventory', authenticate, authorize('admin'), getInventory)
router.patch('/:id/inventory', authenticate, authorize('admin'), updateInventory)

export default router
