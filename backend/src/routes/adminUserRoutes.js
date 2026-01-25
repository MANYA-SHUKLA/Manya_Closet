import express from 'express';
import { getAllUsers, getUserById } from '../controllers/userController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

router.get('/', getAllUsers);
router.get('/:userId', getUserById);

export default router;

