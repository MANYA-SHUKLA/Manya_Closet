import express from 'express';
import {
  getAllInventory,
  getProductInventory,
  updateInventory
} from '../controllers/inventoryController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

router.get('/', getAllInventory);
router.get('/:productId', getProductInventory);
router.put('/:productId', updateInventory);

export default router;

