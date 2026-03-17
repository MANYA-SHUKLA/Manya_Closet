import { Router } from 'express'
import { authenticate, isSuperAdmin } from '../middleware/auth'
import {
  getDashboardStats,
  updateUserRole,
  deleteUser,
  getSystemLogs,
} from '../controllers/superAdminController'

const router = Router()

router.use(authenticate, isSuperAdmin)

router.get('/stats', getDashboardStats)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)
router.get('/logs', getSystemLogs)

export default router
