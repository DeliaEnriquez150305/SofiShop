const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { enviarCorreoRecuperacion, enviarCorreoVerificacion } = require('../services/emailService');

const router = express.Router();

// Lista de emails autorizados para crear cuentas admin
const ADMIN_EMAILS_AUTHORIZED = ['compras.sofishop@gmail.com'];

router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // Normalizar email a minúsculas
    const emailLower = email.toLowerCase().trim();

    // Validar que solo emails autorizados puedan crear admins
    if (rol === 'admin' && !ADMIN_EMAILS_AUTHORIZED.includes(emailLower)) {
      return res.status(403).json({ 
        mensaje: 'No tienes permisos para crear cuentas de administrador. Solo el admin principal puede hacerlo.' 
      });
    }

    // Escape special regex characters in email
    const emailRegexEscaped = emailLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existingUser = await User.findOne({ email: new RegExp(`^${emailRegexEscaped}$`, 'i') });
    if (existingUser) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const verificationToken = uuidv4();

    const user = new User({
      nombre,
      email: emailLower,
      password: passwordHash,
      rol: rol === 'admin' && ADMIN_EMAILS_AUTHORIZED.includes(emailLower) ? 'admin' : 'cliente',
      verificationToken: verificationToken
    });
    
    await user.save();

    // Enviar correo de verificación EN BACKGROUND (sin esperar)
    enviarCorreoVerificacion(email, nombre, verificationToken).catch(err => 
      console.error('No se pudo enviar correo de verificación:', err.message)
    );

    res.json({ 
      mensaje: 'Usuario registrado correctamente. Por favor verifica tu correo para activar tu cuenta.',
      usuario: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario con email insensible a mayúsculas
    // Escape special regex characters in email
    const emailLower = (email || '').toLowerCase().trim();
    const emailRegexEscaped = emailLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let user = await User.findOne({ email: new RegExp(`^${emailRegexEscaped}$`, 'i') });
    if (!user && ADMIN_EMAILS_AUTHORIZED.includes(emailLower)) {
      const hashedPassword = await bcrypt.hash('Sofia2022...', 10);
      await User.create({
        nombre: 'Admin SofiShop',
        email: emailLower,
        password: hashedPassword,
        rol: 'admin',
        emailVerified: true
      });
      user = await User.findOne({ email: new RegExp(`^${emailRegexEscaped}$`, 'i') });
    }
    if (!user) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado. Email o contraseña incorrectos.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    res.json({ 
      mensaje: 'Login exitoso', 
      usuario: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol, emailVerified: user.emailVerified } 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para solicitar recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ mensaje: 'Email es requerido' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ mensaje: 'El email no está registrado' });
    }

    const resetToken = uuidv4();
    const resetTokenExpire = new Date(Date.now() + 3600000); // 1 hora

    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();

    // Enviar correo de recuperación
    const resultadoEmail = await enviarCorreoRecuperacion(email, user.nombre, resetToken);

    if (resultadoEmail.success) {
      res.json({ mensaje: 'Se ha enviado un correo de recuperación a tu email' });
    } else {
      res.status(500).json({ error: 'Error al enviar el correo de recuperación' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para resetear contraseña
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ mensaje: 'Token y nueva contraseña son requeridos' });
    }

    const user = await User.findOne({ 
      resetToken: token,
      resetTokenExpire: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.password = passwordHash;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para verificar email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ mensaje: 'Token es requerido' });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ mensaje: 'Token inválido' });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ mensaje: 'Email verificado correctamente. Ya puedes usar tu cuenta.' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
