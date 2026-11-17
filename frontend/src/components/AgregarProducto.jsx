import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { agregarProductoBackend } from '../services/api';

export function AgregarProducto({ abierto, onCerrar, onGuardar, usuario }) {
  const [nombre, setNombre] = useState('');
  const [presentacion, setPresentacion] = useState('Paquete');
  const [categoria, setCategoria] = useState('Lácteos');
  const [cantidad, setCantidad] = useState('1');
  const [unidadMedida, setUnidadMedida] = useState('unidades');
  const [ubicacion, setUbicacion] = useState('Refrigerador');
  const [fechaCaducidad, setFechaCaducidad] = useState('');
  const [costo, setCosto] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  if (!abierto) return null;

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setError('');
    setGuardando(true);

    try {
      const fechaDefecto = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const payload = {
        idFamilia: usuario.idFamilia,
        idUsuario: usuario.idUsuario,
        nombre: nombre.trim(),
        presentacion: presentacion.trim() || 'Estándar',
        unidadMedida,
        categoria,
        ubicacion,
        fechaCaducidad: fechaCaducidad || fechaDefecto,
        cantidad: Number(cantidad),
        costo: Number(costo) || 0,
      };

      const respuesta = await agregarProductoBackend(payload);

      if (onGuardar) onGuardar(respuesta.producto);

      setNombre('');
      setPresentacion('Paquete');
      setCantidad('1');
      setFechaCaducidad('');
      setCosto('');
      onCerrar();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 24, 21, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '480px',
          padding: '28px 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <span className="date-label" style={{ display: 'block', marginBottom: '4px' }}>
              NUEVO REGISTRO
            </span>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2421' }}>Agregar producto</h2>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            style={{
              backgroundColor: '#f4f5f3',
              border: 'none',
              borderRadius: '10px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#555',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fdecea',
            color: '#b71c1c',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '14px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Nombre del producto</label>
            <input
              type="text"
              placeholder="Ej. Leche entera"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoFocus
              style={{ ...inputStyle, border: '1.5px solid #3b5d44', backgroundColor: '#ffffff' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Categoría</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={inputStyle}>
                <option value="Frutas y verduras">Frutas y verduras</option>
                <option value="Lácteos">Lácteos</option>
                <option value="Carnes">Carnes</option>
                <option value="Despensa">Despensa</option>
                <option value="Limpieza">Limpieza</option>
                <option value="Cuidado personal">Cuidado personal</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Presentación</label>
              <input
                type="text"
                placeholder="Ej. Botella, Caja, Bolsa"
                value={presentacion}
                onChange={(e) => setPresentacion(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Cantidad</label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Unidad</label>
              <select value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)} style={inputStyle}>
                <option value="unidades">unidades</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="litros">litros</option>
                <option value="paquetes">paquetes</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Ubicación</label>
            <select value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} style={inputStyle}>
              <option value="Refrigerador">Refrigerador</option>
              <option value="Alacena">Alacena</option>
              <option value="Congelador">Congelador</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Fecha de caducidad</label>
              <input
                type="date"
                value={fechaCaducidad}
                onChange={(e) => setFechaCaducidad(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Precio ($)</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={guardando}
            style={{
              marginTop: '6px',
              backgroundColor: '#486851',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '0.95rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <span>{guardando ? 'Guardando en BD...' : 'Guardar producto'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: '600',
  color: '#3a403c',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1px solid #e5e7e3',
  backgroundColor: '#f7f8f6',
  fontSize: '0.9rem',
  color: '#1f2421',
  outline: 'none',
  boxSizing: 'border-box',
};
