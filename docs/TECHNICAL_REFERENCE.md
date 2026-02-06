# 💻 GUÍA TÉCNICA - ENTREGAS A DOMICILIO

## 📖 Referencia Rápida de Funciones

### **cart.html**

#### 1. Inicializar Mapa
```javascript
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: QUITO_COORDS,
    mapTypeControl: true,
    zoomControl: true,
    fullscreenControl: true,
    streetViewControl: true
  });
  
  marker = new google.maps.Marker({
    position: QUITO_COORDS,
    map: map,
    title: 'Tu ubicación'
  });
  
  map.addListener('click', function(e) {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    actualizarUbicacion(lat, lng);
  });
}
```

#### 2. Actualizar Ubicación
```javascript
function actualizarUbicacion(lat, lng) {
  document.getElementById('latitude').textContent = lat.toFixed(6);
  document.getElementById('longitude').textContent = lng.toFixed(6);
  
  const newPosition = { lat: lat, lng: lng };
  map.setCenter(newPosition);
  marker.setPosition(newPosition);
}
```

#### 3. Buscar Dirección
```javascript
function buscarDireccion() {
  const calle = document.getElementById('calle').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const ciudad = document.getElementById('ciudad').value.trim();
  const provincia = document.getElementById('provincia').value.trim();
  const pais = document.getElementById('pais').value.trim();

  if (!calle || !numero || !ciudad) {
    alert('Por favor completa los campos obligatorios');
    return;
  }

  const direccionCompleta = `${calle} ${numero}, ${ciudad}, ${provincia}, ${pais}`;
  
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: direccionCompleta }, function(results, status) {
    if (status === 'OK') {
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();
      actualizarUbicacion(lat, lng);
      alert(`Dirección encontrada: ${results[0].formatted_address}`);
    } else {
      alert('No se pudo encontrar esa dirección. Intenta de nuevo.');
    }
  });
}
```

#### 4. Guardar Dirección
```javascript
function guardarDireccion() {
  const calle = document.getElementById('calle').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const ciudad = document.getElementById('ciudad').value.trim();
  const provincia = document.getElementById('provincia').value.trim();
  const codigoPostal = document.getElementById('codigoPostal').value.trim();
  const pais = document.getElementById('pais').value.trim();
  const referencias = document.getElementById('referencias').value.trim();
  const latitud = parseFloat(document.getElementById('latitude').textContent);
  const longitud = parseFloat(document.getElementById('longitude').textContent);

  if (!calle || !numero || !ciudad || !pais) {
    alert('Por favor completa todos los campos obligatorios');
    return false;
  }

  const direccion = {
    calle,
    numero,
    ciudad,
    provincia,
    codigoPostal,
    pais,
    referencias,
    latitud,
    longitud,
    completa: `${calle} ${numero}, ${ciudad}, ${provincia}, ${pais}`
  };

  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  usuario.direccion = direccion;
  localStorage.setItem('usuario', JSON.stringify(usuario));
  
  return true;
}
```

---

### **profile.html**

#### 1. Cargar Dirección
```javascript
function cargarDireccion() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const verDiv = document.getElementById('ver-direccion');

  if (usuario.direccion && usuario.direccion.calle) {
    const dir = usuario.direccion;
    verDiv.innerHTML = `
      <div class="direccion-grid">
        <div class="direccion-item">
          <div class="direccion-item-label">Calle y Número</div>
          <div class="direccion-item-valor">${dir.calle} ${dir.numero}</div>
        </div>
        <div class="direccion-item">
          <div class="direccion-item-label">Ciudad</div>
          <div class="direccion-item-valor">${dir.ciudad}</div>
        </div>
        ${dir.referencias ? `
          <div class="direccion-item" style="grid-column: 1 / -1;">
            <div class="direccion-item-label">Referencias Adicionales</div>
            <div class="direccion-item-valor">${dir.referencias}</div>
          </div>
        ` : ''}
      </div>
    `;
  } else {
    verDiv.innerHTML = `
      <div class="sin-direccion">
        <div class="sin-direccion-icon">
          <i class="fas fa-home"></i>
        </div>
        <p>No tienes una dirección de entrega registrada</p>
        <small>Agrega tu dirección para recibir tus pedidos a domicilio</small>
      </div>
    `;
  }
}
```

