import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Partidos from './pages/Partidos.jsx';
import MisApuestas from './pages/MisApuestas.jsx';
import Admin from './pages/Admin.jsx';
import {
  MODO_SIMULADO, cerrarSesion, guardarUsuario, obtenerMiUsuario, obtenerUsuarioGuardado,
} from './api/cliente.js';

export default function App() {
  const [usuario, setUsuario] = useState(obtenerUsuarioGuardado());

  // Guarda el usuario en estado y en localStorage (o lo borra si es null)
  function actualizarUsuario(nuevo) {
    if (nuevo) guardarUsuario(nuevo);
    else cerrarSesion();
    setUsuario(nuevo);
  }

  // Al abrir la app, refresca el saldo desde el backend
  useEffect(() => {
    if (!usuario) return;
    obtenerMiUsuario()
      .then(actualizarUsuario)
      .catch(() => actualizarUsuario(null));
  }, []);

  const conSesion = (pagina) => (usuario ? pagina : <Navigate to="/login" />);
  const sinSesion = (pagina) => (usuario ? <Navigate to="/partidos" /> : pagina);

  return (
    <>
      <Navbar usuario={usuario} onSalir={() => actualizarUsuario(null)} />
      {MODO_SIMULADO && (
        <div className="aviso-simulado">Modo simulado: datos de prueba sin backend</div>
      )}
      <main className="contenedor">
        <Routes>
          <Route path="/login" element={sinSesion(<Login onLogin={actualizarUsuario} />)} />
          <Route path="/registro" element={sinSesion(<Registro onRegistro={actualizarUsuario} />)} />
          <Route path="/partidos" element={conSesion(<Partidos usuario={usuario} onCambioUsuario={actualizarUsuario} />)} />
          <Route path="/mis-apuestas" element={conSesion(<MisApuestas />)} />
          <Route
            path="/admin"
            element={conSesion(
              usuario?.rol === 'admin' ? <Admin /> : <Navigate to="/partidos" />
            )}
          />
          <Route path="*" element={<Navigate to={usuario ? '/partidos' : '/login'} />} />
        </Routes>
      </main>
    </>
  );
}
