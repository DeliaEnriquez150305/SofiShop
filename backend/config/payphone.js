// Configuración de PayPhone
require('dotenv').config();

const payphone = {
  // Credenciales de PayPhone
  appId: process.env.PAYPHONE_APP_ID || '+593986346275',
  token: process.env.PAYPHONE_TOKEN || 'Sofia2022',
  comercioId: process.env.PAYPHONE_COMERCIO_ID || '+593986346275',
  
  // URLs de PayPhone
  apiUrl: process.env.PAYPHONE_API_URL || 'https://api.payphone.app/api', // URL base de PayPhone (cambiar según ambiente)
  
  // Configuración
  timeout: 30000, // 30 segundos
  retryAttempts: 3
};

module.exports = payphone;
