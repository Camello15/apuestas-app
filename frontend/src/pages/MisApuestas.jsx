import { useEffect, useState } from 'react';
import { listarMisApuestas } from '../api/cliente.js';
import { formatearDinero, formatearFecha, nombreSeleccion } from '../formato.js';

export default function MisApuestas() {
  const [apuestas, setApuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listarMisApuestas()
      .then(setApuestas)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <section>
      <h2>Mis apuestas</h2>
      {error && <p className="error">{error}</p>}
      {cargando && <p className="texto-suave">Cargando...</p>}
      {!cargando && apuestas.length === 0 && !error && (
        <p className="texto-suave">Todavía no has hecho ninguna apuesta.</p>
      )}

      {apuestas.length > 0 && (
        <div className="tabla-envoltura">
          <table className="tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Partido</th>
                <th>Selección</th>
                <th>Monto</th>
                <th>Cuota</th>
                <th>Estado</th>
                <th>Ganancia</th>
              </tr>
            </thead>
            <tbody>
              {apuestas.map((a) => (
                <tr key={a.id}>
                  <td>{formatearFecha(a.fecha)}</td>
                  <td>{a.local} vs {a.visitante}</td>
                  <td>{nombreSeleccion(a, a.seleccion)}</td>
                  <td>{formatearDinero(a.monto)}</td>
                  <td>{a.cuota.toFixed(2)}</td>
                  <td><span className={`estado estado-${a.estado}`}>{a.estado}</span></td>
                  <td>{a.estado === 'ganada' ? formatearDinero(a.ganancia) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
