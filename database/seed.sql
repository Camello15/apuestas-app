-- Datos de prueba. Contraseña de ambos usuarios: 123456 (hash bcryptjs, 10 rondas)
INSERT INTO usuarios (nombre, email, password_hash, saldo, rol) VALUES
 ('Admin', 'admin@test.com', '$2b$10$xWEkoAd9PdCGxOw2WPQLGesua8IXZ9N.A9jOV0hTlkKZhpvxZZn7y', 1000.00, 'admin'),
 ('Camilo', 'camilo@test.com', '$2b$10$xWEkoAd9PdCGxOw2WPQLGesua8IXZ9N.A9jOV0hTlkKZhpvxZZn7y', 100.00, 'usuario');

INSERT INTO partidos (local, visitante, fecha, cuota_local, cuota_empate, cuota_visitante) VALUES
 ('LDU Quito', 'Barcelona SC', '2026-10-15T19:00:00', 2.10, 3.20, 3.50),
 ('Emelec', 'Independiente del Valle', '2026-10-16T17:00:00', 3.10, 3.00, 2.30),
 ('Liga de Loja', 'Aucas', '2026-10-17T15:30:00', 2.40, 3.10, 2.90),
 ('Deportivo Cuenca', 'Universidad Católica', '2026-10-18T20:00:00', 2.60, 3.00, 2.70);
