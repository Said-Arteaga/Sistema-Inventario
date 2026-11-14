import { 
  Home, Package, LayoutGrid, Clock, 
  ShoppingCart, ArrowLeftRight, BarChart2, ChevronRight, LogOut 
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, menuAbierto, usuario, onCerrarSesion, porCaducarCount = 0, onAbrirHogar }) {
  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'inventario', label: 'Inventario', icon: Package },
    { id: 'categorias', label: 'Categorías', icon: LayoutGrid },
    { id: 'caducidades', label: 'Caducidades', icon: Clock, badge: porCaducarCount > 0 ? porCaducarCount : null },
    { id: 'compras', label: 'Lista de compras', icon: ShoppingCart },
    { id: 'movimientos', label: 'Movimientos', icon: ArrowLeftRight },
    { id: 'reportes', label: 'Reportes', icon: BarChart2 },
  ];

  const obtenerIniciales = (nombre = 'U') => {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.slice(0, 2).toUpperCase();
  };

  const nombreHogar = usuario?.familia?.nombre || 'Mi Hogar';
  const nombreUsuario = usuario?.nombre || 'Usuario';
  const rolUsuario = usuario?.rol || 'Administrador';

  return (
    <aside className={`sidebar ${menuAbierto ? 'open' : ''}`}>
      <div>
        <div className="logo-container">
          <div className="logo-icon">
            <BarChart2 size={24} color="#3b5d44" />
          </div>
          <div>
            <h1 className="logo-title">Alacena</h1>
            <p className="logo-subtitle">Inventario del hogar</p>
          </div>
        </div>

        <p className="menu-section-title">MI HOGAR</p>
        <nav className="nav-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="nav-item-left">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div 
          className="house-card" 
          onClick={onAbrirHogar} 
          style={{ cursor: 'pointer' }} 
          title="Ver integrantes del hogar"
        >
          <div className="house-icon">
            <Home size={16} color="#3b5d44" />
          </div>
          <div className="house-info">
            <span className="house-label">HOGAR ACTUAL</span>
            <strong>{nombreHogar}</strong>
            <small>Código de hogar: #{usuario?.idFamilia || 1}</small>
          </div>
          <ChevronRight size={16} color="#888" />
        </div>

        <div 
          className="user-profile" 
          onClick={onCerrarSesion} 
          title="Cerrar sesión"
          style={{ cursor: 'pointer' }}
        >
          <div className="avatar">{obtenerIniciales(nombreUsuario)}</div>
          <div className="user-info">
            <strong>{nombreUsuario}</strong>
            <small>{rolUsuario}</small>
          </div>
          <LogOut size={16} color="#b71c1c" />
        </div>
      </div>
    </aside>
  );
}
