import { Plus, ChevronRight, Sparkles } from 'lucide-react';

export function Movimientos({ busqueda = '', onAbrirModal, movimientos = [], usuario }) {
  const obtenerIniciales = (nombre = 'U') => {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.slice(0, 2).toUpperCase();
  };

  const nombreHogar = usuario?.familia?.nombre || 'Mi Hogar';

  const movimientosFormateados = movimientos.map((mov) => {
    const nombreUser = mov.usuario?.nombre || usuario?.nombre || 'Usuario';
    const nombreProd = mov.producto?.nombre || 'Producto';
    const unidad = mov.producto?.unidadMedida || '';
    const esConsumo = mov.tipoMovimiento?.toLowerCase().includes('consumo');

    const accionTexto = esConsumo
      ? `${nombreUser} consumió "${nombreProd}" (${mov.cantidadAfectada} ${unidad})`
      : `${nombreUser} agregó "${nombreProd}" (${mov.cantidadAfectada} ${unidad})`;

    return {
      id: mov.idMovimiento,
      iniciales: obtenerIniciales(nombreUser),
      accion: accionTexto,
      fecha: mov.fechaMovimiento || 'Reciente',
      hogar: nombreHogar,
      esConsumo,
    };
  });

  const movimientosFiltrados = movimientosFormateados.filter((mov) =>
    mov.accion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="subpage-header">
        <div>
          <span className="date-label">{nombreHogar.toUpperCase()}</span>
          <h2>Movimientos</h2>
          <p>Consulta qué cambió, quién lo hizo y cuándo.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

      {movimientosFiltrados.length === 0 ? (
        <div className="item-card-row" style={{ justifyContent: 'center', padding: '32px', color: '#888' }}>
          Aún no hay movimientos registrados. Agrega o consume un producto para verlo aquí.
        </div>
      ) : (
        <div className="two-col-grid">
          {movimientosFiltrados.map((mov) => (
            <div key={mov.id} className="item-card-row">
              <div className="item-left">
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: mov.esConsumo ? '#f3e3d3' : '#e6efe8',
                    color: mov.esConsumo ? '#a86b3e' : '#3b5d44',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  {mov.iniciales}
                </div>

                <div>
                  <strong>{mov.accion}</strong>
                  <small>{mov.fecha}</small>
                </div>
              </div>
              
              <div className="item-right">
                <small style={{ textTransform: 'none', fontSize: '0.8rem', color: '#888' }}>
                  {mov.hogar}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="local-mode-banner">
        <div className="banner-left">
          <Sparkles size={16} color="#3b5d44" />
          <span>
            <strong>Conectado al servidor</strong> · Historial auditado en tiempo real desde la base de datos.
          </span>
        </div>
        <ChevronRight size={16} color="#888" />
      </div>
    </div>
  );
}
