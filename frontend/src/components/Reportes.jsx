import { Plus, ChevronRight, Sparkles } from 'lucide-react';

export function Reportes({ busqueda = '', onAbrirModal, productos = [], movimientos = [] }) {
  const gastoTotal = movimientos.reduce((acum, mov) => {
    return acum + Number(mov.costo || 0);
  }, 0);

  const totalUnidades = productos.reduce((acum, prod) => {
    const cant = Number(prod.inventarios?.[0]?.detallesInventario?.[0]?.cantidad || 0);
    return acum + cant;
  }, 0);


  const categoriasActivas = new Set(productos.map((p) => p.categoria)).size;

  const metricas = [
    { id: 1, titulo: 'Gasto registrado', valor: `$${gastoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, comparativa: 'Total acumulado en inventario' },
    { id: 2, titulo: 'Productos distintos', valor: `${productos.length}`, comparativa: 'Artículos registrados en hogar' },
    { id: 3, titulo: 'Unidades en stock', valor: `${totalUnidades}`, comparativa: 'Suma total de existencias' },
    { id: 4, titulo: 'Categorías activas', valor: `${categoriasActivas}`, comparativa: 'De 6 categorías disponibles' },
  ];

  const metricasFiltradas = metricas.filter((m) =>
    m.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="subpage-header">
        <div>
          <span className="date-label">MI HOGAR</span>
          <h2>Reportes</h2>
          <p>Conoce mejor el consumo y los gastos de tu hogar.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

      <div className="two-col-grid">
        {metricasFiltradas.map((item) => (
          <div 
            key={item.id} 
            className="item-card-row" 
            style={{ 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              gap: '8px',
              padding: '22px 24px' 
            }}
          >
            <small style={{ color: '#888', fontSize: '0.82rem' }}>{item.titulo}</small>
            <h3 style={{ margin: 0, fontSize: '1.85rem', fontWeight: '700', color: '#1f2421' }}>
              {item.valor}
            </h3>
            <small className="text-green" style={{ fontWeight: '500' }}>
              {item.comparativa}
            </small>
          </div>
        ))}
      </div>

      <div className="local-mode-banner">
        <div className="banner-left">
          <Sparkles size={16} color="#3b5d44" />
          <span>
            <strong>Conectado al servidor</strong> · Indicadores calculados con los costos de tu inventario.
          </span>
        </div>
        <ChevronRight size={16} color="#888" />
      </div>
    </div>
  );
}
