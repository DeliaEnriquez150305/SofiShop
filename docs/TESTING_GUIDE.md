# 🧪 Testing Guide - PayPhone Integration

## ✅ Test Plan Completo

---

## 🎯 Test 1: Crear Orden Básica

**Objetivo**: Verificar que se puede crear una orden correctamente

**Pasos**:
1. Navegar a `http://localhost:3000/cart.html`
2. Agregar un producto al carrito
3. Completar formulario de dirección
4. Click en "Ir a Factura"

**Resultado Esperado**:
- ✓ Redirige a `checkout.html`
- ✓ Muestra resumen de orden con productos y total
- ✓ Permite seleccionar método de pago

**Validación en BD**:
```javascript
db.orders.findOne({email: "usuario@test.com"})
// Debe retornar objeto con:
// - _id: ObjectId
// - cliente, email, telefono
// - productos: Array
// - total: Number
// - pago: { metodo: undefined, estado: "pendiente" }
// - factura: { generada: false }
```

---

## 💳 Test 2: Iniciar Pago PayPhone

**Objetivo**: Verificar que se puede iniciar una transacción en PayPhone

**Pasos**:
1. Completar Test 1
2. En checkout.html, seleccionar "PayPhone"
3. Click en "Pagar Ahora"

**Resultado Esperado**:
- ✓ Se muestra "Procesando tu pago..."
- ✓ Backend crea transacción en PayPhone
- ✓ Orden se actualiza con estado "procesando"

**En Consola (F12)**:
```javascript
// Ver request POST a /api/payments/payphone/iniciar
// Response debe tener: { exito: true, transaccion: {...} }
```

**En BD**:
```javascript
db.orders.findOne({_id: ObjectId})
// Debe tener:
// pago.metodo: "payphone"
// pago.estado: "procesando"
// pago.idTransaccion: "txn_..."
```

---

## 🔗 Test 3: Webhook de Confirmación

**Objetivo**: Simular la confirmación de pago desde PayPhone

**Opción A - Usar payphone-test.html**:
1. Ir a `http://localhost:3000/payphone-test.html`
2. Click "Crear Orden"
3. Click "Iniciar Pago PayPhone"
4. Click "Simular Webhook (Confirmación)"

**Opción B - Request Manual**:
```bash
curl -X POST http://localhost:3000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "idTransaccion": "txn_123",
    "monto": 99.99,
    "referencia": "MONGO_ID_DE_ORDEN",
    "estado": "completado"
  }'
```

**Resultado Esperado**:
- ✓ Response: `{ exito: true, estado: "completado" }`
- ✓ Orden actualiza a estado "pagado"
- ✓ Factura se genera automáticamente

**En BD**:
```javascript
db.orders.findOne({_id: ObjectId})
// Debe tener:
// pago.estado: "completado"
// pago.fechaPago: ISODate(...)
// estado: "pagado"
// factura.generada: true
// factura.numero: "FC-20260203-ABC123"
```

---

## 📄 Test 4: Acceder a Factura

**Objetivo**: Verificar que la factura se genera y es accesible

**Pasos**:
1. Completar Test 3 (pago exitoso)
2. En checkout.html, click "Ver Factura"
3. O navegar a `http://localhost:3000/factura.html?orderId=MONGO_ID`

**Resultado Esperado**:
- ✓ Muestra factura con:
  - Número de factura
  - Datos del cliente
  - Lista de productos
  - Total y fecha
  - Botón descargar PDF

---

## 💵 Test 5: Pago en Efectivo

**Objetivo**: Verificar flujo de pago en efectivo

**Pasos**:
1. En checkout.html, seleccionar "Efectivo al Recibir"
2. Click "Crear Orden"
3. Click "Confirmar Orden"

**Resultado Esperado**:
- ✓ Orden se crea con método "efectivo"
- ✓ pago.estado = "pendiente"
- ✓ No se inicia transacción en PayPhone
- ✓ Factura NO se genera automáticamente

**En BD**:
```javascript
db.orders.findOne({})
// pago.metodo: "efectivo"
// pago.estado: "pendiente"
// factura.generada: false
```

---

## 🔄 Test 6: Verificar Estado de Pago

**Objetivo**: Verificar que se puede consultar el estado

**Con payphone-test.html**:
1. Crear orden
2. Procesar pago PayPhone
3. Click "Verificar Estado"

**Manual**:
```bash
curl http://localhost:3000/api/payments/estado/MONGO_ID
```

**Resultado Esperado**:
```json
{
  "exito": true,
  "pago": {
    "metodo": "payphone",
    "estado": "completado",
    "idTransaccion": "txn_...",
    "fechaPago": "2026-02-03T..."
  },
  "factura": {
    "generada": true,
    "numero": "FC-20260203-ABC123",
    "fechaGeneracion": "2026-02-03T..."
  }
}
```

---

## ❌ Test 7: Errores y Validaciones

### Test 7.1: Carrito Vacío
**Pasos**:
1. Limpiar carrito
2. Ir a checkout.html
3. Click "Pagar"

**Resultado Esperado**:
- ✓ Error: "El carrito está vacío"
- ✓ Redirige a cart.html

### Test 7.2: Credenciales Inválidas
**Pasos**:
1. Cambiar PAYPHONE_TOKEN en `.env` a valor inválido
2. Reiniciar servidor
3. Intentar pago

