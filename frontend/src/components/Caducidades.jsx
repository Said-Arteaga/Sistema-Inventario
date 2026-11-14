import { Plus, ChevronRight, Sparkles } from 'lucide-react';

export function Caducidades({ busqueda = '', onAbrirModal, productos = [] }) {
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

  // Procesamos los productos reales y calculamos los días restantes
  const listaCaducidades = productos
    .map((prod) => {
      const inv = prod.inventarios?.[0];
      const det = inv?.detallesInventario?.[0];
      if (!det?.fechaCaducidad) return null;

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const cad = new Date(det.fechaCaducidad + 'T00:00:00');
      const diasRestantes = Math.ceil((cad - hoy) / (1000 * 60 * 60 * 24));

      let textoDias = `Caduca en ${diasRestantes} días`;
      let alerta = 'green';

      if (diasRestantes < 0) {
        textoDias = `Caducado hace ${Math.abs(diasRestantes)} días`;
        alerta = 'orange';
      } else if (diasRestantes === 0) {
        textoDias = 'Caduca hoy';
        alerta = 'orange';
      } else if (diasRestantes === 1) {
        textoDias = 'Caduca mañana';
        alerta = 'orange';
      } else if (diasRestantes <= 2) {
        alerta = 'orange';
      } else if (diasRestantes <= 4) {
        alerta = 'olive';
      } else if (diasRestantes <= 7) {
        alerta = 'brown';
      }

      return {
        id: prod.idProducto,
        emoji: obtenerEmoji(prod.categoria),
        nombre: prod.nombre,
        ubicacion: inv?.ubicacion || 'Alacena',
        cantidad: `${det.cantidad} ${prod.unidadMedida}`,
        diasRestantes,
        diasTexto: textoDias,
        alerta,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.diasRestantes - b.diasRestantes);

  const productosFiltrados = listaCaducidades.filter((prod) =>
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="subpage-header">
        <div>
          <span className="date-label">MI HOGAR</span>
          <h2>Caducidades</h2>
          <p>Prioriza lo que debes consumir y evita desperdicios.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="item-card-row" style={{ justifyContent: 'center', padding: '32px', color: '#888' }}>
          No hay productos con fecha de caducidad registrada todavía.
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
              
              <div className="item-right">
                <strong className={`text-${item.alerta}`} style={{ fontSize: '0.85rem' }}>
                  {item.diasTexto}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="local-mode-banner">
        <div className="banner-left">
          <Sparkles size={16} color="#3b5d44" />
          <span>
            <strong>Conectado al servidor</strong> · Ordenado automáticamente por fecha de vencimiento.
          </span>
        </div>
        <ChevronRight size={16} color="#888" />
      </div>
    </div>
  );
}
