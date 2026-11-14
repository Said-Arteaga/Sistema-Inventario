import { Plus, ChevronRight, Sparkles } from 'lucide-react';

export function Caducidades({ busqueda = '', onAbrirModal }) {
  // Lista de productos próximos a caducar idéntica a tu captura
  const productosCaducidad = [
    { id: 1, emoji: '🥛', nombre: 'Yogur natural', ubicacion: 'Refrigerador', cantidad: '4 unidades', dias: 'Caduca en 2 días', alerta: 'orange' },
    { id: 2, emoji: '🥬', nombre: 'Espinacas', ubicacion: 'Refrigerador', cantidad: '250 g', dias: 'Caduca en 3 días', alerta: 'olive' },
    { id: 3, emoji: '🍗', nombre: 'Pechuga de pollo', ubicacion: 'Congelador', cantidad: '600 g', dias: 'Caduca en 5 días', alerta: 'brown' },
    { id: 4, emoji: '🧀', nombre: 'Queso manchego', ubicacion: 'Refrigerador', cantidad: '300 g', dias: 'Caduca en 8 días', alerta: 'green' },
  ];

  // Filtramos por la barra de búsqueda superior
  const productosFiltrados = productosCaducidad.filter((prod) =>
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Cabecera idéntica a tu captura */}
      <div className="subpage-header">
        <div>
          <span className="date-label">CASA MARTÍNEZ</span>
          <h2>Caducidades</h2>
          <p>Prioriza lo que debes consumir y evita desperdicios.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

      {/* Cuadrícula de 2 columnas */}
      <div className="two-col-grid">
        {productosFiltrados.map((item) => (
          <div key={item.id} className="item-card-row">
            <div className="item-left">
              <span className="food-emoji">{item.emoji}</span>
              <div>
                <strong>{item.nombre}</strong>
                <small>{item.ubicacion} · {item.cantidad}</small>
              </div>
            </div>
            
            <div className="item-right">
              <strong className={`text-${item.alerta}`} style={{ fontSize: '0.85rem' }}>
                {item.dias}
              </strong>
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

