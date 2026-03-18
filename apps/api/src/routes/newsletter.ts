import { Router } from 'express'
import { subscribe, getSubscribers } from '../controllers/newsletterController'
import { authenticate, authorize } from '../middleware/auth'

const router: Router = Router()

router.post('/subscribe', subscribe)
router.get('/', authenticate, authorize('admin'), getSubscribers)

export default router
