# App de Apuestas — Arquitectura de Software (UTPL)

Prototipo académico con dinero ficticio. Lee `PROYECTO.md` antes de empezar.

## Archivos que mandan (no cambiar sin acuerdo del grupo)

| Archivo | Qué define |
|---|---|
| `PROYECTO.md` | Arquitectura, stack, alcance, reglas de negocio, responsables |
| `API.md` | Contrato exacto entre frontend y backend |
| `database/schema.sql` | Tablas de la base de datos |
| `AGENTS.md` (+ copias) | Reglas que lee cualquier IA |

Las copias de las reglas para IA (`CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`)
existen para que Claude Code, Cursor y Copilot las lean solas. Si usan ChatGPT o Claude en el navegador,
**peguen al inicio del chat** el contenido de `AGENTS.md`, `PROYECTO.md` y `API.md`.

## Cómo trabajar juntos

1. Uno crea el repo en GitHub con esta carpeta y agrega a los otros dos como colaboradores.
2. Cada uno: `git clone <url>` y trabaja **solo en su carpeta**.
3. Antes de empezar: `git pull`. Al terminar algo: `git add . && git commit -m "feat: ..." && git push`.
4. Para sesiones en vivo (como Canva): VS Code → extensión **Live Share** → "Share" → pasar el link.

## Correr en local

```bash
# Terminal 1 - backend (puerto 3000)
cd backend && npm install && npm run dev

# Terminal 2 - frontend (puerto 5173)
cd frontend && npm install && npm run dev
```

Usuarios de prueba (contraseña `123456`): `admin@test.com` (admin) y `camilo@test.com`.
