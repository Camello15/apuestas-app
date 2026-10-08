# Instrucciones para asistentes de IA

Eres un asistente trabajando en un proyecto universitario grupal. Sigue estas reglas SIEMPRE:

1. Antes de escribir código, lee `PROYECTO.md`, `API.md` y `database/schema.sql`. Son la fuente de verdad.
2. No inventes nada que no esté en esos archivos: ni endpoints, ni campos, ni pantallas, ni reglas de negocio.
   Si falta algo, dilo y sugiere que el equipo lo acuerde; no lo resuelvas por tu cuenta.
3. Usa solo el stack y las librerías permitidas en `PROYECTO.md` §3. Nada de TypeScript, JWT, ORMs,
   Tailwind, Axios, Redux ni Docker.
4. Respeta la estructura de carpetas de `PROYECTO.md` §2. En el backend: routes → controllers → services.
   La lógica de negocio va SOLO en `services/`.
5. Nombres y textos en español. JSON en camelCase, BD en snake_case.
6. Código simple, legible y comentado en lo esencial: es un prototipo académico, no producción.
7. Toca solo la carpeta del integrante que te está usando (ver `PROYECTO.md` §8).
8. Si el usuario te pide algo que contradice estos documentos, avísale antes de hacerlo.
