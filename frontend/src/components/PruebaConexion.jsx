import { useEffect, useState } from 'react';

function App() {
  // 1. Creamos un estado para guardar el mensaje que venga del servidor
  const [mensajeServidor, setMensajeServidor] = useState('Cargando mensaje...');

  // 2. El useEffect ejecuta esta función automáticamente cuando abre la página
  useEffect(() => {
    // Hacemos la petición (fetch) a la URL de tu Express
    fetch('http://localhost:5000/api/saludo')
      .then((respuesta) => respuesta.json()) // Traducimos la respuesta a formato JSON
      .then((datos) => {
        // Guardamos el texto en nuestro estado
        setMensajeServidor(datos.mensaje);
      })
      .catch((error) => {
        console.error('Error al conectar con Express:', error);
        setMensajeServidor('No se pudo conectar con el servidor backend.');
      });
  }, []);

  // 3. Renderizamos el resultado en la pantalla
  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00D8FF' }}>Mi Sistema de Inventario</h1>
      <p style={{ fontSize: '1.2rem' }}>Respuesta en tiempo real desde el Backend:</p>
      
      {/* Aquí se mostrará el texto dinámico de Express */}
      <h2 style={{ background: '#f0f0f0', display: 'inline-block', padding: '15px 30px', borderRadius: '8px', color: '#333' }}>
        {mensajeServidor}
      </h2>
    </div>
  );
}

export default App;