**Resultado Esperado**:
- ✓ Error: "Error al iniciar pago"
- ✓ Mensaje en consola del servidor

### Test 7.3: Dirección Incompleta
**Pasos**:
1. No completar formulario de dirección
2. Click "Ir a Factura"

**Resultado Esperado**:
- ✓ Error: "Por favor completa todos los campos"
- ✓ Permanece en cart.html

### Test 7.4: Teléfono Inválido
**Pasos**:
1. Ingresar teléfono con menos de 10 dígitos
2. Click "Ir a Factura"

**Resultado Esperado**:
- ✓ Error: "El teléfono debe tener 10 dígitos"
- ✓ Permanece en cart.html

---

## 🔒 Test 8: Seguridad

### Test 8.1: Sin Autenticación
**Pasos**:
1. Limpiar localStorage
2. Ir a `http://localhost:3000/checkout.html`

**Resultado Esperado**:
- ✓ Redirige a `index.html`
- ✓ No permite acceder sin login

### Test 8.2: CORS
**Pasos**:
1. Intentar request desde otro dominio
2. En consola: `fetch('http://localhost:3000/api/orders')`

**Resultado Esperado**:
- ✓ CORS permitido para localhost
- ✓ Rechazado para otros dominios (en producción)

### Test 8.3: SQL/Injection (NoSQL)
**Pasos**:
1. En formulario, ingresar: `{"$ne": ""}`
2. Intentar enviar

**Resultado Esperado**:
- ✓ Validación rechaza caracteres especiales
- ✓ O se escapa correctamente

---

## 📊 Test 9: Volumen y Carga

### Test 9.1: Múltiples Órdenes Simultáneas
**Pasos**:
1. En consola del navegador:
```javascript
for(let i=0; i<10; i++) {
  fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({...orden...})
  });
}
```

**Resultado Esperado**:
- ✓ Todas las órdenes se crean
- ✓ Base de datos guarda todas
- ✓ Servidor no falla

### Test 9.2: Webhooks Concurrentes
```bash
# En terminal, enviar múltiples webhooks
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/payments/webhook \
    -H "Content-Type: application/json" \
    -d '{"idTransaccion":"txn_'$i'","estado":"completado"}'
done
```

**Resultado Esperado**:
- ✓ Todos los webhooks se procesan
- ✓ Sin race conditions

---

## 🌐 Test 10: Integración Completa

**Escenario**: Usuario compra desde inicio hasta factura

**Pasos Completos**:
1. Ir a `http://localhost:3000`
2. Login o Registro
3. Ir a `perfumes.html`
4. Agregar 3 productos diferentes
5. Ir al carrito
6. Completar dirección
7. Ir a checkout
8. Seleccionar PayPhone
9. Procesar pago
10. Simular webhook (si es local)
11. Ver factura
12. Descargar PDF

**Validaciones**:
- ✓ Usuario logueado
- ✓ Carrito tiene 3 productos
- ✓ Total correcto
- ✓ Dirección guardada
- ✓ Orden creada en BD
- ✓ Pago procesado
- ✓ Factura generada
- ✓ PDF descargable

---

## 📋 Casos Edge

### Edge 1: Pago Duplicado
- Usuario hace click 2 veces en "Pagar Ahora"
- **Resultado**: Solo se debe crear una transacción

### Edge 2: Timeout
- Conexión a PayPhone se cae
- **Resultado**: Error graceful, estado "fallido"

### Edge 3: Webhook Retrasado
- Webhook llega después de 5 minutos
- **Resultado**: Se procesa correctamente, factura se genera

### Edge 4: Usuario Cambia Dirección
- Completa dirección, va a checkout, cambia dirección
- **Resultado**: Se usa la nueva dirección

---

## 🚀 Test Automatizado (Opcional)

```javascript
// test.js - Jest/Mocha
const axios = require('axios');

describe('PayPhone Integration', () => {
  let orderId;

  test('Crear orden', async () => {
    const res = await axios.post('/api/orders', {
      cliente: 'Test',
      email: 'test@test.com',
      productos: [],
      total: 99.99
    });
    orderId = res.data.pedido._id;
    expect(res.status).toBe(200);
  });

  test('Iniciar pago', async () => {
    const res = await axios.post('/api/payments/payphone/iniciar', {
      orderId
    });
    expect(res.data.exito).toBe(true);
  });

  test('Procesar webhook', async () => {
    const res = await axios.post('/api/payments/webhook', {
      idTransaccion: 'txn_test',
      estado: 'completado',
      referencia: orderId
    });
    expect(res.data.exito).toBe(true);
  });
});
```

---

## ✅ Checklist Final

- [ ] Test 1 Passou
- [ ] Test 2 Passou
- [ ] Test 3 Passou
- [ ] Test 4 Passou
- [ ] Test 5 Passou
- [ ] Test 6 Passou
- [ ] Test 7 Passou
- [ ] Test 8 Passou
- [ ] Test 9 Passou
- [ ] Test 10 Passou
- [ ] Sin errores en consola
- [ ] Base de datos consistente
- [ ] Logs correctos
- [ ] Listo para producción

---

**Documento de Testing**: PayPhone Integration  
**Versión**: 1.0  
**Fecha**: 3 de Febrero, 2026
