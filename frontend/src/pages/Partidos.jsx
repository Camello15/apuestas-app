import { useEffect, useState } from 'react';
import TarjetaPartido from '../components/TarjetaPartido.jsx';
import BoletoApuesta from '../components/BoletoApuesta.jsx';
import { apostar, listarPartidos } from '../api/cliente.js';
import { formatearDinero } from '../formato.js';

export default function Partidos({ usuario, onCambioUsuario }) {
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  // Lo que el usuario eligió para el boleto: { partido, seleccion }
  const [eleccion, setEleccion] = useState(null);

  useEffect(() => {
    listarPartidos('abierto')
      .then(setPartidos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  function seleccionar(partido, seleccion) {
    setMensaje('');
    setEleccion({ partido, seleccion });
  }

  async function confirmarApuesta(monto) {
    const { apuesta, saldo } = await apostar(eleccion.partido.id, eleccion.seleccion, monto);
    onCambioUsuario({ ...usuario, saldo });
    setEleccion(null);
    setMensaje(`Apuesta registrada: ${formatearDinero(apuesta.monto)} @ ${apuesta.cuota.toFixed(2)}`);
  }

  return (
    <div className="pagina-partidos">
      <section>
        <h2>Partidos abiertos</h2>
        {mensaje && <p className="exito">{mensaje}</p>}
        {error && <p className="error">{error}</p>}
        {cargando && <p className="texto-suave">Cargando partidos...</p>}
        {!cargando && partidos.length === 0 && !error && (
          <p className="texto-suave">No hay partidos abiertos por ahora.</p>
        )}
        <div className="lista-partidos">
          {partidos.map((p) => (
            <TarjetaPartido
              key={p.id}
              partido={p}
              seleccionActual={eleccion?.partido.id === p.id ? eleccion.seleccion : null}
              onSeleccionar={seleccionar}
            />
          ))}
        </div>
      </section>

      <BoletoApuesta
        key={eleccion ? `${eleccion.partido.id}-${eleccion.seleccion}` : 'vacio'}
        partido={eleccion?.partido}
        seleccion={eleccion?.seleccion}
        saldo={usuario.saldo}
        onApostar={confirmarApuesta}
        onCancelar={() => setEleccion(null)}
      />
    </div>
  );
}
