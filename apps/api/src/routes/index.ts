import { Router } from 'express'
import authRoutes from './auth'
import productRoutes from './products'
import categoryRoutes from './categories'
import cartRoutes from './cart'
import orderRoutes from './orders'
import userRoutes from './users'
import wishlistRoutes from './wishlist'
import couponRoutes from './coupons'
import newsletterRoutes from './newsletter'
import reviewRoutes from './reviews'
import adminRoutes from './admin'

const router: Router = Router()

router.use('/admin', adminRoutes)
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/products/:productId/reviews', reviewRoutes)
router.use('/categories', categoryRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/users', userRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/coupons', couponRoutes)
router.use('/newsletter', newsletterRoutes)

export default router
