import { Router } from 'express'
import { authenticate, isAdmin } from '../middleware/auth'
import {
  createReturn,
  getMyReturns,
  getReturn,
  getAllReturns,
  updateReturnStatus,
} from '../controllers/returnController'

const router: Router = Router()

router.use(authenticate)

router.post('/',        createReturn)
router.get('/',         getMyReturns)
router.get('/admin',    isAdmin, getAllReturns)
router.get('/:id',      getReturn)
router.patch('/:id',    isAdmin, updateReturnStatus)

export default router
