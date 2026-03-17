import { Router } from 'express'
import authRoutes from './auth'
import productRoutes from './products'
import cartRoutes from './cart'
import orderRoutes from './orders'
import userRoutes from './users'
import superAdminRoutes from './superAdmin'
import wishlistRoutes from './wishlist'
import couponRoutes from './coupons'

const router = Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/users', userRoutes)
router.use('/superadmin', superAdminRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/coupons', couponRoutes)

export default router
