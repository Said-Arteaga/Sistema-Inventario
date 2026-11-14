import { Search, Bell, Plus, Menu } from 'lucide-react';

export function Header({ busqueda, setBusqueda, setMenuAbierto, onAbrirModal }) {
  return (
    <header className="top-header">
      <button 
        className="menu-toggle-btn" 
        onClick={() => setMenuAbierto(true)}
        aria-label="Abrir menú"
      >
        <Menu size={22} color="#1f2421" />
      </button>

      <div className="search-bar">
        <Search size={18} color="#888" />
        <input 
          type="text" 
          placeholder="Buscar en tu inventario..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <span className="shortcut-badge">⌘K</span>
      </div>

      <div className="header-actions">
        <button className="icon-btn" title="Notificaciones">
          <Bell size={18} color="#444" />
          <span className="notification-dot"></span>
        </button>
        <button className="primary-btn" onClick={onAbrirModal}>
          <Plus size={18} />
          <span className="btn-text">Agregar producto</span>
        </button>
      </div>
    </header>
  );
}
