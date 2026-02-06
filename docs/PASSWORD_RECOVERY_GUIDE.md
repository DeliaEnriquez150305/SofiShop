# 📋 Guía de Recuperación de Contraseña y Verificación de Email

## ✅ Sistema Completamente Implementado

Se han creado las siguientes páginas frontend y endpoints backend para manejar:
1. **Recuperación de Contraseña Olvidada**
2. **Restablecimiento de Contraseña**
3. **Verificación de Email**

---

## 🔄 Flujos Disponibles

### 1️⃣ Flujo de Recuperación de Contraseña

#### Página: `forgot-password.html`
- Usuario ingresa su correo electrónico
- Sistema valida que el email esté registrado
- Se genera un token de recuperación (UUID) válido por 1 hora
- Se envía email con enlace de restablecimiento

#### Página: `reset-password.html?token=xxxxx`
- Usuario recibe email con enlace personalizado
- Usuario establece nueva contraseña
- Token se valida antes de actualizar la contraseña
- Si es exitoso, puede iniciar sesión con la nueva contraseña

---

### 2️⃣ Flujo de Verificación de Email

#### Al Registrarse
- Usuario completa formulario en `register.html`
- Se genera token de verificación (UUID)
- Se envía email de bienvenida con enlace de verificación
- Usuario debe hacer clic en el enlace antes de usar la cuenta

#### Página: `verify-email.html?token=xxxxx`
- Automáticamente verifica el email al cargar
- Marca la cuenta como verificada en la base de datos
- Usuario puede iniciar sesión de inmediato

---

## 📧 Configuración de Email

### Proveedor: Gmail

**Credenciales en `.env`:**
```
EMAIL_USER=compras.sofishop@gmail.com
EMAIL_PASSWORD=esyz ffcc hhsv ugss
SERVER_URL=http://localhost:3000
```

> ⚠️ **Nota:** La contraseña es una contraseña de aplicación (app password), no la contraseña regular de Gmail.

---

## 🧪 Pruebas

### Archivo de Prueba Disponible
- **URL:** `http://localhost:3000/test-recuperacion.html`
- Permite probar el envío de email de recuperación
- Muestra todas las rutas disponibles

### Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `compras.sofishop@gmail.com` | `Sofia2022...` | Admin |
| `deliaenriquez150305@gmail.com` | `usuario123` | Cliente |

---

## 🔌 Endpoints Disponibles

### `/api/auth/forgot-password` (POST)
```json
{
  "email": "usuario@correo.com"
}
```
**Respuesta exitosa:**
```json
{
  "mensaje": "Se ha enviado un correo de recuperación a tu email"
}
```

---

### `/api/auth/reset-password` (POST)
```json
{
  "token": "uuid-token-xxxxx",
  "newPassword": "nuevaContraseña123"
}
```
**Respuesta exitosa:**
```json
{
  "mensaje": "Contraseña actualizada correctamente"
}
```

---

### `/api/auth/verify-email` (POST)
```json
{
  "token": "uuid-token-xxxxx"
}
```
**Respuesta exitosa:**
```json
{
  "mensaje": "Email verificado correctamente. Ya puedes usar tu cuenta."
}
```

---

## 🔒 Seguridad Implementada

✅ **Tokens seguros:** UUID v4 criptográficamente seguros
✅ **Expiración:** Tokens de recuperación expiran en 1 hora
✅ **Validación:** Todos los tokens se validan antes de usar
✅ **Hashing:** Contraseñas hasheadas con bcryptjs (salt: 10)
✅ **Email seguro:** Credenciales en variables de entorno

---

## 📝 Actualización del Login

Se agregó enlace "¿Olvidaste tu contraseña?" en `login.html` que redirige a:
- **URL:** `forgot-password.html`

---

## 📱 Pasos para Usar

### Recuperar Contraseña Olvidada:
1. Ir a `login.html`
2. Hacer clic en "¿Olvidaste tu contraseña?"
3. Ingresar email registrado
4. Revisar email (incluir spam)
5. Hacer clic en enlace de recuperación
6. Establecer nueva contraseña
7. Iniciar sesión con nueva contraseña

### Verificar Email al Registrarse:
1. Completar registro en `register.html`
2. Se envía email de verificación automáticamente
3. Hacer clic en enlace del email
4. Email se marca como verificado
5. Ya puedes usar la cuenta

---

## 🚀 Estado Actual

- ✅ Backend completamente implementado
- ✅ Email service con nodemailer configurado
- ✅ Todas las rutas de autenticación funcionando
- ✅ Frontend con todas las páginas necesarias
- ✅ Login actualizado con enlace de recuperación
- ✅ Variables de entorno configuradas
- ✅ MongoDB con schema actualizado

### Próximos Pasos (Opcionales):
- 🔄 Integrar OAuth2 (Google, Microsoft)
- 📊 Dashboard de administración
- 🛍️ Completar flujo de compra
- 📦 Sistema de órdenes

---

## 🆘 Solución de Problemas

### "No recibo el email"
1. Revisar carpeta de spam
2. Verificar que EMAIL_USER y EMAIL_PASSWORD sean correctos en `.env`
3. Revisar console del servidor para errores

### "Token inválido o expirado"
1. El token caduca después de 1 hora
2. Solicitar nuevo enlace de recuperación

### "Email ya registrado"
1. Usar "Iniciar sesión" en lugar de "Registrarse"
2. O usar "Olvidé mi contraseña" para acceder

---

**Versión:** 1.0  
**Última actualización:** 2026  
**Estado:** ✅ Producción Ready
