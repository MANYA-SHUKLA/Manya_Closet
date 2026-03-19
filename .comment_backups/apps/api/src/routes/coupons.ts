import { Router } from 'express'
import {
  validateCoupon,
  getAvailableCoupons,
  createCoupon,
  getAllCoupons,
  toggleCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController'
import { authenticate, isAdmin } from '../middleware/auth'

const router: Router = Router()

router.get('/available', authenticate, getAvailableCoupons)
router.post('/validate', authenticate, validateCoupon)
router.post('/', authenticate, isAdmin, createCoupon)
router.get('/', authenticate, isAdmin, getAllCoupons)
router.patch('/:id/toggle', authenticate, isAdmin, toggleCoupon)
router.put('/:id', authenticate, isAdmin, updateCoupon)
router.delete('/:id', authenticate, isAdmin, deleteCoupon)

export default router
