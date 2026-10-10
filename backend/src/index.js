import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import partidoRoutes from './routes/partidoRoutes.js';
import { manejarErrores } from './middleware/errores.js';
import apuestaRoutes from './routes/apuestaRoutes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/partidos', partidoRoutes);
app.use('/api/apuestas', apuestaRoutes);

// Siempre al final: atrapa los errores lanzados arriba
app.use(manejarErrores);

app.listen(3000, () => {
  console.log('Backend corriendo en http://localhost:3000');
});