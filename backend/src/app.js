import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { rateLimiter } from './middlewares/security.js';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (more lenient for development)
if (process.env.NODE_ENV === 'production') {
  app.use(rateLimiter(15 * 60 * 1000, 100)); // 100 requests per 15 minutes
}

// Swagger Documentation
import { swaggerSpec, swaggerUi } from './config/swagger.js';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Manya Closet API Documentation'
}));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminReviewRoutes from './routes/adminReviewRoutes.js';
import adminInventoryRoutes from './routes/adminInventoryRoutes.js';
import adminPaymentRoutes from './routes/adminPaymentRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import adminCouponRoutes from './routes/adminCouponRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import adminReturnRoutes from './routes/adminReturnRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/inventory', adminInventoryRoutes);
app.use('/api/admin/returns', adminReturnRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/admin/payments', adminPaymentRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/coupons', couponRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;

