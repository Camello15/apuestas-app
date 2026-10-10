// auth ya cargó el usuario desde la BD en esta petición,
// así que el saldo siempre está actualizado
export function me(req, res) {
  res.json(req.usuario);
}