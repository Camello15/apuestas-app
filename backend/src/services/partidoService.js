import db from '../db.js';
import { ErrorApi } from '../middleware/errores.js';

// Convierte una fila de la BD en el objeto Partido de API.md
export function aPartido(fila) {
  return {
    id: fila.id,
    local: fila.local,
    visitante: fila.visitante,
    fecha: fila.fecha,
    cuotaLocal: fila.cuota_local,
    cuotaEmpate: fila.cuota_empate,
    cuotaVisitante: fila.cuota_visitante,
    estado: fila.estado,
    resultado: fila.resultado,
  };
}

// Lista partidos ordenados por fecha ascendente; estado es opcional
export function listarPartidos(estado) {
  const filas = estado
    ? db.prepare('SELECT * FROM partidos WHERE estado = ? ORDER BY fecha ASC').all(estado)
    : db.prepare('SELECT * FROM partidos ORDER BY fecha ASC').all();
  return filas.map(aPartido);
}

export function crearPartido({ local, visitante, fecha, cuotaLocal, cuotaEmpate, cuotaVisitante }) {
  const cuotas = [cuotaLocal, cuotaEmpate, cuotaVisitante].map(Number);
  // Regla del esquema: toda cuota debe ser mayor que 1
  if (cuotas.some((c) => !Number.isFinite(c) || c <= 1)) {
    throw new ErrorApi(400, 'Las cuotas deben ser números mayores que 1');
  }
  const info = db
    .prepare(
      `INSERT INTO partidos (local, visitante, fecha, cuota_local, cuota_empate, cuota_visitante)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(local, visitante, fecha, ...cuotas);
  const fila = db.prepare('SELECT * FROM partidos WHERE id = ?').get(info.lastInsertRowid);
  return aPartido(fila);
}