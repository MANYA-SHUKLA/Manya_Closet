import { Router } from 'express'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, mergeCart } from '../controllers/cartController'
import { authenticate } from '../middleware/auth'

const router: Router = Router()

router.use(authenticate)
router.get('/', getCart)
router.post('/', addToCart)
router.post('/merge', mergeCart)
router.put('/:itemId', updateCartItem)
router.delete('/:itemId', removeFromCart)
router.delete('/', clearCart)

export default router
