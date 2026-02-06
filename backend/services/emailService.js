const nodemailer = require('nodemailer');

// Configurar transporter de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'deliaenriquez150305@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your_app_password_here'
  }
});

const enviarCorreoRecuperacion = async (email, nombre, token) => {
  try {
    const enlaceReset = `http://localhost:5173/reset-password.html?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'deliaenriquez150305@gmail.com',
      to: email,
      subject: '🔐 Recupera tu contraseña - SofiShop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #20B997;">Recuperación de Contraseña</h2>
          
          <p>Hola <strong>${nombre}</strong>,</p>
          
          <p>Recibimos una solicitud para recuperar tu contraseña. Si no fuiste tú, ignora este correo.</p>
          
          <p>Haz clic en el botón a continuación para resetear tu contraseña:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${enlaceReset}" style="background-color: #20B997; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Recuperar Contraseña
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            O copia este enlace en tu navegador:<br>
            <small>${enlaceReset}</small>
          </p>
          
          <p style="color: #999; font-size: 12px;">
            Este enlace expirará en 1 hora.<br>
            Si tienes problemas, contacta a nuestro soporte.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 SofiShop - Todos los derechos reservados
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true, mensaje: 'Correo de recuperación enviado' };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return { success: false, error: error.message };
  }
};

const enviarCorreoVerificacion = async (email, nombre, token) => {
  try {
    const enlaceVerificacion = `http://localhost:5173/verify-email.html?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'deliaenriquez150305@gmail.com',
      to: email,
      subject: '✉️ Verifica tu correo - SofiShop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #20B997;">Bienvenido a SofiShop</h2>
          
          <p>Hola <strong>${nombre}</strong>,</p>
          
          <p>Gracias por registrarte. Por favor verifica tu correo para activar tu cuenta.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${enlaceVerificacion}" style="background-color: #20B997; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verificar Correo
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            O copia este enlace en tu navegador:<br>
            <small>${enlaceVerificacion}</small>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2026 SofiShop - Todos los derechos reservados
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true, mensaje: 'Correo de verificación enviado' };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  enviarCorreoRecuperacion,
  enviarCorreoVerificacion
};
