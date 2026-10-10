import { registrar, login as loginServicio } from '../services/authService.js';
import { ErrorApi } from '../middleware/errores.js';

export function registro(req, res) {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    throw new ErrorApi(400, 'Faltan campos: nombre, email y password');
  }
  const usuario = registrar({
    nombre: String(nombre).trim(),
    email: String(email).trim().toLowerCase(),
    password: String(password),
  });
  res.status(201).json(usuario);
}

export function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ErrorApi(400, 'Faltan campos: email y password');
  }
  const usuario = loginServicio({
    email: String(email).trim().toLowerCase(),
    password: String(password),
  });
  res.json(usuario);
}