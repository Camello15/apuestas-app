import db from '../db.js';
import { ErrorApi } from '../middleware/errores.js';

const SELECCIONES = ['local', 'empate', 'visitante'];

// Dinero siempre con 2 decimales
const redondear = (n) => Math.round(n * 100) / 100;

// Une apuesta + partido para tener los nombres de los equipos
const SELECT_APUESTA = `
  SELECT a.*, p.local, p.visitante
  FROM apuestas a
  JOIN partidos p ON p.id = a.partido_id`;

// Convierte una fila de la BD en el objeto Apuesta de API.md
function aApuesta(fila) {
  return {
    id: fila.id,
    partidoId: fila.partido_id,
    local: fila.local,
    visitante: fila.visitante,
    seleccion: fila.seleccion,
    monto: fila.monto,
    cuota: fila.cuota,
    estado: fila.estado,
    ganancia: fila.ganancia,
    fecha: fila.fecha,
  };
}

export function apostar(usuarioId, { partidoId, seleccion, monto }) {
  // R1 y R3: validaciones que no necesitan la BD
  const montoNum = Number(monto);
  if (!Number.isFinite(montoNum) || montoNum < 1) {
    throw new ErrorApi(400, 'El monto mínimo de apuesta es $1.00');
  }
  if (!SELECCIONES.includes(seleccion)) {
    throw new ErrorApi(400, "La selección debe ser 'local', 'empate' o 'visitante'");
  }
  const montoFinal = redondear(montoNum);

  // R7: todo lo siguiente se guarda junto o no se guarda nada
  const ejecutar = db.transaction(() => {
    const partido = db.prepare('SELECT * FROM partidos WHERE id = ?').get(partidoId);
    if (!partido) {
      throw new ErrorApi(404, 'El partido no existe');
    }
    // R2: solo partidos abiertos
    if (partido.estado !== 'abierto') {
      throw new ErrorApi(409, 'El partido no está abierto');
    }

    // Se lee el saldo AQUÍ, dentro de la transacción, para usar el valor más reciente
    const usuario = db.prepare('SELECT saldo FROM usuarios WHERE id = ?').get(usuarioId);
    if (montoFinal > usuario.saldo) {
      throw new ErrorApi(400, 'Saldo insuficiente');
    }

    // R4: la cuota vigente se copia a la apuesta
    const cuota = partido[`cuota_${seleccion}`];

    // Cambio 1: descontar el saldo
    const nuevoSaldo = redondear(usuario.saldo - montoFinal);
    db.prepare('UPDATE usuarios SET saldo = ? WHERE id = ?').run(nuevoSaldo, usuarioId);

    // Cambio 2: guardar la apuesta (estado 'pendiente' y ganancia 0 por defecto)
    const info = db
      .prepare(
        `INSERT INTO apuestas (usuario_id, partido_id, seleccion, monto, cuota)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(usuarioId, partidoId, seleccion, montoFinal, cuota);

    const fila = db.prepare(`${SELECT_APUESTA} WHERE a.id = ?`).get(info.lastInsertRowid);
    return { apuesta: aApuesta(fila), saldo: nuevoSaldo };
  });

  return ejecutar();
}

// Apuestas del usuario, más recientes primero
export function listarApuestas(usuarioId) {
  const filas = db
    .prepare(`${SELECT_APUESTA} WHERE a.usuario_id = ? ORDER BY a.fecha DESC, a.id DESC`)
    .all(usuarioId);
  return filas.map(aApuesta);
}