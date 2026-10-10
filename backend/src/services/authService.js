import bcrypt from 'bcryptjs';
import db from '../db.js';
import { ErrorApi } from '../middleware/errores.js';

// Convierte una fila de la BD en el objeto Usuario de API.md (sin password)
function aUsuario(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    email: fila.email,
    saldo: fila.saldo,
    rol: fila.rol,
  };
}

export function buscarUsuarioPorId(id) {
  const fila = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
  return fila ? aUsuario(fila) : null;
}

export function registrar({ nombre, email, password }) {
  const existe = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existe) {
    throw new ErrorApi(409, 'El email ya está registrado');
  }
  // La contraseña se guarda con hash, nunca en texto plano
  const hash = bcrypt.hashSync(password, 10);
  // saldo (100.00) y rol ('usuario') se asignan solos por los DEFAULT del esquema
  const info = db
    .prepare('INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)')
    .run(nombre, email, hash);
  return buscarUsuarioPorId(info.lastInsertRowid);
}

export function login({ email, password }) {
  const fila = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  // Mismo mensaje si falla el email o la contraseña (no revelar cuál fue)
  if (!fila || !bcrypt.compareSync(password, fila.password_hash)) {
    throw new ErrorApi(401, 'Credenciales inválidas');
  }
  return aUsuario(fila);
}