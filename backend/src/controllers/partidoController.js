import { listarPartidos, crearPartido } from '../services/partidoService.js';
import { ErrorApi } from '../middleware/errores.js';

export function listar(req, res) {
  res.json(listarPartidos(req.query.estado));
}

export function crear(req, res) {
  const { local, visitante, fecha, cuotaLocal, cuotaEmpate, cuotaVisitante } = req.body;
  const faltan = [local, visitante, fecha, cuotaLocal, cuotaEmpate, cuotaVisitante].some(
    (v) => v === undefined || v === null || v === ''
  );
  if (faltan) {
    throw new ErrorApi(400, 'Faltan campos: local, visitante, fecha, cuotaLocal, cuotaEmpate y cuotaVisitante');
  }
  const partido = crearPartido({
    local: String(local).trim(),
    visitante: String(visitante).trim(),
    fecha: String(fecha).trim(),
    cuotaLocal,
    cuotaEmpate,
    cuotaVisitante,
  });
  res.status(201).json(partido);
}