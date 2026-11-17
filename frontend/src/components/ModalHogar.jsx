import { useEffect, useState } from 'react';
import { X, Users, Copy, Check } from 'lucide-react';
import { obtenerMiembrosFamilia } from '../services/api';

export function ModalHogar({ abierto, onCerrar, usuario }) {
  const [miembros, setMiembros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (abierto && usuario?.idFamilia) {
      setCargando(true);
      obtenerMiembrosFamilia(usuario.idFamilia)
        .then((datos) => setMiembros(datos))
        .catch((err) => console.error('Error cargando miembros:', err))
        .finally(() => setCargando(false));
    }
  }, [abierto, usuario]);

  if (!abierto) return null;

  const nombreHogar = usuario?.familia?.nombre || 'Mi Hogar';
  const codigoHogar = usuario?.idFamilia || 1;

  const copiarCodigo = () => {
    navigator.clipboard.writeText(String(codigoHogar));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const obtenerIniciales = (nombre = 'U') => {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.slice(0, 2).toUpperCase();
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
          maxWidth: '460px',
          padding: '28px 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <span className="date-label" style={{ display: 'block', marginBottom: '4px' }}>
              DETALLES DEL HOGAR
            </span>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1f2421' }}>{nombreHogar}</h2>
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

        { }
        <div style={{
          backgroundColor: '#f4f7f5',
          border: '1px solid #dce5de',
          borderRadius: '14px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <div>
            <small style={{ color: '#5c6b60', fontWeight: '600', display: 'block', fontSize: '0.75rem' }}>
              CÓDIGO DE INVITACIÓN
            </small>
            <strong style={{ fontSize: '1.25rem', color: '#3b5d44' }}>#{codigoHogar}</strong>
            <small style={{ display: 'block', color: '#666', fontSize: '0.78rem' }}>
              Compártelo para que otros se unan a este hogar
            </small>
          </div>
          <button
            type="button"
            onClick={copiarCodigo}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #d5dfd7',
              borderRadius: '10px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#3b5d44',
              cursor: 'pointer',
            }}
          >
            {copiado ? <Check size={15} /> : <Copy size={15} />}
            <span>{copiado ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        { }
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: '#3a403c', fontSize: '0.85rem', fontWeight: '600' }}>
          <Users size={16} color="#3b5d44" />
          <span>Integrantes registrados ({miembros.length})</span>
        </div>

        {cargando ? (
          <p style={{ color: '#888', fontSize: '0.88rem', textAlign: 'center', padding: '16px' }}>Cargando integrantes...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
            {miembros.map((m) => (
              <div
                key={m.idUsuario}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #eceee9',
                  backgroundColor: '#fafbfa',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#e6efe8',
                    color: '#3b5d44',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                  }}>
                    {obtenerIniciales(m.nombre)}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1f2421' }}>{m.nombre}</strong>
                    <small style={{ color: '#888', fontSize: '0.78rem' }}>{m.correo}</small>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: m.rol === 'Administrador' ? '#e6efe8' : '#f3e3d3',
                  color: m.rol === 'Administrador' ? '#3b5d44' : '#a86b3e',
                }}>
                  {m.rol}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
