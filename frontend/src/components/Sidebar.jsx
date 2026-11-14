import { 
  Home, Package, LayoutGrid, Clock, 
  ShoppingCart, ArrowLeftRight, BarChart2, ChevronRight, MoreHorizontal 
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, menuAbierto }) {
  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'inventario', label: 'Inventario', icon: Package },
    { id: 'categorias', label: 'Categorías', icon: LayoutGrid },
    { id: 'caducidades', label: 'Caducidades', icon: Clock, badge: 3 },
    { id: 'compras', label: 'Lista de compras', icon: ShoppingCart },
    { id: 'movimientos', label: 'Movimientos', icon: ArrowLeftRight },
    { id: 'reportes', label: 'Reportes', icon: BarChart2 },
  ];

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
        <div className="house-card">
          <div className="house-icon">
            <Home size={16} color="#3b5d44" />
          </div>
          <div className="house-info">
            <span className="house-label">HOGAR ACTUAL</span>
            <strong>Casa Martínez</strong>
            <small>4 miembros</small>
          </div>
          <ChevronRight size={16} color="#888" />
        </div>

        <div className="user-profile">
          <div className="avatar">LM</div>
          <div className="user-info">
            <strong>Lucía Martínez</strong>
            <small>Administradora</small>
          </div>
          <MoreHorizontal size={16} color="#888" />
        </div>
      </div>
    </aside>
  );
}
