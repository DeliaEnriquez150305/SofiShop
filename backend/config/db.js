// ============================================
// CONFIGURACIÓN DE BASE DE DATOS
// ============================================
// Conexión a MongoDB local

const mongoose = require('mongoose');

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/SofiShop');
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;
