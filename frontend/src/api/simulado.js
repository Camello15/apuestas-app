// Backend SIMULADO, solo para ver las pantallas mientras el backend real no existe.
// Imita API.md (mismas rutas, respuestas y errores) y PROYECTO.md §5 con los datos de database/seed.sql.
// Guarda todo en localStorage. Para volver a los datos iniciales: borrar la clave 'bdSimulada'.
// Se desactiva con MODO_SIMULADO = false en cliente.js.

const CLAVE_BD = 'bdSimulada';

function datosIniciales() {
  return {
    usuarios: [
      // En el simulador la contraseña va en texto plano; el backend real usa bcryptjs.
      { id: 1, nombre: 'Admin', email: 'admin@test.com', password: '123456', saldo: 1000, rol: 'admin' },
      { id: 2, nombre: 'Camilo', email: 'camilo@test.com', password: '123456', saldo: 100, rol: 'usuario' },
    ],
    partidos: [
      { id: 1, local: 'LDU Quito', visitante: 'Barcelona SC', fecha: '2026-10-15T19:00:00', cuotaLocal: 2.1, cuotaEmpate: 3.2, cuotaVisitante: 3.5, estado: 'abierto', resultado: null },
      { id: 2, local: 'Emelec', visitante: 'Independiente del Valle', fecha: '2026-10-16T17:00:00', cuotaLocal: 3.1, cuotaEmpate: 3.0, cuotaVisitante: 2.3, estado: 'abierto', resultado: null },
      { id: 3, local: 'Liga de Loja', visitante: 'Aucas', fecha: '2026-10-17T15:30:00', cuotaLocal: 2.4, cuotaEmpate: 3.1, cuotaVisitante: 2.9, estado: 'abierto', resultado: null },
      { id: 4, local: 'Deportivo Cuenca', visitante: 'Universidad Católica', fecha: '2026-10-18T20:00:00', cuotaLocal: 2.6, cuotaEmpate: 3.0, cuotaVisitante: 2.7, estado: 'abierto', resultado: null },
    ],
    apuestas: [],
  };
}

function leerBd() {
  const texto = localStorage.getItem(CLAVE_BD);
  return texto ? JSON.parse(texto) : datosIniciales();
}

function guardarBd(bd) {
  localStorage.setItem(CLAVE_BD, JSON.stringify(bd));
}

const redondear = (n) => Math.round(n * 100) / 100;
const siguienteId = (lista) => lista.reduce((max, x) => Math.max(max, x.id), 0) + 1;
const sinPassword = ({ password, ...usuario }) => usuario;
// Fecha y hora local en formato "2026-10-08T12:00:00" (como en API.md)
const ahora = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
};
const SELECCIONES = ['local', 'empate', 'visitante'];

// Lanza un error igual que lo haría el backend ({ error } + código HTTP)
function error(codigo, mensaje) {
  const e = new Error(mensaje);
  e.codigo = codigo;
  throw e;
}

function exigirUsuario(bd, usuarioId) {
  const usuario = bd.usuarios.find((u) => u.id === usuarioId);
  if (!usuario) error(401, 'No autenticado');
  return usuario;
}

function exigirAdmin(bd, usuarioId) {
  const usuario = exigirUsuario(bd, usuarioId);
  if (usuario.rol !== 'admin') error(403, 'Solo para administradores');
  return usuario;
}

