import { Search, Bell, Plus, Menu, X } from 'lucide-react';

export function Header({ 
  busqueda, 
  setBusqueda, 
  setMenuAbierto, 
  onAbrirModal, 
  porCaducarCount = 0,
  activeTab,
  setActiveTab
}) {
  const irAInventarioSiNecesario = () => {
    if (activeTab !== 'inventario' && setActiveTab) {
      setActiveTab('inventario');
    }
  };

  return (
    <header className="top-header">
      <button 
        className="menu-toggle-btn" 
        onClick={() => setMenuAbierto(true)}
        aria-label="Abrir menú"
      >
        <Menu size={22} color="#1f2421" />
      </button>

      <div className="search-bar" onClick={irAInventarioSiNecesario}>
        <Search size={18} color="#888" />
        <input 
          type="text" 
          placeholder="Buscar en tu inventario..." 
          value={busqueda}
          onFocus={irAInventarioSiNecesario}
          onChange={(e) => {
            irAInventarioSiNecesario();
            setBusqueda(e.target.value);
          }}
        />
        {busqueda && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setBusqueda('');
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              color: '#888',
            }}
            title="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="header-actions">
        <button 
          className="icon-btn" 
          title={porCaducarCount > 0 ? `${porCaducarCount} productos por caducar` : 'Sin alertas de caducidad'}
          onClick={() => setActiveTab && setActiveTab('caducidades')}
        >
          <Bell size={18} color="#444" />
          {porCaducarCount > 0 && <span className="notification-dot"></span>}
        </button>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span className="btn-text">Agregar producto</span>
        </button>
      </div>
    </header>
  );
}
