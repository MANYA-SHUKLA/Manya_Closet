import { Router } from 'express'
import { validateCoupon, createCoupon, getAllCoupons, toggleCoupon } from '../controllers/couponController'
import { authenticate, isAdmin } from '../middleware/auth'

const router = Router()

router.post('/validate', authenticate, validateCoupon)
router.post('/', authenticate, isAdmin, createCoupon)
router.get('/', authenticate, isAdmin, getAllCoupons)
router.patch('/:id/toggle', authenticate, isAdmin, toggleCoupon)

export default router
