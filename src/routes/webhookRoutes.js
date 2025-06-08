import { Router } from 'express';
import { handleWebhook } from '../controllers/webhookController.js';

const router = Router();
router.post('/', handleWebhook);
export default router;