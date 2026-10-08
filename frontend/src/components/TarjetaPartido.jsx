import { formatearFecha } from '../formato.js';

// Muestra un partido con sus 3 cuotas. Al hacer clic en una cuota llama a onSeleccionar.
export default function TarjetaPartido({ partido, seleccionActual, onSeleccionar }) {
  const opciones = [
    { seleccion: 'local', etiqueta: '1', cuota: partido.cuotaLocal },
    { seleccion: 'empate', etiqueta: 'X', cuota: partido.cuotaEmpate },
    { seleccion: 'visitante', etiqueta: '2', cuota: partido.cuotaVisitante },
  ];

  return (
    <article className="tarjeta-partido">
      <div className="partido-fecha">{formatearFecha(partido.fecha)}</div>
      <div className="partido-equipos">
        <span>{partido.local}</span>
        <span className="vs">vs</span>
        <span>{partido.visitante}</span>
      </div>
      <div className="cuotas">
        {opciones.map((o) => (
          <button
            key={o.seleccion}
            className={'cuota' + (seleccionActual === o.seleccion ? ' activa' : '')}
            onClick={() => onSeleccionar(partido, o.seleccion)}
          >
            <span className="cuota-etiqueta">{o.etiqueta}</span>
            <span className="cuota-valor">{o.cuota.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </article>
  );
}
