import { listarPartidos, crearPartido, registrarResultado } from '../services/partidoService.js';
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

export function finalizar(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorApi(404, 'El partido no existe');
  }
  res.json(registrarResultado(id, req.body.resultado));
}