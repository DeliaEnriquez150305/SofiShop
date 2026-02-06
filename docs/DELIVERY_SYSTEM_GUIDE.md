# 🏠 Sistema de Entregas a Domicilio - SofiShop

## 📋 Descripción General

Se ha implementado un **sistema completo de entregas a domicilio** que permite a los usuarios:
- Registrar y editar su dirección de entrega
- Visualizar la ubicación en Google Maps
- Obtener coordenadas exactas (latitud y longitud)
- Ver la dirección en la factura de compra

---

## 🔧 Cambios Realizados

### 1️⃣ Backend - Modelos de Base de Datos

#### **User.js** - Campo de Dirección
```javascript
direccion: {
  calle: String,
  numero: String,
  ciudad: String,
  provincia: String,
  codigoPostal: String,
  pais: String,
  referencias: String,
  latitud: Number,
  longitud: Number,
  completa: String
}
```

#### **Order.js** - Modelo de Pedidos Actualizado
```javascript
{
  cliente: String,
  email: String,
  productos: Array,
  total: Number,
  direccion: { /* igual que en User */ },
  estado: { 'pendiente', 'procesando', 'enviado', 'entregado', 'cancelado' },
  fecha: Date
}
```

---

## 🌍 Frontend - Funcionalidades

### **cart.html** - Formulario de Dirección
**Ubicación:** Entre el carrito y los botones de compra

**Características:**
- 📍 Mapa interactivo de Google Maps (inicial: Quito, Ecuador)
- 🔍 Búsqueda automática de dirección (geocodificación)
- ✏️ Edición de campos: calle, número, ciudad, provincia, código postal, país, referencias
- 📌 Selección de ubicación al hacer clic en el mapa
- 💾 Almacenamiento en localStorage

**Campos Obligatorios:**
- Calle Principal (*)
- Número (*)
- Ciudad (*)
- País (*) - Predeterminado: Ecuador

**Campos Opcionales:**
- Código Postal
- Referencias Adicionales (ej: "Casa con verja blanca, junto a farmacia")

**Función Principal:**
```javascript
guardarDireccion() // Se ejecuta antes de ir a factura
```

---

### **profile.html** - Gestión de Dirección de Entrega
**Ubicación:** Sección "Mi Dirección de Entrega" en el perfil del usuario

**Características:**
- 👁️ Vista de dirección actual (si existe)
- ✏️ Botón para editar dirección
- 🗺️ Mapa interactivo para seleccionar ubicación
- 📍 Muestra coordenadas en tiempo real
- 💾 Guarda automáticamente en localStorage

**Estados:**
- **Sin dirección:** Mensaje "No tienes una dirección de entrega registrada"
- **Con dirección:** Muestra todos los datos de la dirección

**Funciones:**
```javascript
cargarDireccion()           // Carga y muestra la dirección
abrirEdicionDireccion()     // Abre el formulario de edición
cerrarEdicionDireccion()    // Cierra el formulario
inicializarMapaEdicion()    // Inicia el mapa en la edición
guardarDireccion()          // Guarda los cambios
```

---

### **factura.html** - Mostrar Dirección en Factura
**Ubicación:** Debajo de información del cliente

**Características:**
- 📍 Muestra dirección completa con coordenadas
- ⚠️ Alerta si no hay dirección registrada
- 📌 Referencias adicionales (si existen)
- 🗺️ Coordenadas de GPS para logística

**Función:**
```javascript
llenarDireccionFactura() // Carga la dirección en la factura
```

---

## 🗺️ Integración de Google Maps

### **API Key Utilizada:**
```
AIzaSyDYzZGRRqNf_9DxINHuO9e4BXBRy0Pu5rg
```

### **Funcionalidades del Mapa:**
- ✅ Búsqueda de direcciones (Geocoding)
- ✅ Geocoding inverso (de coordenadas a dirección)
- ✅ Click en mapa para seleccionar ubicación
- ✅ Marcador movible
- ✅ Control de zoom
- ✅ Vista de calle (Street View)
- ✅ Control de pantalla completa

### **Coordenadas por Defecto (Quito, Ecuador):**
```javascript
const QUITO_COORDS = { lat: -0.2176, lng: -78.5149 };
```

---

## 💾 Almacenamiento de Datos

### **localStorage**
```javascript
// Usuario con dirección guardada
const usuario = {
  nombre: "Juan Pérez",
  email: "juan@email.com",
  rol: "cliente",
  direccion: {
    calle: "Calle 10 de Agosto",
    numero: "1234",
    ciudad: "Quito",
    provincia: "Pichincha",
    codigoPostal: "170150",
    pais: "Ecuador",
    referencias: "Junto a farmacia, puerta azul",
    latitud: -0.2176,
    longitud: -78.5149,
    completa: "Calle 10 de Agosto 1234, Quito, Pichincha, Ecuador"
  }
}
```

---

## 🔄 Flujo de Compra Actualizado

```
1. Usuario va al carrito (cart.html)
2. Completa el formulario de dirección
3. Selecciona ubicación en el mapa
4. Hace clic en "Ir a Factura"
5. Se guarda la dirección automáticamente
6. Se muestra la dirección en la factura
7. Usuario completa la compra
8. Pedido se registra con dirección de entrega
```

---

## 📱 Responsividad

### **Cambios Responsive en cart.html:**
- En pantallas menores a 900px: El mapa y formulario se apilan verticalmente
- En móviles: Altura del mapa reducida a 300px
- Grid del formulario se ajusta a 1 columna

---

## ✅ Validaciones Implementadas

### **Validación de Dirección:**
- ✓ Campos obligatorios (calle, número, ciudad, país)
- ✓ Validación de dirección en Google Maps
- ✓ Manejo de errores si la dirección no se encuentra
- ✓ Validación antes de ir a factura

### **Manejo de Errores:**
```javascript
// Si la dirección no existe
"No se pudo encontrar esa dirección. Por favor verifica los datos e intenta de nuevo."

// Si falta información obligatoria
"Por favor completa todos los campos obligatorios"
```

---

## 🔐 Seguridad

- ✅ Datos de dirección guardados localmente en localStorage
- ✅ Sin exposición de coordenadas en la URL
- ✅ Validación en frontend antes de guardar
- ✅ Campo dirección encriptado en base de datos (recomendado configurar en producción)

---

## 🚀 Próximas Mejoras Sugeridas

1. **Geocodificación inversa automática:** Completar campos automáticamente desde coordenadas
2. **Historial de direcciones:** Guardar múltiples direcciones del usuario
3. **Integración con API de envíos:** Calcular costos de envío según ubicación
4. **Validación de códigos postales:** Integrar con servicios de validación
5. **Seguimiento de envío en tiempo real:** Mostrar ruta de entrega en mapa
6. **Integración con Stripe/PayPal:** Guardar dirección de envío en procesador de pagos

---

## 📞 Contacto y Soporte

Para modificar la API key de Google Maps, edita en:
- `cart.html` - Línea final del archivo
- `profile.html` - Línea final del archivo

```html
<script src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&language=es"></script>
```

---

**Última actualización:** 2 de Febrero de 2026
**Sistema:** SofiShop - Entregas a Domicilio v1.0
