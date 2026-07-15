import { Router } from 'express';
import { authenticateToken, authorizeClient } from '../middleware/auth';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/order.controller';

const router = Router();

router.post('/', authenticateToken, authorizeClient, createOrder);
router.get('/', authenticateToken, getOrders);
router.get('/:orderId', authenticateToken, getOrderById);
router.put('/:orderId/status', authenticateToken, updateOrderStatus);

export default router;
