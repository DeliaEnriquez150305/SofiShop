const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/', async (req, res) => {
  try {
    const { productos = [] } = req.body;

    // Verificar stock antes de crear el pedido
    for (const item of productos) {
      const productoId = item._id || item.productId;
      const cantidad = Number(item.cantidad || item.qty || 1);
      if (!productoId) return res.status(400).json({ mensaje: 'Producto inválido en el pedido' });

      const productoDb = await Product.findById(productoId);
      if (!productoDb) return res.status(404).json({ mensaje: 'Producto no encontrado' });
      if (productoDb.stock < cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente para ${productoDb.nombre}` });
      }
    }

    // Descontar stock
    for (const item of productos) {
      const productoId = item._id || item.productId;
      const cantidad = Number(item.cantidad || item.qty || 1);
      await Product.findByIdAndUpdate(productoId, { $inc: { stock: -cantidad } });
    }

    const order = new Order(req.body);
    await order.save();
    res.json({ mensaje: 'Pedido registrado', pedido: order });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error registrando pedido', error: err.message });
  }
});

// Obtener pedidos de un usuario por email
router.get('/usuario/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    
    // Buscar por email O por cliente (nombre)
    const pedidos = await Order.find({ 
      $or: [
        { email: new RegExp('^' + email + '$', 'i') },
        { email: { $exists: false } } // También buscar pedidos sin email
      ]
    }).sort({ fecha: -1 });
    
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error obteniendo pedidos', error: err.message });
  }
});

// Obtener todos los pedidos (admin)
router.get('/', async (req, res) => {
  try {
    const pedidos = await Order.find().sort({ fecha: -1 });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error obteniendo pedidos', error: err.message });
  }
});



// Actualizar estado de un pedido
router.patch('/estado/:id', async (req, res) => {
  try {
    const { estado } = req.body;
    const pedido = await Order.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    res.json({ mensaje: 'Estado actualizado', pedido });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error actualizando estado', error: err.message });
  }
});

module.exports = router;


