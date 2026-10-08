-- Esquema oficial. No modificar sin acuerdo del grupo.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  saldo         REAL    NOT NULL DEFAULT 100.00,
  rol           TEXT    NOT NULL DEFAULT 'usuario' CHECK (rol IN ('usuario','admin')),
  creado_en     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS partidos (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  local           TEXT NOT NULL,
  visitante       TEXT NOT NULL,
  fecha           TEXT NOT NULL,
  cuota_local     REAL NOT NULL CHECK (cuota_local > 1),
  cuota_empate    REAL NOT NULL CHECK (cuota_empate > 1),
  cuota_visitante REAL NOT NULL CHECK (cuota_visitante > 1),
  estado          TEXT NOT NULL DEFAULT 'abierto' CHECK (estado IN ('abierto','finalizado')),
  resultado       TEXT CHECK (resultado IN ('local','empate','visitante'))
);

CREATE TABLE IF NOT EXISTS apuestas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
  partido_id  INTEGER NOT NULL REFERENCES partidos(id),
  seleccion   TEXT    NOT NULL CHECK (seleccion IN ('local','empate','visitante')),
  monto       REAL    NOT NULL CHECK (monto >= 1),
  cuota       REAL    NOT NULL,
  estado      TEXT    NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','ganada','perdida')),
  ganancia    REAL    NOT NULL DEFAULT 0,
  fecha       TEXT    NOT NULL DEFAULT (datetime('now'))
);
