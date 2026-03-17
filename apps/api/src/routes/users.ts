import { Router } from 'express'
import { getMe, updateProfile, getAllUsers } from '../controllers/userController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.use(authenticate)
router.get('/me', getMe)
router.put('/me', updateProfile)

// Admin
router.get('/', authorize('admin'), getAllUsers)

export default router
