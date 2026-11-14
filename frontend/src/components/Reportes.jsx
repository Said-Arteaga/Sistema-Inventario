import { Plus, ChevronRight, Sparkles } from 'lucide-react';

export function Reportes({ busqueda = '', onAbrirModal }) {
  // Métricas idénticas a tu captura de pantalla
  const metricas = [
    { id: 1, titulo: 'Gasto mensual', valor: '$2,840', comparativa: '-12% vs. mes anterior' },
    { id: 2, titulo: 'Productos consumidos', valor: '172', comparativa: '+6% este mes' },
    { id: 3, titulo: 'Desperdicio evitado', valor: '8.4 kg', comparativa: '+18% vs. mes anterior' },
    { id: 4, titulo: 'Ahorro estimado', valor: '$640', comparativa: '+15% este mes' },
  ];

  // Filtramos por la barra de búsqueda superior
  const metricasFiltradas = metricas.filter((m) =>
    m.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Cabecera idéntica a tu captura */}
      <div className="subpage-header">
        <div>
          <span className="date-label">CASA MARTÍNEZ</span>
          <h2>Reportes</h2>
          <p>Conoce mejor el consumo y los gastos de tu hogar.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

      {/* Cuadrícula de 2 columnas con tarjetas métricas verticales */}
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

      {/* Banner inferior de Modo Local Activo */}
      <div className="local-mode-banner">
        <div className="banner-left">
          <Sparkles size={16} color="#3b5d44" />
          <span>
            <strong>Modo local activo</strong> · Conecta el backend para compartir cambios entre todos los miembros del hogar.
          </span>
        </div>
        <ChevronRight size={16} color="#888" />
      </div>
    </div>
  );
}
