// TODAS las llamadas al backend van aquí (PROYECTO.md §2). Contrato: API.md
import * as simulado from './simulado.js';

const BASE_URL = 'http://localhost:3000/api';

// true  = usa datos simulados en el navegador (mientras el backend no existe).
// false = llama al backend real en localhost:3000.
export const MODO_SIMULADO = true;

// ---------- Sesión en localStorage (PROYECTO.md §4.2) ----------

const CLAVE_USUARIO = 'usuario';

export function obtenerUsuarioGuardado() {
  const texto = localStorage.getItem(CLAVE_USUARIO);
  return texto ? JSON.parse(texto) : null;
}

export function guardarUsuario(usuario) {
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_USUARIO);
}

// ---------- Petición genérica ----------

// Envía JSON, agrega x-usuario-id si hay sesión y lanza Error con el mensaje del backend.
async function peticion(metodo, ruta, body) {
  if (MODO_SIMULADO) {
    const usuario = obtenerUsuarioGuardado();
    return simulado.responder(metodo, ruta, body, usuario?.id);
  }

  const headers = { 'Content-Type': 'application/json' };
  const usuario = obtenerUsuarioGuardado();
  if (usuario) headers['x-usuario-id'] = String(usuario.id);

  const respuesta = await fetch(BASE_URL + ruta, {
    method: metodo,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error || 'Error inesperado');
  return datos;
}

// ---------- Auth ----------

export function registrar(nombre, email, password) {
  return peticion('POST', '/auth/registro', { nombre, email, password });
}

export function login(email, password) {
  return peticion('POST', '/auth/login', { email, password });
}

export function obtenerMiUsuario() {
  return peticion('GET', '/usuarios/me');
}

// ---------- Partidos ----------

export function listarPartidos(estado) {
  return peticion('GET', estado ? `/partidos?estado=${estado}` : '/partidos');
}

export function crearPartido(partido) {
  return peticion('POST', '/partidos', partido);
}

export function registrarResultado(partidoId, resultado) {
  return peticion('PUT', `/partidos/${partidoId}/resultado`, { resultado });
}

// ---------- Apuestas ----------

export function apostar(partidoId, seleccion, monto) {
  return peticion('POST', '/apuestas', { partidoId, seleccion, monto });
}

export function listarMisApuestas() {
  return peticion('GET', '/apuestas');
}
