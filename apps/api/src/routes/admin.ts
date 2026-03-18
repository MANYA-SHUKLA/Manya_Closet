import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { getDashboard, getAdminProducts, getAdminUsers, toggleBlockUser } from '../controllers/adminController'

const router: Router = Router()
router.use(authenticate, authorize('admin'))

router.get('/dashboard', getDashboard)
router.get('/products', getAdminProducts)
router.get('/users', getAdminUsers)
router.patch('/users/:id/block', toggleBlockUser)

export default router
