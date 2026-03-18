import { Router } from 'express'
import {
  getMe, updateProfile, changePassword,
  getAddresses, addAddress, updateAddress, deleteAddress,
  getAllUsers,
} from '../controllers/userController'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.use(authenticate)
router.get('/me', getMe)
router.put('/me', updateProfile)
router.put('/me/password', changePassword)
router.get('/me/addresses', getAddresses)
router.post('/me/addresses', addAddress)
router.put('/me/addresses/:addressId', updateAddress)
router.delete('/me/addresses/:addressId', deleteAddress)

// Admin
router.get('/', authorize('admin'), getAllUsers)

export default router
