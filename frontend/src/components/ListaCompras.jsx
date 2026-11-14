import { Plus, ChevronRight, Sparkles, Check } from 'lucide-react';

export function ListaCompras({ busqueda = '', listaCompras, toggleCompra, onAbrirModal }) {
  // Filtramos por la barra de búsqueda superior
  const listaFiltrada = listaCompras.filter((item) =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Cabecera idéntica a tu captura */}
      <div className="subpage-header">
        <div>
          <span className="date-label">CASA MARTÍNEZ</span>
          <h2>Lista de compras</h2>
          <p>Mantén tu hogar abastecido sin comprar de más.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

      {/* Cuadrícula de 2 columnas */}
      <div className="two-col-grid">
        {listaFiltrada.map((item) => (
          <div 
            key={item.id} 
            className="item-card-row" 
            style={{ cursor: 'pointer' }}
            onClick={() => toggleCompra(item.id)}
          >
            <div className="item-left">
              {/* Checkbox personalizado idéntico al diseño */}
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  border: item.comprado ? 'none' : '1.5px solid #d5d7d2',
                  backgroundColor: item.comprado ? '#3b5d44' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.comprado && <Check size={14} color="#ffffff" strokeWidth={3} />}
              </div>

              <div>
                <strong 
                  style={{ 
                    textDecoration: item.comprado ? 'line-through' : 'none',
                    color: item.comprado ? '#888' : 'inherit'
                  }}
                >
                  {item.nombre}
                </strong>
                <small>{item.detalle} · Sugerido por existencias mínimas</small>
              </div>
            </div>
            
            <div className="item-right">
              <small style={{ textTransform: 'none', fontSize: '0.8rem', color: '#888' }}>
                {item.comprado ? 'Comprado' : 'Pendiente'}
              </small>
            </div>
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
