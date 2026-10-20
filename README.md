# App de Apuestas Deportivas: prototipo

Proyecto grupal de **Arquitectura de Software (UTPL)**. Prototipo de casa de apuestas tipo Ecuabet,
con **dinero ficticio**, que corre en local.

**Equipo:** Camilo Velepucha (frontend) · Jorge Beltran (backend) · Cristina Feijoo (base de datos y documentación)

## Qué hace

- Registro e inicio de sesión (cada usuario nuevo recibe **$100.00** de saldo ficticio).
- Ver los partidos abiertos con sus cuotas (1 = local, X = empate, 2 = visitante).
- Apostar a un partido; el monto se descuenta del saldo.
- Ver el historial de apuestas (pendiente / ganada / perdida).
- **Administrador:** crear partidos y registrar resultados. Al registrar un resultado, las apuestas
  se liquidan solas y las ganadoras reciben `monto × cuota`.

## Arquitectura

Cliente-servidor en **3 capas**:

```
[ Frontend React ]  --HTTP/JSON-->  [ Backend Express (API REST) ]  -->  [ SQLite ]
   localhost:5173                       localhost:3000                   database/apuestas.db
```

El backend está organizado en capas: `routes` → `controllers` → `services` → `db.js`, más un
`middleware` de autenticación y permisos de administrador.

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite, react-router-dom |
| Backend | Node.js + Express 4, bcryptjs |
| Base de datos | SQLite (better-sqlite3) |

Más detalle en [`PROYECTO.md`](PROYECTO.md) (reglas de negocio) y [`API.md`](API.md) (endpoints).
Los diagramas están en la carpeta [`docs/`](docs).

## Cómo ejecutarlo

**Requisitos:** [Node.js](https://nodejs.org) versión 20 o superior (la LTS) y Git.

### 1. Clonar el repositorio

```
git clone https://github.com/Camello15/apuestas-app.git
cd apuestas-app
```

### 2. Backend (terminal 1)

```
cd backend
npm install
npm run dev
```

Debe aparecer `Backend corriendo en http://localhost:3000`. Dejar esta terminal abierta.
La base de datos se crea sola la primera vez, con datos de prueba.

### 3. Frontend (terminal 2)

```
cd frontend
npm install
npm run dev
```

### 4. Abrir la app

Entrar a **http://localhost:5173** (usar `localhost`, no `127.0.0.1`).

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | `admin@test.com` | `123456` |
| Usuario | `camilo@test.com` | `123456` |

**Prueba sugerida:** entrar como `camilo@test.com` y apostar → salir y entrar como `admin@test.com`
→ en **Admin**, registrar el resultado de ese partido → volver a entrar como Camilo y ver la apuesta
liquidada en **Mis apuestas** con el saldo actualizado.

**Reiniciar los datos:** detener el backend (Ctrl + C), borrar `database/apuestas.db` y volver a
ejecutar `npm run dev`.

## Estructura del repositorio

```
apuestas-app/
├── frontend/   React: pages/, components/, api/cliente.js
├── backend/    Express: routes/, controllers/, services/, middleware/, db.js
├── database/   schema.sql (tablas) y seed.sql (datos de prueba)
├── docs/       Diagramas de actividades y diagrama de red
├── PROYECTO.md Arquitectura, alcance y reglas de negocio
└── API.md      Contrato de la API REST
```
