import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrar } from '../api/cliente.js';

export default function Registro({ onRegistro }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navegar = useNavigate();

  async function enviar(e) {
    e.preventDefault();
    setError('');
    try {
      // El registro devuelve el usuario con saldo $100.00, así que entramos directo
      const usuario = await registrar(nombre, email, password);
      onRegistro(usuario);
      navegar('/partidos');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="tarjeta formulario-centro">
      <h2>Crear cuenta</h2>
      <p className="texto-suave">Recibes $100.00 de saldo ficticio para empezar.</p>
      <form onSubmit={enviar}>
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Registrarme</button>
      </form>
      <p className="texto-suave">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </section>
  );
}
