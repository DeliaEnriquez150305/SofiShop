# 🎯 Guía de Integración PayPhone - SofiShop

## ✅ Implementación Completada

Se ha integrado **PayPhone** a la aplicación SofiShop con las siguientes características:

---

## 📋 Credenciales Configuradas

```
ID del Comercio: 0986346275
Token: Sofia2022
App ID: 0986346275
```

Se encuentran en: `backend/.env`

---

## 🏗️ Estructura Implementada

### Backend

#### 1. **Modelo de Orden Actualizado** (`backend/models/Order.js`)
```javascript
pago: {
  metodo: String,              // 'payphone', 'efectivo', etc
  estado: String,              // 'pendiente', 'procesando', 'completado', 'fallido'
  idTransaccion: String,       // ID de transacción en PayPhone
  fechaPago: Date,             // Fecha del pago
  referencia: String           // Referencia de la orden
}

factura: {
  generada: Boolean,           // ¿Factura generada?
  numero: String,              // Número de factura
  fechaGeneracion: Date,       // Fecha de generación
  url: String                  // URL para descargar
}
```

#### 2. **Configuración PayPhone** (`backend/config/payphone.js`)
- Almacena credenciales de forma centralizada
- Soporta variables de entorno

#### 3. **Servicio PayPhone** (`backend/services/payphoneService.js`)
Funciones:
- `crearTransaccion()` - Inicia un pago
- `verificarTransaccion()` - Valida estado del pago
- `validarWebhook()` - Verifica webhooks de PayPhone

#### 4. **Rutas de Pago** (`backend/routes/payment.routes.js`)

**POST** `/api/payments/payphone/iniciar`
```javascript
{
  orderId: "orden_id"
}
// Response:
{
  exito: true,
  transaccion: { /* datos de PayPhone */ }
}
```

**POST** `/api/payments/webhook`
- Recibe confirmación de PayPhone
- Actualiza estado de la orden
- Genera factura automáticamente

**GET** `/api/payments/estado/:orderId`
- Verifica estado del pago
- Retorna info de pago y factura

---

## 🎨 Frontend

### 1. **Página de Checkout** (`frontend/checkout.html`)

Características:
- ✓ Selector de método de pago (PayPhone / Efectivo)
- ✓ Resumen de orden
- ✓ Procesamiento de pago
- ✓ Indicador de progreso

### 2. **Flujo de Pago**

```
Carrito (cart.html)
    ↓
Checkout (checkout.html) ← NUEVO
    ↓
Seleccionar PayPhone
    ↓
Crear Orden
    ↓
Procesar Pago
    ↓
Generar Factura
    ↓
Perfil / Descargar Factura
```

---

## 🚀 Cómo Usar

### Para el Usuario

1. **Ir al Carrito**
   - Agregar productos
   - Completar dirección de entrega

2. **Ir a Checkout**
   - Click en "Ir a Factura" (ahora va a checkout)

3. **Seleccionar Método de Pago**
   - **PayPhone**: Pago con tarjeta (recomendado)
   - **Efectivo**: Pago al recibir

4. **Pagar**
   - Si PayPhone: Ir a formulario de pago seguro
   - Si Efectivo: Confirmar orden

5. **Recibir Factura**
   - Se genera automáticamente después del pago
   - Acceder desde perfil del usuario

---

## 🔧 Configuración API PayPhone

### Endpoint para Transacciones

```bash
POST https://api.payphone.app/api/transacciones
Content-Type: application/json

{
  "appId": "0986346275",
  "token": "Sofia2022",
  "comercioId": "0986346275",
  "monto": 99.99,
  "referencia": "orden_123",
  "descripcion": "Compra en SofiShop",
  "correoComprador": "cliente@email.com",
  "nombreComprador": "John Doe",
  "telefonoComprador": "0987654321",
  "urlRetorno": "http://localhost:3000/checkout.html",
  "urlNotificacion": "http://localhost:3000/api/payments/webhook"
}
```

### Respuesta Exitosa

```json
{
  "exito": true,
  "datos": {
    "id": "transaccion_123",
    "estado": "pendiente",
    "enlaceFormulario": "https://payphone.app/pagar/transaccion_123"
  }
}
```

---

## 📊 Estado de Órdenes

Las órdenes ahora tienen estados de pago:

| Estado | Significado |
|--------|-------------|
| `pendiente` | Espera de pago |
| `procesando` | Pago en proceso |
| `pagado` | Pago completado ✓ |
| `cancelado` | Orden cancelada |

---

## 🔐 Seguridad

✓ **Variables de entorno** - No hardcodear credenciales
✓ **HTTPS** - Usar SSL/TLS en producción
✓ **Validación de webhooks** - Verificar firma de PayPhone
✓ **Sanitización** - Validar inputs del usuario
✓ **CORS** - Configurado en backend

---

## 📝 Instalación de Dependencias

```bash
cd backend
npm install

# Se añadieron:
# - axios: Para peticiones HTTP a PayPhone
# - dotenv: Para variables de entorno
```

---

## ⚙️ Variables de Entorno

Crear archivo `backend/.env`:

```env
PAYPHONE_APP_ID=0986346275
PAYPHONE_TOKEN=Sofia2022
PAYPHONE_COMERCIO_ID=0986346275
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

---

## 🧪 Pruebas

### Prueba Local

1. Inicia el servidor:
```bash
cd backend
npm start
```

2. Abre en navegador:
```
http://localhost:3000/checkout.html
```

3. Selecciona PayPhone y sigue el flujo

### Casos de Prueba

- ✓ Pagar con tarjeta válida
- ✓ Rechazar tarjeta inválida
- ✓ Ver factura después de pagar
- ✓ Pagar en efectivo (sin PayPhone)
- ✓ Validar stock antes de confirmar

---

## 📌 Próximos Pasos (Opcionales)

1. **Implementar confirmación por email**
   - Enviar factura al email del cliente
   - Notificar cambios de estado

2. **Sistema de devoluciones**
   - Permitir devolver productos pagados
   - Generar reembolso en PayPhone

3. **Dashboard admin**
   - Ver transacciones de PayPhone
   - Exportar reportes de ventas

4. **Integración WhatsApp**
   - Notificar confirmación de pago por WhatsApp
   - Link para descargar factura

---

## 📞 Contacto PayPhone

- **API Docs**: https://docs.payphone.app
- **Soporte**: support@payphone.app
- **Dashboard**: https://admin.payphone.app

---

**Estado**: ✅ Implementación completada
**Fecha**: 2026-02-03
**Version**: 1.0
