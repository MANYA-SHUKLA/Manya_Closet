import { Router } from 'express'
import { authenticate, isAdmin } from '../middleware/auth'
import {
  getDashboardStats,
  updateUserRole,
  deleteUser,
  getSystemLogs,
} from '../controllers/superAdminController'

const router: Router = Router()

router.use(authenticate, isAdmin)

router.get('/stats', getDashboardStats)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)
router.get('/logs', getSystemLogs)

export default router
