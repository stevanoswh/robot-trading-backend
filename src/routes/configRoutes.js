import { Router } from 'express';
import { postConfig, getConfigHandler } from '../controllers/configController.js';

const router = Router();
router.post('/', postConfig);
router.get('/', getConfigHandler);
export default router;