#### 2. Inicializar Mapa en Edición
```javascript
function inicializarMapaEdicion() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const dir = usuario.direccion || {};
  const coordInicial = dir.latitud && dir.longitud 
    ? { lat: dir.latitud, lng: dir.longitud }
    : QUITO_COORDS;

  mapEdicion = new google.maps.Map(document.getElementById('mapa-edicion'), {
    zoom: 13,
    center: coordInicial,
    mapTypeControl: true,
    zoomControl: true,
    fullscreenControl: true,
    streetViewControl: true
  });

  markerEdicion = new google.maps.Marker({
    position: coordInicial,
    map: mapEdicion,
    title: 'Tu ubicación'
  });

  mapEdicion.addListener('click', function(e) {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    markerEdicion.setPosition(e.latLng);
    mapEdicion.setCenter(e.latLng);
  });
}
```

---

### **factura.html**

#### 1. Llenar Dirección en Factura
```javascript
function llenarDireccionFactura() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const direccionDiv = document.getElementById('direccion-factura');

  if (usuario.direccion && usuario.direccion.calle) {
    const dir = usuario.direccion;
    direccionDiv.innerHTML = `
      <p style="margin: 0 0 10px 0; font-weight: 600; font-size: 1em;">
        ${dir.calle} ${dir.numero}
      </p>
      <p style="margin: 0; color: #666; font-size: 0.9em;">
        ${dir.ciudad}, ${dir.provincia} ${dir.codigoPostal ? '- ' + dir.codigoPostal : ''}<br>
        ${dir.pais}
      </p>
      ${dir.referencias ? `
        <p style="margin: 10px 0 0 0; color: #666; font-size: 0.85em;">
          <strong>Ref.:</strong> ${dir.referencias}
        </p>
      ` : ''}
      ${dir.latitud && dir.longitud ? `
        <p style="margin: 8px 0 0 0; color: #999; font-size: 0.8em;">
          📍 ${dir.latitud.toFixed(4)}, ${dir.longitud.toFixed(4)}
        </p>
      ` : ''}
    `;
  } else {
    direccionDiv.innerHTML = `
      <p style="margin: 0; color: #e74c3c; font-weight: 600;">
        ⚠️ No hay dirección de entrega registrada
      </p>
    `;
  }
}
```

---

## 🔑 Constantes Globales

```javascript
// Coordenadas por defecto (Quito, Ecuador)
const QUITO_COORDS = { lat: -0.2176, lng: -78.5149 };

// Objeto del mapa
let map;

// Marcador del mapa
let marker;

// Para edición en perfil
let mapEdicion;
let markerEdicion;
```

---

## 📦 Estructura de Dirección en localStorage

```javascript
{
  "usuario": {
    "nombre": "Juan Pérez",
    "email": "juan@email.com",
    "rol": "cliente",
    "direccion": {
      "calle": "Calle 10 de Agosto",
      "numero": "1234",
      "ciudad": "Quito",
      "provincia": "Pichincha",
      "codigoPostal": "170150",
      "pais": "Ecuador",
      "referencias": "Casa con verja blanca",
      "latitud": -0.2176,
      "longitud": -78.5149,
      "completa": "Calle 10 de Agosto 1234, Quito, Pichincha, Ecuador"
    }
  }
}
```

---

## 🎯 Flujo de Datos

```
Usuario escribe dirección
    ↓
Presiona "Buscar en el Mapa" o hace click en mapa
    ↓
Google Maps Geocoder busca la dirección
    ↓
Obtiene coordenadas (lat, lng)
    ↓
Actualiza marcador en mapa
    ↓
Muestra coordenadas en pantalla
    ↓
Usuario presiona "Ir a Factura"
    ↓
guardarDireccion() valida datos
    ↓
Guarda en localStorage[usuario.direccion]
    ↓
Abre factura.html
    ↓
llenarDireccionFactura() carga dirección
    ↓
Muestra dirección en factura
```

---

## 🚀 Llamadas a Google Maps API

### **Geocodificación (Dirección → Coordenadas)**
```javascript
const geocoder = new google.maps.Geocoder();
geocoder.geocode(
  { address: "Calle 10 de Agosto 1234, Quito, Ecuador" },
  function(results, status) {
    if (status === 'OK') {
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();
      console.log(`Coordenadas: ${lat}, ${lng}`);
    }
  }
);
```

### **Reverse Geocodificación (Coordenadas → Dirección)**
```javascript
const geocoder = new google.maps.Geocoder();
geocoder.geocode(
  { location: { lat: -0.2176, lng: -78.5149 } },
  function(results, status) {
    if (status === 'OK') {
      const address = results[0].formatted_address;
      console.log(`Dirección: ${address}`);
    }
  }
);
```

