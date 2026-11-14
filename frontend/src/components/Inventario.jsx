import { useState } from 'react';
import { Plus, ChevronRight, Sparkles } from 'lucide-react';

export function Inventario({ busqueda = '', onAbrirModal }) {
  const [filtroUbicacion, setFiltroUbicacion] = useState('Todos');

  // Lista de productos de ejemplo (igual a los de tu diseño)
  const productos = [
    { id: 1, emoji: '🥛', nombre: 'Yogur natural', ubicacion: 'Refrigerador', cantidad: '4 unidades', estado: '2 días', alerta: 'orange' },
    { id: 2, emoji: '🥬', nombre: 'Espinacas frescas', ubicacion: 'Refrigerador', cantidad: '250 g', estado: '3 días', alerta: 'olive' },
    { id: 3, emoji: '🍗', nombre: 'Pechuga de pollo', ubicacion: 'Congelador', cantidad: '600 g', estado: '5 días', alerta: 'brown' },
    { id: 4, emoji: '🍚', nombre: 'Arroz integral', ubicacion: 'Alacena', cantidad: '1 kg', estado: 'En buen estado', alerta: 'green' },
    { id: 5, emoji: '🫒', nombre: 'Aceite de oliva', ubicacion: 'Alacena', cantidad: '750 ml', estado: 'En buen estado', alerta: 'green' },
    { id: 6, emoji: '🧀', nombre: 'Queso manchego', ubicacion: 'Refrigerador', cantidad: '300 g', estado: '8 días', alerta: 'green' },
  ];

  // Filtramos por la barra de búsqueda superior y por el botón de ubicación
  const productosFiltrados = productos.filter((prod) => {
    const coincideTexto = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideUbicacion = filtroUbicacion === 'Todos' || prod.ubicacion === filtroUbicacion;
    return coincideTexto && coincideUbicacion;
  });

  return (
    <div className="dashboard-container">
      {/* Cabecera idéntica a tus capturas */}
      <div className="subpage-header">
        <div>
          <span className="date-label">CASA MARTÍNEZ</span>
          <h2>Inventario</h2>
          <p>Gestiona todos los productos disponibles en tu hogar.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

      {/* Filtros rápidos por ubicación */}
      <div className="filter-pills">
        {['Todos', 'Refrigerador', 'Alacena', 'Congelador'].map((lugar) => (
          <button
            key={lugar}
            className={`filter-pill ${filtroUbicacion === lugar ? 'active' : ''}`}
            onClick={() => setFiltroUbicacion(lugar)}
          >
            {lugar}
          </button>
        ))}
      </div>

      {/* Cuadrícula de 2 columnas (el molde de tus 5 vistas) */}
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
              <small>ESTADO</small>
              <strong className={`text-${item.alerta}`}>{item.estado}</strong>
            </div>
            <ChevronRight size={16} color="#ccc" />
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
