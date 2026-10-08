import { useEffect, useState } from 'react';
import { crearPartido, listarPartidos, registrarResultado } from '../api/cliente.js';
import { formatearFecha, nombreSeleccion } from '../formato.js';

const PARTIDO_VACIO = { local: '', visitante: '', fecha: '', cuotaLocal: '', cuotaEmpate: '', cuotaVisitante: '' };

export default function Admin() {
  const [partidos, setPartidos] = useState([]);
  const [nuevo, setNuevo] = useState(PARTIDO_VACIO);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  function cargarPartidos() {
    listarPartidos().then(setPartidos).catch((err) => setError(err.message));
  }

  useEffect(cargarPartidos, []);

  function cambiarCampo(e) {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  }

  async function enviarPartido(e) {
    e.preventDefault();
    setError('');
    setMensaje('');
    try {
      const partido = await crearPartido({
        ...nuevo,
        // <input type="datetime-local"> da "2026-10-15T19:00"; API.md usa segundos
        fecha: nuevo.fecha.length === 16 ? nuevo.fecha + ':00' : nuevo.fecha,
        cuotaLocal: Number(nuevo.cuotaLocal),
        cuotaEmpate: Number(nuevo.cuotaEmpate),
        cuotaVisitante: Number(nuevo.cuotaVisitante),
      });
      setMensaje(`Partido creado: ${partido.local} vs ${partido.visitante}`);
      setNuevo(PARTIDO_VACIO);
      cargarPartidos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function cerrarPartido(partido, resultado) {
    const texto = nombreSeleccion(partido, resultado);
    if (!confirm(`¿Registrar resultado "${texto}" para ${partido.local} vs ${partido.visitante}? No se puede deshacer.`)) return;
    setError('');
    setMensaje('');
    try {
      const respuesta = await registrarResultado(partido.id, resultado);
      setMensaje(`Resultado registrado. Apuestas liquidadas: ${respuesta.apuestasLiquidadas}`);
      cargarPartidos();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="pagina-admin">
      <section className="tarjeta">
        <h2>Crear partido</h2>
        <form className="formulario-partido" onSubmit={enviarPartido}>
          <label>Local<input name="local" value={nuevo.local} onChange={cambiarCampo} required /></label>
          <label>Visitante<input name="visitante" value={nuevo.visitante} onChange={cambiarCampo} required /></label>
          <label>Fecha<input type="datetime-local" name="fecha" value={nuevo.fecha} onChange={cambiarCampo} required /></label>
          <label>Cuota local<input type="number" step="0.01" min="1.01" name="cuotaLocal" value={nuevo.cuotaLocal} onChange={cambiarCampo} required /></label>
          <label>Cuota empate<input type="number" step="0.01" min="1.01" name="cuotaEmpate" value={nuevo.cuotaEmpate} onChange={cambiarCampo} required /></label>
          <label>Cuota visitante<input type="number" step="0.01" min="1.01" name="cuotaVisitante" value={nuevo.cuotaVisitante} onChange={cambiarCampo} required /></label>
          <button type="submit">Crear partido</button>
        </form>
      </section>

      <section>
        <h2>Partidos</h2>
        {mensaje && <p className="exito">{mensaje}</p>}
        {error && <p className="error">{error}</p>}
        <div className="tabla-envoltura">
          <table className="tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Partido</th>
                <th>Cuotas (1 / X / 2)</th>
                <th>Estado</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {partidos.map((p) => (
                <tr key={p.id}>
                  <td>{formatearFecha(p.fecha)}</td>
                  <td>{p.local} vs {p.visitante}</td>
                  <td>{p.cuotaLocal.toFixed(2)} / {p.cuotaEmpate.toFixed(2)} / {p.cuotaVisitante.toFixed(2)}</td>
                  <td><span className={`estado estado-${p.estado}`}>{p.estado}</span></td>
                  <td>
                    {p.estado === 'finalizado' ? (
                      nombreSeleccion(p, p.resultado)
                    ) : (
                      <div className="fila-botones">
                        <button className="boton-chico" onClick={() => cerrarPartido(p, 'local')}>Local</button>
                        <button className="boton-chico" onClick={() => cerrarPartido(p, 'empate')}>Empate</button>
                        <button className="boton-chico" onClick={() => cerrarPartido(p, 'visitante')}>Visitante</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
