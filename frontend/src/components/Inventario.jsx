import { useState } from 'react';
import { Plus, ChevronRight, Sparkles, MinusCircle } from 'lucide-react';
import { consumirProductoBackend } from '../services/api';

export function Inventario({ busqueda = '', onAbrirModal, productos = [], usuario, onRecargar }) {
  const [filtroUbicacion, setFiltroUbicacion] = useState('Todos');
  const [procesandoId, setProcesandoId] = useState(null);

  const obtenerEmoji = (categoria = '') => {
    const cat = categoria.toLowerCase();
    if (cat.includes('lácteo') || cat.includes('lacteo')) return '🥛';
    if (cat.includes('fruta') || cat.includes('verdura')) return '🥬';
    if (cat.includes('carne')) return '🍗';
    if (cat.includes('despensa')) return '🍚';
    if (cat.includes('limpieza')) return '🧴';
    if (cat.includes('cuidado')) return '🧼';
    return '📦';
  };

  const manejarConsumo = async (idProducto) => {
    if (!usuario?.idUsuario) return;
    setProcesandoId(idProducto);
    try {
      await consumirProductoBackend(idProducto, usuario.idUsuario, 1);
      if (onRecargar) await onRecargar();
    } catch (error) {
      alert(error.message);
    } finally {
      setProcesandoId(null);
    }
  };

  const productosFormateados = productos.map((prod) => {
    const inv = prod.inventarios?.[0];
    const det = inv?.detallesInventario?.[0];
    const ubicacion = inv?.ubicacion || 'Alacena';
    const cantidad = det ? `${det.cantidad} ${prod.unidadMedida}` : prod.unidadMedida;

    let estado = 'En buen estado';
    let alerta = 'green';

    if (det?.fechaCaducidad) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const cad = new Date(det.fechaCaducidad + 'T00:00:00');
      const dias = Math.ceil((cad - hoy) / (1000 * 60 * 60 * 24));

      if (dias < 0) {
        estado = 'Caducado';
        alerta = 'orange';
      } else if (dias === 0) {
        estado = 'Hoy';
        alerta = 'orange';
      } else if (dias <= 2) {
        estado = `${dias} días`;
        alerta = 'orange';
      } else if (dias <= 4) {
        estado = `${dias} días`;
        alerta = 'olive';
      } else if (dias <= 6) {
        estado = `${dias} días`;
        alerta = 'brown';
      } else {
        estado = `${dias} días`;
        alerta = 'green';
      }
    }

    return {
      id: prod.idProducto,
      emoji: obtenerEmoji(prod.categoria),
      nombre: prod.nombre,
      ubicacion,
      cantidad,
      estado,
      alerta,
    };
  });

  const productosFiltrados = productosFormateados.filter((prod) => {
    const coincideTexto = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideUbicacion = filtroUbicacion === 'Todos' || prod.ubicacion === filtroUbicacion;
    return coincideTexto && coincideUbicacion;
  });

  return (
    <div className="dashboard-container">
      <div className="subpage-header">
        <div>
          <span className="date-label">MI HOGAR</span>
          <h2>Inventario</h2>
          <p>Gestiona todos los productos disponibles en tu hogar.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

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

      {productosFiltrados.length === 0 ? (
        <div className="item-card-row" style={{ justifyContent: 'center', padding: '32px', color: '#888' }}>
          No hay productos registrados en esta vista. ¡Agrega el primero con el botón verde!
        </div>
      ) : (
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="item-right">
                  <small>ESTADO</small>
                  <strong className={`text-${item.alerta}`}>{item.estado}</strong>
                </div>

                <button
                  type="button"
                  disabled={procesandoId === item.id}
                  onClick={() => manejarConsumo(item.id)}
                  title="Consumir 1 unidad"
                  style={{
                    backgroundColor: '#f4f6f4',
                    border: '1px solid #dce2dd',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    color: '#3b5d44',
                    cursor: 'pointer',
                  }}
                >
                  <MinusCircle size={14} />
                  <span>{procesandoId === item.id ? '...' : 'Consumir'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="local-mode-banner">
        <div className="banner-left">
          <Sparkles size={16} color="#3b5d44" />
          <span>
            <strong>Conectado al servidor</strong> · Los consumos se descuentan y registran en tu historial.
          </span>
        </div>
        <ChevronRight size={16} color="#888" />
      </div>
    </div>
  );
}
