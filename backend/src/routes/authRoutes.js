import express from 'express';
import { signup, login, logout, refreshToken, getMe, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateSignup, validateLogin } from '../middlewares/validateAuth.js';

const router = express.Router();

// Public routes (with validation)
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateProfile);

export default router;

