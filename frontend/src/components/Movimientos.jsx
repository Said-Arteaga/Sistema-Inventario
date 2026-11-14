import { Plus, ChevronRight, Sparkles } from 'lucide-react';

export function Movimientos({ busqueda = '', onAbrirModal }) {
  // Historial de actividad idéntico a tu captura
  const movimientos = [
    { id: 1, iniciales: 'LM', accion: 'Lucía agregó "Yogur natural"', fecha: 'Hoy, 9:42', hogar: 'Casa Martínez' },
    { id: 2, iniciales: 'AM', accion: 'Andrés consumió "Arroz integral"', fecha: 'Ayer, 20:15', hogar: 'Casa Martínez' },
    { id: 3, iniciales: 'SM', accion: 'Sofía marcó "Huevos" como comprado', fecha: 'Ayer, 18:30', hogar: 'Casa Martínez' },
    { id: 4, iniciales: 'LM', accion: 'Lucía actualizó "Aceite de oliva"', fecha: 'Lunes, 11:08', hogar: 'Casa Martínez' },
  ];

  // Filtramos por la barra de búsqueda superior
  const movimientosFiltrados = movimientos.filter((mov) =>
    mov.accion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Cabecera idéntica a tu captura */}
      <div className="subpage-header">
        <div>
          <span className="date-label">CASA MARTÍNEZ</span>
          <h2>Movimientos</h2>
          <p>Consulta qué cambió, quién lo hizo y cuándo.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Agregar producto</span>
        </button>
      </div>

      {/* Cuadrícula de 2 columnas */}
      <div className="two-col-grid">
        {movimientosFiltrados.map((mov) => (
          <div key={mov.id} className="item-card-row">
            <div className="item-left">
              {/* Avatar circular con iniciales igual al diseño */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#f3e3d3',
                  color: '#a86b3e',
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
