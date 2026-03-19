import { Router } from 'express'
import { getWishlist, toggleWishlist, syncWishlist } from '../controllers/wishlistController'
import { authenticate } from '../middleware/auth'

const router: Router = Router()
router.use(authenticate)
router.get('/', getWishlist)
router.post('/toggle', toggleWishlist)
router.post('/sync', syncWishlist)

export default router
