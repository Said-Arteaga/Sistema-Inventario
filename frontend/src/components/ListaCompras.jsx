import { useState } from 'react';
import { Plus, ChevronRight, Sparkles, Check } from 'lucide-react';

export function ListaCompras({ 
  busqueda = '', 
  listaCompras = [], 
  toggleCompra, 
  onAbrirModal, 
  productos = [], 
  onAgregarALista 
}) {
  const [idProductoSel, setIdProductoSel] = useState('');
  const [cantidadComprar, setCantidadComprar] = useState('1');
  const [agregando, setAgregando] = useState(false);

  const listaFiltrada = listaCompras.filter((item) =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const manejarAgregarRapido = async (e) => {
    e.preventDefault();
    if (!idProductoSel) return;
    setAgregando(true);
    try {
      await onAgregarALista(Number(idProductoSel), Number(cantidadComprar));
      setIdProductoSel('');
      setCantidadComprar('1');
    } finally {
      setAgregando(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="subpage-header">
        <div>
          <span className="date-label">MI HOGAR</span>
          <h2>Lista de compras</h2>
          <p>Mantén tu hogar abastecido sin comprar de más.</p>
        </div>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span>Nuevo producto</span>
        </button>
      </div>

      { }
      <form 
        onSubmit={manejarAgregarRapido} 
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          backgroundColor: '#ffffff',
          padding: '14px 18px',
          borderRadius: '14px',
          border: '1px solid #eceee9',
          flexWrap: 'wrap',
        }}
      >
        <select
          value={idProductoSel}
          onChange={(e) => setIdProductoSel(e.target.value)}
          required
          style={{
            flex: 2,
            minWidth: '200px',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #e5e7e3',
            backgroundColor: '#f7f8f6',
            fontSize: '0.9rem',
          }}
        >
          <option value="">Selecciona un producto de tu catálogo...</option>
          {productos.map((p) => (
            <option key={p.idProducto} value={p.idProducto}>
              {p.nombre} ({p.unidadMedida})
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          step="any"
          value={cantidadComprar}
          onChange={(e) => setCantidadComprar(e.target.value)}
          placeholder="Cantidad"
          required
          style={{
            width: '100px',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #e5e7e3',
            backgroundColor: '#f7f8f6',
            fontSize: '0.9rem',
          }}
        />

        <button type="submit" className="primary-btn" disabled={agregando}>
          <Plus size={16} />
          <span>{agregando ? 'Añadiendo...' : 'Añadir a lista'}</span>
        </button>
      </form>

      {listaFiltrada.length === 0 ? (
        <div className="item-card-row" style={{ justifyContent: 'center', padding: '32px', color: '#888' }}>
          Tu lista de compras está vacía. Selecciona un producto arriba para añadirlo.
        </div>
      ) : (
        <div className="two-col-grid">
          {listaFiltrada.map((item) => (
            <div 
              key={item.id} 
              className="item-card-row" 
              style={{ cursor: 'pointer' }}
              onClick={() => toggleCompra(item.id)}
            >
              <div className="item-left">
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
                  <small>{item.detalle} · Sincronizado en BD</small>
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
      )}

      <div className="local-mode-banner">
        <div className="banner-left">
          <Sparkles size={16} color="#3b5d44" />
          <span>
            <strong>Conectado al servidor</strong> · Los cambios en la lista se guardan para toda la familia.
          </span>
        </div>
        <ChevronRight size={16} color="#888" />
      </div>
    </div>
  );
}
