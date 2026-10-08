import { NavLink, useNavigate } from 'react-router-dom';
import { formatearDinero } from '../formato.js';

export default function Navbar({ usuario, onSalir }) {
  const navegar = useNavigate();

  function salir() {
    onSalir();
    navegar('/login');
  }

  return (
    <header className="navbar">
      <div className="navbar-marca">⚽ Apuestas UTPL</div>

      {usuario && (
        <nav className="navbar-links">
          <NavLink to="/partidos">Partidos</NavLink>
          <NavLink to="/mis-apuestas">Mis apuestas</NavLink>
          {usuario.rol === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>
      )}

      {usuario && (
        <div className="navbar-usuario">
          <span>{usuario.nombre}</span>
          <span className="saldo">{formatearDinero(usuario.saldo)}</span>
          <button className="boton-secundario" onClick={salir}>Salir</button>
        </div>
      )}
    </header>
  );
}
