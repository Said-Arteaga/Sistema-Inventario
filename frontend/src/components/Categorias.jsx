import { Plus, ChevronRight, Sparkles } from 'lucide-react';

export function Categorias({ busqueda = '', onAbrirModal, productos = [] }) {
  const categoriasBase = [
    { id: 1, emoji: '🥬', nombre: 'Frutas y verduras' },
    { id: 2, emoji: '🥛', nombre: 'Lácteos' },
    { id: 3, emoji: '🍗', nombre: 'Carnes' },
    { id: 4, emoji: '🥫', nombre: 'Despensa' },
    { id: 5, emoji: '🧴', nombre: 'Limpieza' },
    { id: 6, emoji: '🧼', nombre: 'Cuidado personal' },
  ];

  // Calculamos la cantidad real de productos por cada categoría
  const categoriasConConteo = categoriasBase.map((cat) => {
    const total = productos.filter(
      (p) => p.categoria?.toLowerCase() === cat.nombre.toLowerCase()
    ).length;
    return { ...cat, cantidad: total };
  });

  const categoriasFiltradas = categoriasConConteo.filter((cat) =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="subpage-header">
        <div>
          <span className="date-label">MI HOGAR</span>
          <h2>Categorías</h2>
          <p>Organiza tus productos y encuentra todo más rápido.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

      <div className="two-col-grid">
        {categoriasFiltradas.map((cat) => (
          <div 
            key={cat.id} 
            className="item-card-row" 
            style={{ cursor: 'pointer' }}
          >
            <div className="item-left">
              <span className="food-emoji">{cat.emoji}</span>
              <div>
                <strong>{cat.nombre}</strong>
                <small>{cat.cantidad} {cat.cantidad === 1 ? 'producto' : 'productos'}</small>
              </div>
            </div>
            
            <ChevronRight size={16} color="#ccc" />
          </div>
        ))}
      </div>

      <div className="local-mode-banner">
        <div className="banner-left">
          <Sparkles size={16} color="#3b5d44" />
          <span>
            <strong>Conectado al servidor</strong> · Conteo calculado en tiempo real desde tu base de datos.
          </span>
        </div>
        <ChevronRight size={16} color="#888" />
      </div>
    </div>
  );
}
