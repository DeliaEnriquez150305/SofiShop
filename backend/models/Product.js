const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  stock: Number,
  categoria: String,
  marca: String,
  subcategoria: String,
  imagen: String,
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', ProductSchema);
