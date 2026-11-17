const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const manejarRespuesta = async (res, mensajePorDefecto) => {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.reload();
    throw new Error('Tu sesión ha expirado. Inicia sesión nuevamente.');
  }

  const data = await res.json();
  if (!res.ok) {
    const detalleError = data.errores ? data.errores.map(e => e.msg).join(', ') : data.mensaje;
    throw new Error(detalleError || mensajePorDefecto);
  }
  return data;
};

export const loginUsuario = async (correo, contrasenia) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasenia }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al iniciar sesión');
  return data;
};

export const registrarUsuario = async (datos) => {
  const res = await fetch(`${API_URL}/auth/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  const data = await res.json();
  if (!res.ok) {
    const detalleError = data.errores ? data.errores.map(e => e.msg).join(', ') : data.mensaje;
    throw new Error(detalleError || 'Error al registrar');
  }
  return data;
};

export const obtenerStockFamilia = async (idFamilia) => {
  const res = await fetch(`${API_URL}/inventario/familia/${idFamilia}/stock`, {
    headers: getHeaders(),
  });
  return manejarRespuesta(res, 'Error al obtener stock');
};

export const agregarProductoBackend = async (productoData) => {
  const res = await fetch(`${API_URL}/inventario/producto`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(productoData),
  });
  return manejarRespuesta(res, 'Error al guardar producto');
};

export const consumirProductoBackend = async (idProducto, idUsuario, cantidadConsumida = 1) => {
  const res = await fetch(`${API_URL}/inventario/consumir`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ idProducto, idUsuario, cantidadConsumida }),
  });
  return manejarRespuesta(res, 'Error al registrar consumo');
};

export const obtenerListaFamilia = async (idFamilia) => {
  const res = await fetch(`${API_URL}/compras/familia/${idFamilia}`, {
    headers: getHeaders(),
  });
  return manejarRespuesta(res, 'Error al obtener la lista de compras');
};

export const agregarArticuloListaBackend = async (datos) => {
  const res = await fetch(`${API_URL}/compras/articulo`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return manejarRespuesta(res, 'Error al agregar artículo a la lista');
};

export const toggleArticuloListaBackend = async (idDetalle) => {
  const res = await fetch(`${API_URL}/compras/articulo/${idDetalle}/toggle`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  return manejarRespuesta(res, 'Error al actualizar artículo');
};

export const obtenerMovimientosFamilia = async (idFamilia) => {
  const res = await fetch(`${API_URL}/inventario/familia/${idFamilia}/movimientos`, {
    headers: getHeaders(),
  });
  return manejarRespuesta(res, 'Error al obtener movimientos');
};

export const obtenerMiembrosFamilia = async (idFamilia) => {
  const res = await fetch(`${API_URL}/auth/familia/${idFamilia}/miembros`, {
    headers: getHeaders(),
  });
  return manejarRespuesta(res, 'Error al obtener integrantes del hogar');
};