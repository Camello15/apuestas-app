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

const RESULTADOS = ['local', 'empate', 'visitante'];

// Dinero siempre con 2 decimales
const redondear = (n) => Math.round(n * 100) / 100;

export function registrarResultado(partidoId, resultado) {
  if (!RESULTADOS.includes(resultado)) {
    throw new ErrorApi(400, "El resultado debe ser 'local', 'empate' o 'visitante'");
  }

  // R7: finalizar el partido y liquidar apuestas se guarda junto o no se guarda nada
  const ejecutar = db.transaction(() => {
    const partido = db.prepare('SELECT * FROM partidos WHERE id = ?').get(partidoId);
    if (!partido) {
      throw new ErrorApi(404, 'El partido no existe');
    }
    // R8: un partido finalizado no se liquida de nuevo
    if (partido.estado === 'finalizado') {
      throw new ErrorApi(409, 'El partido ya estaba finalizado');
    }

    // R5: el partido pasa a finalizado con su resultado
    db.prepare("UPDATE partidos SET estado = 'finalizado', resultado = ? WHERE id = ?")
      .run(resultado, partidoId);

    // Liquidar cada apuesta pendiente de este partido
    const pendientes = db
      .prepare("SELECT * FROM apuestas WHERE partido_id = ? AND estado = 'pendiente'")
      .all(partidoId);

    for (const apuesta of pendientes) {
      if (apuesta.seleccion === resultado) {
        // R6: ganancia = monto x cuota, con 2 decimales, y se suma al saldo
        const ganancia = redondear(apuesta.monto * apuesta.cuota);
        db.prepare("UPDATE apuestas SET estado = 'ganada', ganancia = ? WHERE id = ?")
          .run(ganancia, apuesta.id);
        db.prepare('UPDATE usuarios SET saldo = ROUND(saldo + ?, 2) WHERE id = ?')
          .run(ganancia, apuesta.usuario_id);
      } else {
        // La ganancia se queda en 0
        db.prepare("UPDATE apuestas SET estado = 'perdida' WHERE id = ?").run(apuesta.id);
      }
    }

    const actualizado = db.prepare('SELECT * FROM partidos WHERE id = ?').get(partidoId);
    return { partido: aPartido(actualizado), apuestasLiquidadas: pendientes.length };
  });

  return ejecutar();
}