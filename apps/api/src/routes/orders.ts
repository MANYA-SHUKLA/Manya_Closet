import { Router } from 'express'
import {
  createOrder,
  getMyOrders,
  getOrder,
  verifyPayment,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController'
import { authenticate, authorize } from '../middleware/auth'

const router: Router = Router()

router.use(authenticate)

// User routes
router.post('/', createOrder)
router.post('/verify-payment', verifyPayment)
router.get('/my', getMyOrders)
router.get('/:id', getOrder)
router.patch('/:id/cancel', cancelOrder)

// Admin routes
router.get('/', authorize('admin'), getAllOrders)
router.put('/:id/status', authorize('admin'), updateOrderStatus)

export default router
