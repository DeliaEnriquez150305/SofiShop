// Script temporal para probar la carga desde backend
async function obtenerPedidosBackend() {
  try {
    const response = await fetch('mongodb+srv://deliaenriquez_db_user:admin123@sofi.5a5opzn.mongodb.net/');
    if (!response.ok) throw new Error('Error al obtener pedidos');
    const pedidos = await response.json();
    console.log('Pedidos del backend:', pedidos);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    return pedidos;
  } catch (error) {
    console.log('Backend no disponible, usando localStorage:', error.message);
    return JSON.parse(localStorage.getItem('pedidos')) || [];
  }
}
