import { Router } from 'express';
import {
  createOrderIntent,
  confirmOrder,
  getUserOrders,
  getOrderById,
} from '../controllers/orders.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  orderRequestSchema,
  confirmOrderSchema,
} from '../schemas/orders.schema.js';

const router = Router();

router.get('/', requireAuth, getUserOrders);
router.get('/:id', requireAuth, getOrderById);
router.post(
  '/intent',
  requireAuth,
  validate(orderRequestSchema),
  createOrderIntent
);
router.post(
  '/confirm',
  requireAuth,
  validate(confirmOrderSchema),
  confirmOrder
);

export default router;
