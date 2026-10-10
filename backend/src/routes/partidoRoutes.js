import { Router } from 'express';
import { auth, esAdmin } from '../middleware/auth.js';
import { listar, crear, finalizar } from '../controllers/partidoController.js';

const router = Router();

router.get('/', listar);                              // público
router.post('/', auth, esAdmin, crear);               // solo admin
router.put('/:id/resultado', auth, esAdmin, finalizar); // solo admin

export default router;