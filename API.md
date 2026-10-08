# Contrato de la API REST

Base URL: `http://localhost:3000/api`
Todas las respuestas son JSON. Errores: `{ "error": "mensaje" }`.
🔒 = requiere header `x-usuario-id`. 👑 = además requiere rol admin.

## Objetos

**Usuario**
```json
{ "id": 1, "nombre": "Camilo", "email": "camilo@test.com", "saldo": 100.00, "rol": "usuario" }
```

**Partido**
```json
{
  "id": 1, "local": "LDU Quito", "visitante": "Barcelona SC",
  "fecha": "2026-10-15T19:00:00",
  "cuotaLocal": 2.10, "cuotaEmpate": 3.20, "cuotaVisitante": 3.50,
  "estado": "abierto", "resultado": null
}
```
`estado`: `"abierto" | "finalizado"` · `resultado`: `null | "local" | "empate" | "visitante"`

**Apuesta**
```json
{
  "id": 1, "partidoId": 1, "local": "LDU Quito", "visitante": "Barcelona SC",
  "seleccion": "local", "monto": 10.00, "cuota": 2.10,
  "estado": "pendiente", "ganancia": 0, "fecha": "2026-10-08T12:00:00"
}
```
`estado`: `"pendiente" | "ganada" | "perdida"`

---

## Auth

### `POST /auth/registro`
Body: `{ "nombre": "...", "email": "...", "password": "..." }`
- 201 → Usuario (saldo 100.00)
- 400 → faltan campos · 409 → email ya registrado

### `POST /auth/login`
Body: `{ "email": "...", "password": "..." }`
- 200 → Usuario
- 401 → credenciales inválidas

### `GET /usuarios/me` 🔒
- 200 → Usuario (con saldo actualizado)

## Partidos

### `GET /partidos`
Query opcional: `?estado=abierto`
- 200 → `Partido[]` ordenados por fecha ascendente

### `POST /partidos` 🔒👑
Body: `{ "local", "visitante", "fecha", "cuotaLocal", "cuotaEmpate", "cuotaVisitante" }`
- 201 → Partido
- 400 → faltan campos o alguna cuota ≤ 1

### `PUT /partidos/:id/resultado` 🔒👑
Body: `{ "resultado": "local" | "empate" | "visitante" }`
- 200 → `{ "partido": Partido, "apuestasLiquidadas": 5 }`
- 400 → resultado inválido · 404 → no existe · 409 → ya estaba finalizado

## Apuestas

### `POST /apuestas` 🔒
Body: `{ "partidoId": 1, "seleccion": "local", "monto": 10 }`
- 201 → `{ "apuesta": Apuesta, "saldo": 90.00 }`
- 400 → monto < 1, selección inválida o saldo insuficiente
- 404 → partido no existe · 409 → partido no está abierto

### `GET /apuestas` 🔒
- 200 → `Apuesta[]` del usuario, más recientes primero
