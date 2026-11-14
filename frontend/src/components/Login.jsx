import { useState } from 'react';
import { loginUsuario, registrarUsuario } from '../services/api';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Login({ onLoginExitoso }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [unirseAHogar, setUnirseAHogar] = useState(false);
  const [nombreFamilia, setNombreFamilia] = useState('');
  const [idFamilia, setIdFamilia] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (esRegistro) {
        const datosRegistro = unirseAHogar
          ? { idFamilia: Number(idFamilia), nombreUsuario, correo, contrasenia }
          : { nombreFamilia, nombreUsuario, correo, contrasenia };

        await registrarUsuario(datosRegistro);
      }
      const data = await loginUsuario(correo, contrasenia);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      onLoginExitoso(data.usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f6f7f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '36px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={20} color="#3b5d44" />
          <span className="date-label" style={{ margin: 0 }}>ALACENA HOGAR</span>
        </div>

        <h2 style={{ margin: '0 0 6px 0', color: '#1f2421' }}>
          {esRegistro ? (unirseAHogar ? 'Únete a un hogar' : 'Crea tu hogar') : 'Bienvenido de nuevo'}
        </h2>
        <p style={{ margin: '0 0 20px 0', color: '#666', fontSize: '0.9rem' }}>
          {esRegistro
            ? (unirseAHogar
                ? 'Ingresa el código numérico que te compartió el administrador de tu casa.'
                : 'Registra tu familia para gestionar el inventario compartido.')
            : 'Inicia sesión para sincronizar tus productos con el servidor.'}
        </p>

        {esRegistro && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            backgroundColor: '#f4f5f3',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '18px',
          }}>
            <button
              type="button"
              onClick={() => { setUnirseAHogar(false); setError(''); }}
              style={{
                padding: '8px',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: !unirseAHogar ? '#ffffff' : 'transparent',
                color: !unirseAHogar ? '#1f2421' : '#666',
                boxShadow: !unirseAHogar ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Crear hogar nuevo
            </button>
            <button
              type="button"
              onClick={() => { setUnirseAHogar(true); setError(''); }}
              style={{
                padding: '8px',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: unirseAHogar ? '#ffffff' : 'transparent',
                color: unirseAHogar ? '#1f2421' : '#666',
                boxShadow: unirseAHogar ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Unirme a un hogar
            </button>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fdecea',
            color: '#b71c1c',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={manejarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {esRegistro && (
            <>
              {unirseAHogar ? (
                <div>
                  <label style={labelStyle}>Código de hogar (ID)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej. 1"
                    value={idFamilia}
                    onChange={(e) => setIdFamilia(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>Nombre de la familia / hogar</label>
                  <input
                    type="text"
                    placeholder="Ej. Casa Arteaga"
                    value={nombreFamilia}
                    onChange={(e) => setNombreFamilia(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
              )}

              <div>
                <label style={labelStyle}>Tu nombre</label>
                <input
                  type="text"
                  placeholder="Ej. Ana"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Correo electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
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
            <span>{cargando ? 'Conectando...' : esRegistro ? 'Registrar y entrar' : 'Iniciar sesión'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
          {esRegistro ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
          <button
            type="button"
            onClick={() => { setEsRegistro(!esRegistro); setError(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b5d44',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {esRegistro ? 'Inicia sesión' : 'Registra tu hogar o únete'}
          </button>
        </div>
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
