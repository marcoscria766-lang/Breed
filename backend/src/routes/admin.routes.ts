import { Router } from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';
import {
  getAllOrders,
  searchOrders,
  updateOrderStatus,
  getOrderHistory,
  getStatistics,
} from '../controllers/admin.controller';

const router = Router();

router.get('/orders', authenticateToken, authorizeAdmin, getAllOrders);
router.get('/orders/search', authenticateToken, authorizeAdmin, searchOrders);
router.put('/orders/:orderId/status', authenticateToken, authorizeAdmin, updateOrderStatus);
router.get('/orders/:orderId/history', authenticateToken, authorizeAdmin, getOrderHistory);
router.get('/statistics', authenticateToken, authorizeAdmin, getStatistics);

export default router;
