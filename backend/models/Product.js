// ============================================
// MODELO DE PRODUCTO
// ============================================
// Define la estructura de los productos en la base de datos

const mongoose = require('mongoose');

// Schema del producto con todos sus campos
const ProductSchema = new mongoose.Schema({
  nombre: String,           // Nombre del producto (ej: "Good Girl")
  precio: Number,           // Precio en dólares
  stock: Number,            // Cantidad disponible en inventario
  categoria: String,        // Categoría general (ej: "perfumes")
  marca: String,            // Marca del producto (ej: "Carolina Herrera")
  subcategoria: String,     // Subcategoría: "Mujer" o "Hombre"
  imagen: String,           // Ruta de la imagen del producto
  rating: {                 // Calificación promedio (0-5 estrellas)
    type: Number, 
    default: 0 
  },
  ratingCount: {            // Número total de calificaciones
    type: Number, 
    default: 0 
  }
});

// Exportar el modelo para usarlo en otras partes de la aplicación
module.exports = mongoose.model('Product', ProductSchema);
