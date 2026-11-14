import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Inventario } from './components/Inventario';
import { Categorias } from './components/Categorias';
import { Caducidades } from './components/Caducidades';
import { ListaCompras } from './components/ListaCompras';
import { Movimientos } from './components/Movimientos';
import { Reportes } from './components/Reportes';
import { AgregarProducto } from './components/AgregarProducto';
import { 
  Package, Clock, ShoppingCart, BarChart2, 
  CheckCircle2, ArrowRight, ChevronRight, Sparkles, Plus 
} from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [listaCompras, setListaCompras] = useState([
    { id: 1, nombre: 'Leche entera', detalle: '2 litros', comprado: false },
    { id: 2, nombre: 'Huevos', detalle: '12 unidades', comprado: false },
    { id: 3, nombre: 'Arroz integral', detalle: '1 kg', comprado: true },
    { id: 4, nombre: 'Aceite de oliva', detalle: '1 botella', comprado: false },
  ]);

  const toggleCompra = (id) => {
    setListaCompras(listaCompras.map(item => 
      item.id === id ? { ...item, comprado: !item.comprado } : item
    ));
  };

  const consumoSemanal = [
    { dia: 'Lun', valor: 55, destacado: false },
    { dia: 'Mar', valor: 70, destacado: false },
    { dia: 'Mié', valor: 60, destacado: false },
    { dia: 'Jue', valor: 85, destacado: false },
    { dia: 'Vie', valor: 75, destacado: false },
    { dia: 'Sáb', valor: 95, destacado: true },
    { dia: 'Dom', valor: 65, destacado: false },
  ];

  const abrirModal = () => setModalAbierto(true);

  return (
    <div className="app-layout">
      {menuAbierto && (
        <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)} />
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(id) => {
          setActiveTab(id);
          setMenuAbierto(false);
        }} 
        menuAbierto={menuAbierto}
      />

      <main className="main-content">
        <Header 
          busqueda={busqueda} 
          setBusqueda={setBusqueda} 
          setMenuAbierto={setMenuAbierto}
          onAbrirModal={abrirModal}
        />

        {activeTab === 'inicio' && (
          <div className="dashboard-container">
            <div className="greeting-section">
              <div>
                <span className="date-label">MARTES, 18 DE JUNIO</span>
                <h2>Buenos días, Lucía.</h2>
                <p>Esto es lo que está pasando en tu hogar hoy.</p>
              </div>
              <div className="status-pill">
                <div>
                  <small>Semana 25</small>
                  <strong>Todo bajo control</strong>
                </div>
                <CheckCircle2 size={20} color="#3b5d44" />
              </div>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card" onClick={() => setActiveTab('inventario')} style={{ cursor: 'pointer' }}>
                <div className="kpi-top">
                  <span>PRODUCTOS EN CASA</span>
                  <ArrowRight size={14} color="#888" />
                </div>
                <div className="kpi-body">
                  <div className="kpi-icon green"><Package size={20} /></div>
                  <div>
                    <h3>86</h3>
                    <small className="text-green">+4 esta semana</small>
                  </div>
                </div>
              </div>

              <div className="kpi-card" onClick={() => setActiveTab('caducidades')} style={{ cursor: 'pointer' }}>
                <div className="kpi-top">
                  <span>POR CADUCAR</span>
                  <ArrowRight size={14} color="#888" />
                </div>
                <div className="kpi-body">
                  <div className="kpi-icon orange"><Clock size={20} /></div>
                  <div>
                    <h3>3</h3>
                    <small>En los próximos 7 días</small>
                  </div>
                </div>
              </div>

              <div className="kpi-card" onClick={() => setActiveTab('compras')} style={{ cursor: 'pointer' }}>
                <div className="kpi-top">
                  <span>EN LISTA DE COMPRAS</span>
                  <ArrowRight size={14} color="#888" />
                </div>
                <div className="kpi-body">
                  <div className="kpi-icon brown"><ShoppingCart size={20} /></div>
                  <div>
                    <h3>{listaCompras.filter(i => !i.comprado).length}</h3>
                    <small>Productos pendientes</small>
                  </div>
                </div>
              </div>

              <div className="kpi-card" onClick={() => setActiveTab('reportes')} style={{ cursor: 'pointer' }}>
                <div className="kpi-top">
                  <span>GASTO ESTE MES</span>
                  <ArrowRight size={14} color="#888" />
                </div>
                <div className="kpi-body">
                  <div className="kpi-icon gray"><BarChart2 size={20} /></div>
                  <div>
                    <h3>$2,840</h3>
                    <small className="text-green">-12% vs. mes anterior</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="middle-grid">
              <div className="panel-card">
                <div>
                  <div className="panel-header">
                    <div className="panel-title">
                      <div className="kpi-icon orange"><Clock size={18} /></div>
                      <div>
                        <h4>Próximos a caducar</h4>
                        <small>Consume estos productos pronto</small>
                      </div>
                    </div>
                    <button className="link-btn" onClick={() => setActiveTab('caducidades')}>
                      Ver todos <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="expiry-list">
                    <div className="expiry-item">
                      <div className="item-left">
                        <span className="food-emoji">🥛</span>
                        <div>
                          <strong>Yogur natural</strong>
                          <small>Refrigerador · 4 unidades</small>
                        </div>
                      </div>
                      <div className="item-right">
                        <small>CADUCA EN</small>
                        <strong className="text-orange">2 días</strong>
                      </div>
                      <ChevronRight size={16} color="#ccc" />
                    </div>

                    <div className="expiry-item">
                      <div className="item-left">
                        <span className="food-emoji">🥬</span>
                        <div>
                          <strong>Espinacas</strong>
                          <small>Refrigerador · 250 g</small>
                        </div>
                      </div>
                      <div className="item-right">
                        <small>CADUCA EN</small>
                        <strong className="text-olive">3 días</strong>
                      </div>
                      <ChevronRight size={16} color="#ccc" />
                    </div>

                    <div className="expiry-item">
                      <div className="item-left">
                        <span className="food-emoji">🍗</span>
                        <div>
                          <strong>Pechuga de pollo</strong>
                          <small>Congelador · 600 g</small>
                        </div>
                      </div>
                      <div className="item-right">
                        <small>CADUCA EN</small>
                        <strong className="text-brown">5 días</strong>
                      </div>
                      <ChevronRight size={16} color="#ccc" />
                    </div>
                  </div>
                </div>

                <div className="suggestion-box">
                  <Sparkles size={16} color="#3b5d44" />
                  <div className="suggestion-text">
                    <strong>Sugerencia para hoy</strong>
                    <small>Prepara un bowl de pollo, espinacas y yogur. Usarías 3 productos próximos a caducar.</small>
                  </div>
                  <button className="link-btn" onClick={() => alert('Receta: Bowl saludable de pollo, espinacas y aderezo de yogur.')}>
                    Ver receta
                  </button>
                </div>
              </div>

              <div className="panel-card">
                <div>
                  <div className="panel-header">
                    <div className="panel-title">
                      <div className="kpi-icon brown"><ShoppingCart size={18} /></div>
                      <div>
                        <h4>Lista de compras</h4>
                        <small>{listaCompras.filter(i => !i.comprado).length} productos pendientes</small>
                      </div>
                    </div>
                    <button className="link-btn" onClick={() => setActiveTab('compras')}>
                      Ver lista <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="shopping-list">
                    {listaCompras.map((item) => (
                      <div 
                        key={item.id} 
                        className={`shopping-item ${item.comprado ? 'checked' : ''}`}
                        onClick={() => toggleCompra(item.id)}
                      >
                        <input type="checkbox" checked={item.comprado} readOnly />
                        <div>
                          <strong>{item.nombre}</strong>
                          <small>{item.detalle}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="quick-add-btn" onClick={abrirModal}>
                  <Plus size={16} /> Agregar rápidamente
                </button>
              </div>
            </div>

            <div className="panel-card chart-section">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="kpi-icon green"><BarChart2 size={18} /></div>
                  <div>
                    <h4>Consumo semanal</h4>
                    <small>Productos utilizados por día</small>
                  </div>
                </div>
                <button className="link-btn" onClick={() => setActiveTab('reportes')}>
                  Reporte completo <ArrowRight size={14} />
                </button>
              </div>

              <div className="bar-chart">
                {consumoSemanal.map((dato) => (
                  <div key={dato.dia} className="bar-column">
                    <div className="bar-track">
                      <div 
                        className={`bar-fill ${dato.destacado ? 'orange' : 'green'}`}
                        style={{ height: `${dato.valor}%` }}
                      ></div>
                    </div>
                    <span>{dato.dia}</span>
                  </div>
                ))}
              </div>

              <div className="chart-footer">
                <div className="chart-stats">
                  <div>
                    <small>Esta semana</small>
                    <strong>43 productos</strong>
                  </div>
                  <div>
                    <small>Promedio diario</small>
                    <strong>6.1 productos</strong>
                  </div>
                </div>
                <span className="text-green">↗ 8% más consumo</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventario' && (
          <Inventario busqueda={busqueda} onAbrirModal={abrirModal} />
        )}

        {activeTab === 'categorias' && (
          <Categorias busqueda={busqueda} onAbrirModal={abrirModal} />
        )}

        {activeTab === 'caducidades' && (
          <Caducidades busqueda={busqueda} onAbrirModal={abrirModal} />
        )}

        {activeTab === 'compras' && (
          <ListaCompras 
            busqueda={busqueda}
            listaCompras={listaCompras}
            toggleCompra={toggleCompra}
            onAbrirModal={abrirModal}
          />
        )}

        {activeTab === 'movimientos' && (
          <Movimientos busqueda={busqueda} onAbrirModal={abrirModal} />
        )}

        {activeTab === 'reportes' && (
          <Reportes busqueda={busqueda} onAbrirModal={abrirModal} />
        )}

      </main>

      <AgregarProducto 
        abierto={modalAbierto} 
        onCerrar={() => setModalAbierto(false)} 
        onGuardar={(nuevoProducto) => {
          console.log('Producto guardado:', nuevoProducto);
        }}
      />
    </div>
  );
}
