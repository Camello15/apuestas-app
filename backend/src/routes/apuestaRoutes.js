import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { crear, listar } from '../controllers/apuestaController.js';

const router = Router();

router.post('/', auth, crear);
router.get('/', auth, listar);

export default router;