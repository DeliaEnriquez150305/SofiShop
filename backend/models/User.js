const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    default: 'cliente'
  },
  telefono: String,
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
  // Campos para recuperación de contraseña
  resetToken: String,
  resetTokenExpire: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
