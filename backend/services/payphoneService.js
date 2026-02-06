const axios = require('axios');
const payphone = require('../config/payphone');

// Servicio para procesar pagos con PayPhone
const payphoneService = {
  
  // Crear una transacción de pago
  async crearTransaccion(datos) {
    try {
      const payload = {
        appId: payphone.appId,
        token: payphone.token,
        comercioId: payphone.comercioId,
        monto: datos.monto,
        referencia: datos.referencia, // ID del pedido
        descripcion: datos.descripcion || 'Compra en SofiShop',
        correoComprador: datos.email,
        nombreComprador: datos.cliente,
        telefonoComprador: datos.telefono,
        urlRetorno: datos.urlRetorno || 'http://localhost:3000/api/payments/callback',
        urlNotificacion: datos.urlNotificacion || 'http://localhost:3000/api/payments/webhook'
      };

      const response = await axios.post(
        `${payphone.apiUrl}/transacciones`,
        payload,
        {
          timeout: payphone.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        exito: true,
        datos: response.data
      };
    } catch (error) {
      console.error('Error al crear transacción PayPhone:', error.message);
      return {
        exito: false,
        error: error.message,
        datos: error.response?.data || null
      };
    }
  },

  // Verificar estado de una transacción
  async verificarTransaccion(idTransaccion) {
    try {
      const response = await axios.get(
        `${payphone.apiUrl}/transacciones/${idTransaccion}`,
        {
          params: {
            appId: payphone.appId,
            token: payphone.token
          },
          timeout: payphone.timeout
        }
      );

      return {
        exito: true,
        datos: response.data
      };
    } catch (error) {
      console.error('Error al verificar transacción:', error.message);
      return {
        exito: false,
        error: error.message
      };
    }
  },

  // Validar webhook de PayPhone
  validarWebhook(datos, firma) {
    try {
      // Crear firma esperada (ejemplo simple, ajustar según PayPhone)
      const crypto = require('crypto');
      const stringFirma = `${datos.idTransaccion}${datos.monto}${payphone.token}`;
      const firmaEsperada = crypto
        .createHash('sha256')
        .update(stringFirma)
        .digest('hex');

      return firma === firmaEsperada;
    } catch (error) {
      console.error('Error validando webhook:', error.message);
      return false;
    }
  }
};

module.exports = payphoneService;