---

## 📝 Atributos HTML Importantes

### **Elementos del Formulario en cart.html**
```html
<input type="text" id="calle" placeholder="Ej: Calle 10 de Agosto">
<input type="text" id="numero" placeholder="Ej: 1234">
<input type="text" id="ciudad" placeholder="Ej: Quito">
<input type="text" id="provincia" placeholder="Ej: Pichincha">
<input type="text" id="codigoPostal" placeholder="Ej: 170150">
<input type="text" id="pais" value="Ecuador">
<textarea id="referencias" placeholder="Ej: Casa con verja blanca"></textarea>

<!-- Mostrador de coordenadas -->
<span id="latitude">-0.2176</span>
<span id="longitude">-78.5149</span>

<!-- Mapa -->
<div id="map"></div>
```

### **Elementos en profile.html**
```html
<!-- Vista de dirección -->
<div id="ver-direccion"></div>

<!-- Formulario de edición -->
<div id="editar-direccion" style="display: none;">
  <input type="text" class="form-input" id="dir-calle">
  <input type="text" class="form-input" id="dir-numero">
  <!-- ... más campos ... -->
</div>

<!-- Mapa -->
<div class="mapa-perfil" id="mapa-edicion"></div>
```

### **Elementos en factura.html**
```html
<!-- Dirección en factura -->
<div id="direccion-factura">
  <!-- Se llena dinámicamente -->
</div>
```

---

## 🔍 Debugging

### **Verificar dirección guardada**
```javascript
const usuario = JSON.parse(localStorage.getItem('usuario'));
console.log('Dirección guardada:', usuario.direccion);
```

### **Verificar coordenadas actuales**
```javascript
const lat = document.getElementById('latitude').textContent;
const lng = document.getElementById('longitude').textContent;
console.log(`Coordenadas actuales: ${lat}, ${lng}`);
```

### **Limpiar localStorage**
```javascript
localStorage.removeItem('usuario');
// O solo la dirección:
const usuario = JSON.parse(localStorage.getItem('usuario'));
delete usuario.direccion;
localStorage.setItem('usuario', JSON.stringify(usuario));
```

---

## ✅ Validaciones del Sistema

### **Validación de Dirección Completa**
```javascript
const isValid = 
  calle && 
  numero && 
  ciudad && 
  pais && 
  latitud && 
  longitud;
```

### **Validación de Campos Obligatorios**
```javascript
if (!calle || !numero || !ciudad || !pais) {
  alert('Por favor completa todos los campos obligatorios');
  return false;
}
```

### **Validación de Dirección en Google Maps**
```javascript
if (status === 'OK') {
  // Dirección encontrada
} else {
  alert('No se pudo encontrar esa dirección');
}
```

---

## 🎨 Clases CSS Principales

```css
/* Contenedor principal */
.delivery-section { }

/* Formulario */
.delivery-form { }
.form-group { }
.form-group input { }
.form-group textarea { }

/* Mapa */
.map-container { }
#map { width: 100%; height: 400px; }
.map-info { }
.coordinates { }

/* Botones */
.btn-primary { }
.btn-use-location { }

/* En perfil */
.seccion-direccion { }
.direccion-header { }
.direccion-grid { }
.direccion-item { }
.sin-direccion { }
```

---

## 📱 Breakpoints Responsive

```css
/* Tablets y desktop pequeños */
@media (max-width: 900px) {
  .delivery-content { grid-template-columns: 1fr; }
  .address-grid { grid-template-columns: 1fr; }
  #map { height: 300px; }
}

/* Móviles */
@media (max-width: 600px) {
  .delivery-section { padding: 16px; }
  .form-group { margin-bottom: 12px; }
}
```

---

## 🌐 Script de Google Maps

```html
<!-- Incluir al final del archivo -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDYzZGRRqNf_9DxINHuO9e4BXBRy0Pu5rg&language=es"></script>
```

---

## 📚 Documentación Oficial

- Google Maps JavaScript API: https://developers.google.com/maps/documentation/javascript
- Geocoding API: https://developers.google.com/maps/documentation/geocoding
- Places API: https://developers.google.com/maps/documentation/places

---

**Guía Técnica**  
**Sistema de Entregas a Domicilio - SofiShop**  
**v1.0 - Febrero 2026**
