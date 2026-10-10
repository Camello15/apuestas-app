import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { me } from '../controllers/usuarioController.js';

const router = Router();

router.get('/me', auth, me);

export default router;