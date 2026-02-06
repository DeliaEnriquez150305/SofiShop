const router = require('express').Router();
const Order = require('../models/Order');
const payphoneService = require('../services/payphoneService');

// POST - Iniciar pago con PayPhone
router.post('/payphone/iniciar', async (req, res) => {
  try {
    const { orderId } = req.body;

    // Buscar la orden
    const orden = await Order.findById(orderId);
    if (!orden) {
      return res.status(404).json({ 
        exito: false,
        mensaje: 'Orden no encontrada' 
      });
    }

    // Crear transacción en PayPhone
    const transaccion = await payphoneService.crearTransaccion({
      monto: orden.total,
      referencia: orderId,
      descripcion: `Compra de ${orden.productos.length} producto(s)`,
      email: orden.email,
      cliente: orden.cliente,
      telefono: orden.telefono,
      urlRetorno: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/perfil?orderId=${orderId}`,
      urlNotificacion: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payments/webhook`
    });

    if (!transaccion.exito) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Error al iniciar pago',
        error: transaccion.error,
        detalle: transaccion.datos || null
      });
    }

    // Actualizar estado de la orden
    await Order.findByIdAndUpdate(orderId, {
      'pago.metodo': 'payphone',
      'pago.estado': 'procesando',
      'pago.idTransaccion': transaccion.datos.id || transaccion.datos.idTransaccion,
      'pago.referencia': transaccion.datos.referencia
    });

    const paymentUrl = extraerPaymentUrl(transaccion.datos);

    res.json({
      exito: true,
      mensaje: 'Pago iniciado correctamente',
      transaccion: transaccion.datos,
      paymentUrl
    });
  } catch (error) {
    console.error('Error iniciando pago:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error procesando pago',
      error: error.message
    });
  }
});

// POST - Webhook de confirmación de PayPhone
router.post('/webhook', async (req, res) => {
  try {
    const datos = req.body;

    console.log('Webhook recibido de PayPhone:', datos);

    // Validar que sea de PayPhone
    if (!datos.idTransaccion || !datos.monto) {
      return res.status(400).json({ 
        exito: false,
        mensaje: 'Datos incompletos' 
      });
    }

    // Buscar la orden por referencia
    const orden = await Order.findById(datos.referencia || datos.orderId);
    if (!orden) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Orden no encontrada'
      });
    }

    // Determinar estado del pago según PayPhone
    let estadoPago = 'fallido';
    if (datos.estado === 'completado' || datos.estado === 'COMPLETADO' || datos.codigo === 'OK') {
      estadoPago = 'completado';
    }

    // Actualizar la orden con info de pago
    const ordenActualizada = await Order.findByIdAndUpdate(
      orden._id,
      {
        'pago.estado': estadoPago,
        'pago.fechaPago': new Date(),
        'pago.idTransaccion': datos.idTransaccion,
        estado: estadoPago === 'completado' ? 'pagado' : 'pendiente'
      },
      { new: true }
    );

    // Si el pago se completó, generar factura
    if (estadoPago === 'completado') {
      generarFactura(ordenActualizada);
    }

    // Responder a PayPhone que se procesó
    res.json({
      exito: true,
      mensaje: 'Webhook procesado',
      estado: ordenActualizada.pago.estado
    });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error procesando webhook',
      error: error.message
    });
  }
});

// GET - Verificar estado del pago
router.get('/estado/:orderId', async (req, res) => {
  try {
    const orden = await Order.findById(req.params.orderId);
    if (!orden) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Orden no encontrada'
      });
    }

    // Si hay ID de transacción, verificar en PayPhone
    if (orden.pago?.idTransaccion) {
      const verificacion = await payphoneService.verificarTransaccion(
        orden.pago.idTransaccion
      );

      if (verificacion.exito) {
        // Actualizar estado si cambió
        if (verificacion.datos.estado !== orden.pago.estado) {
          await Order.findByIdAndUpdate(orden._id, {
            'pago.estado': verificacion.datos.estado,
            estado: verificacion.datos.estado === 'completado' ? 'pagado' : orden.estado
          });
        }
      }
    }

    const ordenActual = await Order.findById(req.params.orderId);
    res.json({
      exito: true,
      pago: ordenActual.pago,
      factura: ordenActual.factura,
      estado: ordenActual.estado
    });
  } catch (error) {
    console.error('Error verificando estado:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error verificando pago',
      error: error.message
    });
  }
});

// Función auxiliar para generar factura (simulada)
function generarFactura(orden) {
  try {
    const fecha = new Date();
    const numero = `FC-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${orden._id.toString().slice(-6).toUpperCase()}`;
    
    // Aquí guardarías la factura en base de datos o file system
    // Por ahora solo actualizamos el modelo
    Order.findByIdAndUpdate(orden._id, {
      'factura.generada': true,
      'factura.numero': numero,
      'factura.fechaGeneracion': fecha,
      'factura.url': `/api/orders/factura/${orden._id}`
    }).catch(err => console.error('Error generando factura:', err));

    console.log(`Factura generada: ${numero}`);
  } catch (error) {
    console.error('Error en generarFactura:', error);
  }
}

module.exports = router;

function extraerPaymentUrl(datos) {
  if (!datos) return null;

  const candidatos = [
    datos.url,
    datos.link,
    datos.paymentUrl,
    datos.redirectUrl,
    datos.urlPago,
    datos.urlPayment,
    datos.enlace,
    datos.enlaceFormulario,
    datos.formUrl,
    datos.checkoutUrl
  ];

  const directo = candidatos.find((v) => typeof v === 'string' && v.startsWith('http'));
  if (directo) return directo;

  if (datos.data) {
    const internos = [
      datos.data.url,
      datos.data.link,
      datos.data.paymentUrl,
      datos.data.redirectUrl,
      datos.data.enlaceFormulario
    ];
    return internos.find((v) => typeof v === 'string' && v.startsWith('http')) || null;
  }

  return null;
}
