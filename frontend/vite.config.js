import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Puerto fijo 5173 (PROYECTO.md §7)
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
