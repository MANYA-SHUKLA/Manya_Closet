import express from 'express';
import {
  requestReturn,
  getUserReturns,
  getReturnById
} from '../controllers/returnController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/request', requestReturn);
router.get('/', getUserReturns);
router.get('/:returnId', getReturnById);

export default router;

