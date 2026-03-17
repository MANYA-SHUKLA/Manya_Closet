import { Router } from 'express'
import authRoutes from './auth'
import productRoutes from './products'
import cartRoutes from './cart'
import orderRoutes from './orders'
import userRoutes from './users'
import superAdminRoutes from './superAdmin'

const router = Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/users', userRoutes)
router.use('/superadmin', superAdminRoutes)

export default router
