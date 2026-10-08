import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/cliente.js';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navegar = useNavigate();

  async function enviar(e) {
    e.preventDefault();
    setError('');
    try {
      const usuario = await login(email, password);
      onLogin(usuario);
      navegar('/partidos');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="tarjeta formulario-centro">
      <h2>Iniciar sesión</h2>
      <form onSubmit={enviar}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
      <p className="texto-suave">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </section>
  );
}
