import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notification.controller';

const router = Router();

router.get('/', authenticateToken, getNotifications);
router.put('/:notificationId/read', authenticateToken, markAsRead);
router.put('/read-all', authenticateToken, markAllAsRead);

export default router;
