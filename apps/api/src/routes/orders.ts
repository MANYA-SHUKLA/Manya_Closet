import { Router } from 'express'
import {
  createOrder,
  getMyOrders,
  getOrder,
  verifyPayment,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.use(authenticate)
router.post('/', createOrder)
router.get('/my', getMyOrders)
router.get('/:id', getOrder)
router.post('/verify-payment', verifyPayment)

// Admin
router.get('/', authorize('admin'), getAllOrders)
router.put('/:id/status', authorize('admin'), updateOrderStatus)

export default router
