import { buscarUsuarioPorId } from '../services/authService.js';
import { ErrorApi } from './errores.js';

// Exige el header x-usuario-id y deja el usuario en req.usuario
export function auth(req, res, next) {
  const id = Number(req.header('x-usuario-id'));
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorApi(401, 'No autenticado: falta el header x-usuario-id');
  }
  const usuario = buscarUsuarioPorId(id);
  if (!usuario) {
    throw new ErrorApi(401, 'Usuario no encontrado');
  }
  req.usuario = usuario;
  next();
}

// Se usa DESPUÉS de auth, en las rutas solo para admin
export function esAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    throw new ErrorApi(403, 'Se requiere rol admin');
  }
  next();
}