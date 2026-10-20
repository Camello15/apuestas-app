// Funciones pequeñas para mostrar datos en la UI (PROYECTO.md §7)

// 25.5 → "$25.50"
export function formatearDinero(numero) {
  return '$' + Number(numero).toFixed(2);
}

export function formatearFecha(fecha) {
  // SQLite guarda la hora de las apuestas en UTC y sin "T" ("2026-10-12 16:12:01"):
  // se marca como UTC para que el navegador la muestre en hora local
  const iso = fecha.includes(' ') ? fecha.replace(' ', 'T') + 'Z' : fecha;
  return new Date(iso).toLocaleString('es-EC', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// Texto de una selección: 'local' → nombre del equipo local, 'empate' → "Empate"
export function nombreSeleccion(partido, seleccion) {
  if (seleccion === 'local') return partido.local;
  if (seleccion === 'visitante') return partido.visitante;
  return 'Empate';
}
