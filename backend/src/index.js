import express from 'express';
import cors from 'cors';
import db from './db.js';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import partidoRoutes from './routes/partidoRoutes.js';
import { manejarErrores } from './middleware/errores.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// RUTA TEMPORAL de prueba (la borramos después)
app.get('/api/salud', (req, res) => {
  const usuarios = db.prepare('SELECT COUNT(*) AS n FROM usuarios').get().n;
  const partidos = db.prepare('SELECT COUNT(*) AS n FROM partidos').get().n;
  res.json({ ok: true, usuarios, partidos });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/partidos', partidoRoutes);

// Siempre al final: atrapa los errores lanzados arriba
app.use(manejarErrores);

app.listen(3000, () => {
  console.log('Backend corriendo en http://localhost:3000');
});