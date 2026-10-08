import { useState } from 'react';
import { formatearDinero, nombreSeleccion } from '../formato.js';

// Boleto lateral: muestra la selección elegida, pide el monto y confirma la apuesta.
export default function BoletoApuesta({ partido, seleccion, saldo, onApostar, onCancelar }) {
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!partido) {
    return (
      <aside className="boleto">
        <h3>Boleto de apuesta</h3>
        <p className="texto-suave">Elige una cuota de cualquier partido para apostar.</p>
      </aside>
    );
  }

  const cuotas = { local: partido.cuotaLocal, empate: partido.cuotaEmpate, visitante: partido.cuotaVisitante };
  const cuota = cuotas[seleccion];
  const montoNumero = Number(monto) || 0;
  const gananciaPosible = Math.round(montoNumero * cuota * 100) / 100;

  async function confirmar(e) {
    e.preventDefault();
    setError('');
    // Validaciones rápidas en pantalla (R1); el backend vuelve a validar
    if (montoNumero < 1) return setError('El monto mínimo es $1.00');
    if (montoNumero > saldo) return setError('Saldo insuficiente');

    setEnviando(true);
    try {
      await onApostar(montoNumero);
      setMonto('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <aside className="boleto">
      <h3>Boleto de apuesta</h3>
      <p className="boleto-partido">{partido.local} vs {partido.visitante}</p>
      <p>
        Tu selección: <strong>{nombreSeleccion(partido, seleccion)}</strong> @ {cuota.toFixed(2)}
      </p>

      <form onSubmit={confirmar}>
        <label>
          Monto
          <input
            type="number" min="1" step="0.01" placeholder="1.00"
            value={monto} onChange={(e) => setMonto(e.target.value)}
          />
        </label>
        <p>Ganancia posible: <strong>{formatearDinero(gananciaPosible)}</strong></p>
        {error && <p className="error">{error}</p>}
        <div className="fila-botones">
          <button type="button" className="boton-secundario" onClick={onCancelar}>Cancelar</button>
          <button type="submit" disabled={enviando}>{enviando ? 'Apostando...' : 'Apostar'}</button>
        </div>
      </form>
    </aside>
  );
}