// Punto de entrada: recibe lo mismo que fetch y devuelve lo mismo que el backend
export async function responder(metodo, ruta, body = {}, usuarioId) {
  await new Promise((r) => setTimeout(r, 150)); // pequeña espera para simular red
  const bd = leerBd();
  const [camino, query] = ruta.split('?');

  // POST /auth/registro
  if (metodo === 'POST' && camino === '/auth/registro') {
    const { nombre, email, password } = body;
    if (!nombre || !email || !password) error(400, 'Faltan campos');
    if (bd.usuarios.some((u) => u.email === email)) error(409, 'El email ya está registrado');
    const usuario = { id: siguienteId(bd.usuarios), nombre, email, password, saldo: 100, rol: 'usuario' };
    bd.usuarios.push(usuario);
    guardarBd(bd);
    return sinPassword(usuario);
  }

  // POST /auth/login
  if (metodo === 'POST' && camino === '/auth/login') {
    const usuario = bd.usuarios.find((u) => u.email === body.email && u.password === body.password);
    if (!usuario) error(401, 'Credenciales inválidas');
    return sinPassword(usuario);
  }

  // GET /usuarios/me
  if (metodo === 'GET' && camino === '/usuarios/me') {
    return sinPassword(exigirUsuario(bd, usuarioId));
  }

  // GET /partidos[?estado=abierto]
  if (metodo === 'GET' && camino === '/partidos') {
    const estado = new URLSearchParams(query).get('estado');
    return bd.partidos
      .filter((p) => !estado || p.estado === estado)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  // POST /partidos
  if (metodo === 'POST' && camino === '/partidos') {
    exigirAdmin(bd, usuarioId);
    const { local, visitante, fecha, cuotaLocal, cuotaEmpate, cuotaVisitante } = body;
    if (!local || !visitante || !fecha || !cuotaLocal || !cuotaEmpate || !cuotaVisitante) error(400, 'Faltan campos');
    if ([cuotaLocal, cuotaEmpate, cuotaVisitante].some((c) => Number(c) <= 1)) error(400, 'Las cuotas deben ser mayores a 1');
    const partido = {
      id: siguienteId(bd.partidos), local, visitante, fecha,
      cuotaLocal: Number(cuotaLocal), cuotaEmpate: Number(cuotaEmpate), cuotaVisitante: Number(cuotaVisitante),
      estado: 'abierto', resultado: null,
    };
    bd.partidos.push(partido);
    guardarBd(bd);
    return partido;
  }

  // PUT /partidos/:id/resultado  (R5, R6, R8)
  const coincidencia = camino.match(/^\/partidos\/(\d+)\/resultado$/);
  if (metodo === 'PUT' && coincidencia) {
    exigirAdmin(bd, usuarioId);
    if (!SELECCIONES.includes(body.resultado)) error(400, 'Resultado inválido');
    const partido = bd.partidos.find((p) => p.id === Number(coincidencia[1]));
    if (!partido) error(404, 'El partido no existe');
    if (partido.estado === 'finalizado') error(409, 'El partido ya estaba finalizado');

    partido.estado = 'finalizado';
    partido.resultado = body.resultado;
    const pendientes = bd.apuestas.filter((a) => a.partidoId === partido.id && a.estado === 'pendiente');
    for (const apuesta of pendientes) {
      if (apuesta.seleccion === body.resultado) {
        apuesta.estado = 'ganada';
        apuesta.ganancia = redondear(apuesta.monto * apuesta.cuota);
        const apostador = bd.usuarios.find((u) => u.id === apuesta.usuarioId);
        apostador.saldo = redondear(apostador.saldo + apuesta.ganancia);
      } else {
        apuesta.estado = 'perdida';
      }
    }
    guardarBd(bd);
    return { partido, apuestasLiquidadas: pendientes.length };
  }

  // POST /apuestas  (R1, R2, R3, R4)
  if (metodo === 'POST' && camino === '/apuestas') {
    const usuario = exigirUsuario(bd, usuarioId);
    const monto = Number(body.monto);
    if (!(monto >= 1)) error(400, 'El monto mínimo es $1.00');
    if (!SELECCIONES.includes(body.seleccion)) error(400, 'Selección inválida');
    if (monto > usuario.saldo) error(400, 'Saldo insuficiente');
    const partido = bd.partidos.find((p) => p.id === Number(body.partidoId));
    if (!partido) error(404, 'El partido no existe');
    if (partido.estado !== 'abierto') error(409, 'El partido no está abierto');

    const cuotas = { local: partido.cuotaLocal, empate: partido.cuotaEmpate, visitante: partido.cuotaVisitante };
    const apuesta = {
      id: siguienteId(bd.apuestas), usuarioId: usuario.id, partidoId: partido.id,
      seleccion: body.seleccion, monto: redondear(monto), cuota: cuotas[body.seleccion],
      estado: 'pendiente', ganancia: 0, fecha: ahora(),
    };
    bd.apuestas.push(apuesta);
    usuario.saldo = redondear(usuario.saldo - monto);
    guardarBd(bd);
    return { apuesta: formatearApuesta(bd, apuesta), saldo: usuario.saldo };
  }

  // GET /apuestas
  if (metodo === 'GET' && camino === '/apuestas') {
    const usuario = exigirUsuario(bd, usuarioId);
    return bd.apuestas
      .filter((a) => a.usuarioId === usuario.id)
      .sort((a, b) => b.id - a.id)
      .map((a) => formatearApuesta(bd, a));
  }

  error(404, 'Ruta no encontrada');
}

// Forma de "Apuesta" en API.md (incluye nombres de equipos, sin usuarioId)
function formatearApuesta(bd, a) {
  const partido = bd.partidos.find((p) => p.id === a.partidoId);
  const { usuarioId, ...resto } = a;
  return { ...resto, local: partido.local, visitante: partido.visitante };
}
