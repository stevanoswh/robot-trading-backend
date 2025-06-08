import { Router } from 'express';
import { getOrders } from '../controllers/orderController.js';

const router = Router();
router.get('/', getOrders);
export default router;