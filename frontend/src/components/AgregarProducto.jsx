import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

export function AgregarProducto({ abierto, onCerrar, onGuardar }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [unidad, setUnidad] = useState('unidades');
  const [ubicacion, setUbicacion] = useState('Refrigerador');
  const [caducidad, setCaducidad] = useState('');
  const [precio, setPrecio] = useState('');

  if (!abierto) return null;

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const nuevoProducto = {
      id: Date.now(),
      emoji: '📦',
      nombre: nombre.trim(),
      cantidad: `${cantidad} ${unidad}`,
      ubicacion,
      caducidad,
      precio: precio ? `$${precio}` : '$0.00',
      estado: 'En buen estado',
      alerta: 'green',
    };

    if (onGuardar) onGuardar(nuevoProducto);

    // Limpiamos y cerramos
    setNombre('');
    setCantidad('1');
    setUnidad('unidades');
    setUbicacion('Refrigerador');
    setCaducidad('');
    setPrecio('');
    onCerrar();
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
        }}
      >
        {/* Cabecera del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
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

        {/* Formulario */}
        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Nombre del producto */}
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

          {/* Fila: Cantidad y Unidad */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Cantidad</label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Unidad</label>
              <select value={unidad} onChange={(e) => setUnidad(e.target.value)} style={inputStyle}>
                <option value="unidades">unidades</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="litros">litros</option>
                <option value="paquetes">paquetes</option>
              </select>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label style={labelStyle}>Ubicación</label>
            <select value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} style={inputStyle}>
              <option value="Refrigerador">Refrigerador</option>
              <option value="Alacena">Alacena</option>
              <option value="Congelador">Congelador</option>
            </select>
          </div>

          {/* Fila: Fecha de caducidad y Precio */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Fecha de caducidad</label>
              <input
                type="date"
                value={caducidad}
                onChange={(e) => setCaducidad(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Precio</label>
              <input
                type="text"
                placeholder="$ 0.00"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Botón Guardar */}
          <button
            type="submit"
            style={{
              marginTop: '8px',
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
            <span>Guardar producto</span>
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
