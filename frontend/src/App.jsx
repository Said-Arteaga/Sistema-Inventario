import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Inventario } from './components/Inventario';
import { Categorias } from './components/Categorias';
import { Caducidades } from './components/Caducidades';
import { ListaCompras } from './components/ListaCompras';
import { Movimientos } from './components/Movimientos';
import { Reportes } from './components/Reportes';
import { AgregarProducto } from './components/AgregarProducto';
import { Login } from './components/Login';
import { ModalHogar } from './components/ModalHogar';

import { 
  obtenerStockFamilia, 
  obtenerListaFamilia, 
  agregarArticuloListaBackend, 
  toggleArticuloListaBackend,
  obtenerMovimientosFamilia
} from './services/api';
import { 
  Package, Clock, ShoppingCart, BarChart2, 
  CheckCircle2, ArrowRight, ChevronRight, Sparkles, Plus 
} from 'lucide-react';
import './App.css';

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [productosCatalogo, setProductosCatalogo] = useState([]);
  const [productosReal, setProductosReal] = useState([]);
  const [movimientosReal, setMovimientosReal] = useState([]);
  const [idListaActiva, setIdListaActiva] = useState(null);
  const [listaCompras, setListaCompras] = useState([]);

  const [activeTab, setActiveTab] = useState('inicio');
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalHogarAbierto, setModalHogarAbierto] = useState(false);

  const cargarInventario = async () => {
    if (!usuario?.idFamilia) return;
    try {
      const datos = await obtenerStockFamilia(usuario.idFamilia);
      setProductosCatalogo(datos);
      const disponibles = datos.filter((prod) => {
        const cant = Number(prod.inventarios?.[0]?.detallesInventario?.[0]?.cantidad ?? 0);
        return cant > 0;
      });
      setProductosReal(disponibles);
    } catch (error) {
      console.error('Error cargando inventario:', error);
    }
  };

  const cargarListaCompras = async () => {
    if (!usuario?.idFamilia) return;
    try {
      const lista = await obtenerListaFamilia(usuario.idFamilia);
      setIdListaActiva(lista.idLista);
      const itemsFormateados = (lista.listaDetalles || []).map((det) => ({
        id: det.idListaDetalle,
        nombre: det.producto?.nombre || 'Producto',
        detalle: `${det.cantidad} ${det.producto?.unidadMedida || 'unidades'}`,
        comprado: det.estado === 'Comprado',
      }));
      setListaCompras(itemsFormateados);
    } catch (error) {
      console.error('Error cargando lista de compras:', error);
    }
  };

  const cargarMovimientos = async () => {
    if (!usuario?.idFamilia) return;
    try {
      const movs = await obtenerMovimientosFamilia(usuario.idFamilia);
      setMovimientosReal(movs);
    } catch (error) {
      console.error('Error cargando movimientos:', error);
    }
  };

  const recargarTodo = async () => {
    await Promise.all([cargarInventario(), cargarMovimientos()]);
  };

  useEffect(() => {
    if (usuario) {
      cargarInventario();
      cargarListaCompras();
      cargarMovimientos();
    }
  }, [usuario]);

  if (!usuario) {
    return <Login onLoginExitoso={(user) => setUsuario(user)} />;
  }

  const toggleCompra = async (idDetalle) => {
    try {
      await toggleArticuloListaBackend(idDetalle);
      await cargarListaCompras();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const agregarALista = async (idProducto, cantidad) => {
    if (!idListaActiva) return;
    try {
      await agregarArticuloListaBackend({
        idLista: idListaActiva,
        idProducto,
        precio: 0,
        cantidad,
      });
      await cargarListaCompras();
    } catch (error) {
      alert(error.message);
    }
  };

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

  const productosPorCaducar = productosReal
    .map((prod) => {
      const inv = prod.inventarios?.[0];
      const det = inv?.detallesInventario?.[0];
      if (!det?.fechaCaducidad) return null;

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const cad = new Date(det.fechaCaducidad + 'T00:00:00');
      const dias = Math.ceil((cad - hoy) / (1000 * 60 * 60 * 24));

      if (dias > 7) return null;

      return {
        id: prod.idProducto,
        emoji: obtenerEmoji(prod.categoria),
        nombre: prod.nombre,
        ubicacion: inv?.ubicacion || 'Alacena',
        cantidad: `${det.cantidad} ${prod.unidadMedida}`,
        dias,
        diasTexto: dias < 0 ? 'Caducado' : dias === 0 ? 'Hoy' : `${dias} días`,
        alerta: dias <= 2 ? 'orange' : dias <= 4 ? 'olive' : 'brown',
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.dias - b.dias);

  const gastoTotalMes = movimientosReal.reduce((acum, mov) => {
    return acum + Number(mov.costo || 0);
  }, 0);

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const ordenDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const conteoPorDia = { Lun: 0, Mar: 0, Mié: 0, Jue: 0, Vie: 0, Sáb: 0, Dom: 0 };

  movimientosReal.forEach((mov) => {
    if (mov.tipoMovimiento?.toLowerCase().includes('consumo') && mov.fechaMovimiento) {
      const fecha = new Date(mov.fechaMovimiento + 'T00:00:00');
      const diaNombre = diasSemana[fecha.getDay()];
      if (diaNombre) {
        conteoPorDia[diaNombre] += Number(mov.cantidadAfectada || 1);
      }
    }
  });

  const maxConsumo = Math.max(...Object.values(conteoPorDia), 1);
  const totalConsumidoSemana = Object.values(conteoPorDia).reduce((a, b) => a + b, 0);

  const consumoSemanal = ordenDias.map((dia) => {
    const cant = conteoPorDia[dia];
    const porcentaje = cant === 0 ? 8 : Math.min(100, Math.round((cant / maxConsumo) * 90) + 10);
    return {
      dia,
      valor: porcentaje,
      destacado: cant > 0 && cant === maxConsumo,
    };
  });

  const fechaHoyTexto = new Date()
    .toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase();

  const abrirModal = () => setModalAbierto(true);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setProductosReal([]);
    setListaCompras([]);
    setMovimientosReal([]);
  };
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
        usuario={usuario}
        onCerrarSesion={cerrarSesion}
        porCaducarCount={productosPorCaducar.length}
        onAbrirHogar={() => setModalHogarAbierto(true)}
      />

      <main className="main-content">
        <Header 
          busqueda={busqueda} 
          setBusqueda={setBusqueda} 
          setMenuAbierto={setMenuAbierto}
          onAbrirModal={abrirModal}
          porCaducarCount={productosPorCaducar.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {activeTab === 'inicio' && (
          <div className="dashboard-container">
            <div className="greeting-section">
              <div>
                <span className="date-label">{usuario.familia?.nombre?.toUpperCase() || fechaHoyTexto}</span>
                <h2>Buenos días, {usuario.nombre}.</h2>
                <p>Esto es lo que está pasando en tu hogar hoy.</p>
              </div>
              <div className="status-pill">
                <div>
                  <small>Sincronizado</small>
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
                    <h3>{productosReal.length}</h3>
                    <small className="text-green">En base de datos</small>
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
                    <h3>{productosPorCaducar.length}</h3>
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
                  <span>GASTO REGISTRADO</span>
                  <ArrowRight size={14} color="#888" />
                </div>
                <div className="kpi-body">
                  <div className="kpi-icon gray"><BarChart2 size={20} /></div>
                  <div>
                    <h3>${gastoTotalMes.toLocaleString('es-MX')}</h3>
                    <small className="text-green">Calculado del inventario</small>
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
                    {productosPorCaducar.length === 0 ? (
                      <div style={{ padding: '18px', textAlign: 'center', color: '#888', fontSize: '0.88rem' }}>
                        ¡Todo fresco! No tienes productos próximos a caducar en los siguientes 7 días.
                      </div>
                    ) : (
                      productosPorCaducar.slice(0, 3).map((item) => (
                        <div key={item.id} className="expiry-item">
                          <div className="item-left">
                            <span className="food-emoji">{item.emoji}</span>
                            <div>
                              <strong>{item.nombre}</strong>
                              <small>{item.ubicacion} · {item.cantidad}</small>
                            </div>
                          </div>
                          <div className="item-right">
                            <small>CADUCA EN</small>
                            <strong className={`text-${item.alerta}`}>{item.diasTexto}</strong>
                          </div>
                          <ChevronRight size={16} color="#ccc" />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="suggestion-box">
                  <Sparkles size={16} color="#3b5d44" />
                  <div className="suggestion-text">
                    <strong>Sugerencia para hoy</strong>
                    <small>
                      {productosPorCaducar.length > 0
                        ? `Aprovecha ${productosPorCaducar.slice(0, 2).map(p => p.nombre).join(' y ')} antes de que venzan.`
                        : 'Tu inventario está al día. Revisa tu lista de compras si necesitas reabastecer.'}
                    </small>
                  </div>
                  <button className="link-btn" onClick={() => setActiveTab('caducidades')}>
                    Revisar
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
                    {listaCompras.length === 0 ? (
                      <div style={{ padding: '18px', textAlign: 'center', color: '#888', fontSize: '0.88rem' }}>
                        No tienes artículos pendientes por comprar.
                      </div>
                    ) : (
                      listaCompras.slice(0, 4).map((item) => (
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
                      ))
                    )}
                  </div>
                </div>

                <button className="quick-add-btn" onClick={() => setActiveTab('compras')}>
                  <Plus size={16} /> Gestionar lista completa
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
                    <strong>{totalConsumidoSemana} productos</strong>
                  </div>
                  <div>
                    <small>Promedio diario</small>
                    <strong>{(totalConsumidoSemana / 7).toFixed(1)} productos</strong>
                  </div>
                </div>
                <span className="text-green">Sincronizado con movimientos</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventario' && (
          <Inventario 
            busqueda={busqueda} 
            onAbrirModal={abrirModal} 
            productos={productosReal}
            usuario={usuario}
            onRecargar={recargarTodo}
          />
        )}

        {activeTab === 'categorias' && (
          <Categorias 
            busqueda={busqueda} 
            onAbrirModal={abrirModal} 
            productos={productosReal} 
          />
        )}

        {activeTab === 'caducidades' && (
          <Caducidades 
            busqueda={busqueda} 
            onAbrirModal={abrirModal} 
            productos={productosReal} 
          />
        )}

        {activeTab === 'compras' && (
          <ListaCompras 
            busqueda={busqueda}
            listaCompras={listaCompras}
            toggleCompra={toggleCompra}
            onAbrirModal={abrirModal}
            productos={productosCatalogo}
            onAgregarALista={agregarALista}
          />
        )}

        {activeTab === 'movimientos' && (
          <Movimientos 
            busqueda={busqueda} 
            onAbrirModal={abrirModal} 
            movimientos={movimientosReal}
            usuario={usuario}
          />
        )}

        {activeTab === 'reportes' && (
          <Reportes 
            busqueda={busqueda} 
            onAbrirModal={abrirModal} 
            productos={productosReal}
            movimientos={movimientosReal} 
          />
        )}

      </main>

      <AgregarProducto 
        abierto={modalAbierto} 
        onCerrar={() => setModalAbierto(false)} 
        usuario={usuario}
        onGuardar={recargarTodo}
      />

      <ModalHogar 
        abierto={modalHogarAbierto} 
        onCerrar={() => setModalHogarAbierto(false)} 
        usuario={usuario} 
      />
    </div>
  );
}
