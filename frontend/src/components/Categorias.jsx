import { Plus, ChevronRight, Sparkles } from 'lucide-react';

export function Categorias({ busqueda = '', onAbrirModal }) {
  // Datos idénticos a tu captura de pantalla
  const categorias = [
    { id: 1, emoji: '🥬', nombre: 'Frutas y verduras', cantidad: 18 },
    { id: 2, emoji: '🥛', nombre: 'Lácteos', cantidad: 12 },
    { id: 3, emoji: '🍗', nombre: 'Carnes', cantidad: 8 },
    { id: 4, emoji: '🥫', nombre: 'Despensa', cantidad: 31 },
    { id: 5, emoji: '🧴', nombre: 'Limpieza', cantidad: 10 },
    { id: 6, emoji: '🧼', nombre: 'Cuidado personal', cantidad: 7 },
  ];

  // Filtramos por la barra de búsqueda superior
  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Cabecera idéntica a tu diseño */}
      <div className="subpage-header">
        <div>
          <span className="date-label">CASA MARTÍNEZ</span>
          <h2>Categorías</h2>
          <p>Organiza tus productos y encuentra todo más rápido.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

      {/* Cuadrícula de 2 columnas con tus mismas clases */}
      <div className="two-col-grid">
        {categoriasFiltradas.map((cat) => (
          <div 
            key={cat.id} 
            className="item-card-row" 
            style={{ cursor: 'pointer' }}
            onClick={() => console.log(`Seleccionaste: ${cat.nombre}`)}
          >
            <div className="item-left">
              <span className="food-emoji">{cat.emoji}</span>
              <div>
                <strong>{cat.nombre}</strong>
                <small>{cat.cantidad} productos</small>
              </div>
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
