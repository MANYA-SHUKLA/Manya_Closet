import express from 'express';
import {
  getAllReturns,
  approveReturn,
  rejectReturn,
  markPickupComplete,
  updateQCStatus,
  processRefund
} from '../controllers/returnController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

router.get('/', getAllReturns);
router.put('/:returnId/approve', approveReturn);
router.put('/:returnId/reject', rejectReturn);
router.put('/:returnId/pickup', markPickupComplete);
router.put('/:returnId/qc', updateQCStatus);
router.put('/:returnId/refund', processRefund);

export default router;

