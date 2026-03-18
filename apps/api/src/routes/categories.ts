import { Router } from 'express'
import {
  getCategories, getCategory,
  createCategory, updateCategory, deleteCategory,
} from '../controllers/categoryController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.get('/', getCategories)
router.get('/:slug', getCategory)
router.post('/', authenticate, authorize('admin'), createCategory)
router.put('/:id', authenticate, authorize('admin'), updateCategory)
router.delete('/:id', authenticate, authorize('admin'), deleteCategory)

export default router
