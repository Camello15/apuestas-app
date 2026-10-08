# PROYECTO: Prototipo de App de Apuestas Deportivas ("tipo Ecuabet")

> **Para cualquier IA o integrante que trabaje en este repo:** este archivo es la fuente de verdad.
> Antes de escribir código, lee este archivo, `API.md` y `database/schema.sql`.
> Si algo no está aquí, **no lo inventes**: pregúntale al equipo. No agregues funciones, librerías,
> endpoints, campos ni pantallas que no estén definidos en estos documentos.

## 1. Contexto

- Materia: Arquitectura de Software (UTPL). Trabajo grupal de 3 personas.
- Objetivo: prototipo **básico y funcional**, con arquitectura clara, que corra **en local**.
- Dinero **ficticio**. No hay pagos reales, ni KYC, ni nada de producción.
- Prioridad: simple > completo. Si dudas entre dos soluciones, elige la más simple.

## 2. Arquitectura

Cliente-servidor en 3 capas:

```
[ Frontend React ]  --HTTP/JSON-->  [ Backend Express (API REST) ]  -->  [ SQLite ]
   localhost:5173                       localhost:3000                   database/apuestas.db
```

Backend organizado en capas (obligatorio respetarlo):

```
backend/src/
├── index.js          # arranca Express, CORS, monta rutas
├── db.js             # conexión única a SQLite
├── routes/           # define URLs y llama a controladores
├── controllers/      # lee req, valida, llama a servicios, responde
├── services/         # lógica de negocio (saldo, cuotas, liquidación)
└── middleware/       # auth (lee header x-usuario-id) y esAdmin
```

Frontend organizado así:

```
frontend/src/
├── api/cliente.js    # TODAS las llamadas fetch al backend van aquí
├── pages/            # Login, Registro, Partidos, MisApuestas, Admin
├── components/       # Navbar, TarjetaPartido, BoletoApuesta
└── App.jsx           # rutas con react-router-dom
```

## 3. Stack (no cambiar sin acuerdo del grupo)

| Capa | Tecnología | Librerías permitidas |
|------|-----------|----------------------|
| Frontend | React 18 + Vite | `react-router-dom` |
| Backend | Node.js 20+ + Express 4 | `express`, `cors`, `better-sqlite3`, `bcryptjs` |
| BD | SQLite | — |

- JavaScript (no TypeScript). Módulos ES (`import`/`export`).
- Estilos: CSS plano (un `index.css`). Sin Tailwind, sin librerías de UI.
- **No** usar: JWT, ORMs (Prisma/Sequelize), Redux, Axios, Docker, MongoDB.

## 4. Funcionalidades (alcance cerrado)

1. **Registro**: nombre, email, contraseña. Saldo inicial **$100.00**. Rol `usuario`.
2. **Login**: email + contraseña. El frontend guarda el usuario en `localStorage`.
3. **Ver partidos abiertos** con sus 3 cuotas (local / empate / visitante).
4. **Apostar**: elegir partido + selección + monto. Se descuenta del saldo.
5. **Mis apuestas**: historial con estado (pendiente / ganada / perdida) y ganancia.
6. **Admin**: crear partidos y registrar el resultado. Al registrar resultado se liquidan las apuestas.

Fuera de alcance: apuestas combinadas, apuestas en vivo, recargas, retiros, notificaciones, chat, estadísticas.

## 5. Reglas de negocio (implementar exactamente así)

- R1. Monto mínimo de apuesta: **$1.00**. No puede superar el saldo del usuario.
- R2. Solo se apuesta a partidos con `estado = 'abierto'`.
- R3. `seleccion` solo puede ser `'local'`, `'empate'` o `'visitante'`.
- R4. La cuota se **copia a la apuesta** al momento de apostar (si el admin cambia cuotas después, no afecta).
- R5. Al registrar un resultado: el partido pasa a `'finalizado'`; cada apuesta pendiente de ese partido
  queda `'ganada'` si `seleccion == resultado`, si no `'perdida'`.
- R6. Ganancia de una apuesta ganada = `monto × cuota`, redondeado a 2 decimales. Se suma al saldo.
- R7. Apostar y liquidar se hacen dentro de una **transacción** de SQLite.
- R8. Un partido finalizado no puede volver a liquidarse.

## 6. Autenticación (simplificada a propósito)

- Login devuelve el objeto usuario (sin contraseña).
- El frontend envía en cada petición protegida el header `x-usuario-id: <id>`.
- El middleware `auth` busca ese usuario; si no existe → 401.
- El middleware `esAdmin` exige `rol = 'admin'` → si no, 403.
- Contraseñas guardadas con `bcryptjs` (hash), nunca en texto plano.
- (Se aclara en la presentación que en producción se usaría JWT/sesiones.)

## 7. Convenciones

- Idioma del código y la UI: **español** (`partidos`, `apuestas`, `saldo`).
- JSON de la API en `camelCase`; columnas de BD en `snake_case`. El backend convierte.
- Dinero: números con 2 decimales (ej. `25.50`). Mostrar en UI como `$25.50`.
- Errores de la API: `{ "error": "mensaje legible" }` con el código HTTP correcto.
- Puertos fijos: backend **3000**, frontend **5173**.
- Commits en español y cortos: `feat: pantalla de login`, `fix: validar saldo`.

## 8. Responsables

| Integrante | Carpeta | Responsabilidad |
|-----------|---------|-----------------|
| Camilo | `frontend/` | Pantallas, componentes, `api/cliente.js` |
| Integrante 2 | `backend/` | API, servicios, reglas de negocio |
| Integrante 3 | `database/` + `docs/` | Esquema, datos de prueba, diagramas, pruebas de integración |

Cada uno modifica **solo su carpeta**. Cambios a `PROYECTO.md`, `API.md` o `schema.sql` se acuerdan en grupo.
