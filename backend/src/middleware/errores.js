// Error con código HTTP, para lanzarlo desde controllers y services
export class ErrorApi extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

// Manejador central: siempre responde { "error": "mensaje" }
export function manejarErrores(err, req, res, next) {
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}