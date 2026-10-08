# Frontend — App de Apuestas

React 18 + Vite + react-router-dom. Responsable: Camilo.

## Correr

```bash
cd frontend
npm install
npm run dev
```

Abrir http://localhost:5173

Usuarios de prueba (contraseña `123456`): `admin@test.com` (admin) y `camilo@test.com`.

## Modo simulado (mientras no existe el backend)

En `src/api/cliente.js` está `MODO_SIMULADO = true`. Con eso la app **no** llama al backend:
usa `src/api/simulado.js`, que imita `API.md` y las reglas de `PROYECTO.md` §5 con los datos de
`database/seed.sql`, y guarda todo en el `localStorage` del navegador.

- Para volver a los datos iniciales: en la consola del navegador, `localStorage.clear()` y recargar.
- Cuando el backend esté listo en `localhost:3000`: cambiar a `MODO_SIMULADO = false`. Nada más.

## Pantallas

| Ruta | Pantalla | Quién |
|---|---|---|
| `/login` | Login | todos |
| `/registro` | Registro | todos |
| `/partidos` | Partidos abiertos + boleto de apuesta | con sesión |
| `/mis-apuestas` | Historial de apuestas | con sesión |
| `/admin` | Crear partidos y registrar resultados | admin |
