// Funciones pequeñas para mostrar datos en la UI (PROYECTO.md §7)

// 25.5 → "$25.50"
export function formatearDinero(numero) {
  return '$' + Number(numero).toFixed(2);
}

// "2026-10-15T19:00:00" → "15 oct 2026, 19:00"
export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString('es-EC', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// Texto de una selección: 'local' → nombre del equipo local, 'empate' → "Empate"
export function nombreSeleccion(partido, seleccion) {
  if (seleccion === 'local') return partido.local;
  if (seleccion === 'visitante') return partido.visitante;
  return 'Empate';
}
