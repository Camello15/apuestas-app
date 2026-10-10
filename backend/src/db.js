import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Ruta de la carpeta /database (dos niveles arriba de backend/src)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const carpetaBd = path.join(__dirname, '../../database');

// Conexión única a SQLite (se crea el archivo apuestas.db si no existe)
const db = new Database(path.join(carpetaBd, 'apuestas.db'));
db.pragma('foreign_keys = ON');

// Crea las tablas si no existen, usando el esquema oficial
db.exec(fs.readFileSync(path.join(carpetaBd, 'schema.sql'), 'utf8'));

// Si no hay usuarios, carga los datos de prueba
const { total } = db.prepare('SELECT COUNT(*) AS total FROM usuarios').get();
if (total === 0) {
  db.exec(fs.readFileSync(path.join(carpetaBd, 'seed.sql'), 'utf8'));
}

export default db;