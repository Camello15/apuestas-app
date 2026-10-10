import { apostar, listarApuestas } from '../services/apuestaService.js';
import { ErrorApi } from '../middleware/errores.js';

export function crear(req, res) {
  const { partidoId, seleccion, monto } = req.body;
  if (partidoId === undefined || seleccion === undefined || monto === undefined) {
    throw new ErrorApi(400, 'Faltan campos: partidoId, seleccion y monto');
  }
  const idPartido = Number(partidoId);
  if (!Number.isInteger(idPartido) || idPartido <= 0) {
    throw new ErrorApi(400, 'partidoId inválido');
  }
  // req.usuario lo dejó el middleware auth
  const resultado = apostar(req.usuario.id, { partidoId: idPartido, seleccion, monto });
  res.status(201).json(resultado);
}

export function listar(req, res) {
  res.json(listarApuestas(req.usuario.id));
}