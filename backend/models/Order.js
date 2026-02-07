// ============================================
// MODELO DE PEDIDO
// ============================================
// Define la estructura de los pedidos realizados por los clientes

const mongoose = require('mongoose');

// Schema del pedido con todos sus campos
const OrderSchema = new mongoose.Schema({
  id: String,
  cliente: String,
  email: String,
  telefono: String,
  productos: Array,
  total: Number,
  direccion: {
    callePrincipal: String,
    calleSecundaria: String,
    ciudad: String,
    provincia: String,
    referencia: String,
    telefono: String,
    latitud: Number,
    longitud: Number,
    completa: String
  },
  estado: {
    type: String,
    default: 'pendiente',
    enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado', 'pagado']
  },
  pago: {
    metodo: String, // 'payphone', 'efectivo', etc
    estado: {
      type: String,
      enum: ['pendiente', 'procesando', 'completado', 'fallido'],
      default: 'pendiente'
    },
    idTransaccion: String,
    fechaPago: Date,
    referencia: String
  },
  factura: {
    generada: { type: Boolean, default: false },
    numero: String,
    fechaGeneracion: Date,
    url: String
  },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
