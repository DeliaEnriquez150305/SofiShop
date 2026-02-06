# 🏠 Entregas a Domicilio - SofiShop

## ¿Qué se ha agregado?

Se ha implementado un **sistema completo de entregas a domicilio** que permite a los usuarios registrar y gestionar su dirección de entrega usando Google Maps.

---

## 📍 Características Principales

### 1. **Dirección en el Carrito** (cart.html)
- Formulario para ingresar dirección completa
- Mapa interactivo de Google Maps
- Búsqueda automática de dirección
- Selecciona ubicación haciendo clic en el mapa
- Se guarda automáticamente al ir a factura

### 2. **Gestión de Dirección en Perfil** (profile.html)
- Ver dirección actual registrada
- Editar dirección en cualquier momento
- Mapa para seleccionar ubicación exacta
- Almacenamiento automático

### 3. **Dirección en Factura** (factura.html)
- Muestra dirección completa de entrega
- Incluye coordenadas GPS
- Muestra referencias adicionales
- Alerta si falta dirección registrada

---

## 🔧 Cómo Funciona

### **Paso 1: Agregar Dirección (Carrito)**
1. Ve a tu carrito
2. Completa los campos:
   - **Calle Principal** (ej: "Calle 10 de Agosto")
   - **Número** (ej: "1234")
   - **Ciudad** (ej: "Quito")
   - **Provincia** (ej: "Pichincha")
   - **Código Postal** (opcional)
   - **País** (predeterminado: Ecuador)
   - **Referencias** (opcional, ej: "Casa con verja blanca")

3. Haz clic en "Buscar en el Mapa" para localizarla automáticamente
4. O haz clic directamente en el mapa para seleccionar ubicación manual

### **Paso 2: Seleccionar Ubicación en el Mapa**
- El mapa inicia en Quito, Ecuador
- Haz clic en cualquier punto del mapa para seleccionar ubicación
- Las coordenadas se actualizan automáticamente
- La dirección se guarda al presionar "Ir a Factura"

### **Paso 3: Ver en Factura**
- La dirección aparece automáticamente en la factura
- Incluye coordenadas GPS para logística
- Puedes imprimir o descargar la factura

---

## 📱 Desde el Perfil

1. Ve a **"Mi Perfil"**
2. Busca la sección **"Mi Dirección de Entrega"**
3. Haz clic en **"Editar"**
4. Completa/modifica los datos
5. Selecciona ubicación en el mapa
6. Haz clic en **"Guardar Dirección"**

---

## 🗺️ Características del Mapa

- ✅ Búsqueda automática de direcciones
- ✅ Click para seleccionar ubicación exacta
- ✅ Muestra coordenadas (latitud, longitud)
- ✅ Zoom y controles interactivos
- ✅ Vista de calle disponible
- ✅ Pantalla completa

---

## 💾 Datos Guardados

Tu dirección se guarda con:
- Calle, número, ciudad, provincia
- Código postal y país
- Coordenadas GPS exactas (latitud, longitud)
- Referencias para el repartidor

---

## ✅ Validaciones

**Campos obligatorios:**
- Calle (*)
- Número (*)
- Ciudad (*)
- País (*)

Si falta alguno, verás un mensaje de error y no podrás continuar.

---

## 📍 Coordenadas por Defecto

Si no has registrado dirección:
- **Ubicación inicial del mapa:** Quito, Ecuador
- **Coordenadas:** -0.2176°, -78.5149°

---

## 🚀 Flujo Completo de Compra

```
1. Agrega productos al carrito
2. Ve al carrito (cart.html)
3. Completa tu dirección de entrega
4. Selecciona ubicación en el mapa
5. Haz clic en "Ir a Factura"
6. Verifica dirección en la factura
7. Completa la compra
8. Recibe en tu dirección registrada
```

---

## 🎯 Datos Que Se Almacenan

### En localStorage (Navegador):
```json
{
  "nombre": "Tu Nombre",
  "email": "tu@email.com",
  "direccion": {
    "calle": "Calle 10 de Agosto",
    "numero": "1234",
    "ciudad": "Quito",
    "provincia": "Pichincha",
    "codigoPostal": "170150",
    "pais": "Ecuador",
    "referencias": "Casa con verja blanca",
    "latitud": -0.2176,
    "longitud": -78.5149
  }
}
```

---

## 📞 Notas Importantes

- **Google Maps:** Usa la API de Google Maps para geocodificación
- **Privacidad:** Tu dirección se guarda localmente en tu navegador
- **Sincronización:** Al hacer una compra, tu dirección se envía al backend
- **Edición:** Puedes cambiar tu dirección en cualquier momento desde el perfil

---

## 🆘 Solución de Problemas

### Problema: "No se pudo encontrar esa dirección"
**Solución:** Verifica que escribiste correctamente la dirección. Intenta:
- Escribe calle, número, ciudad, país
- Usa nombres correctos de ciudades
- Prueba con un punto diferente en el mapa

### Problema: El mapa no carga
**Solución:** 
- Verifica tu conexión a internet
- Limpia el caché del navegador
- Recarga la página

### Problema: No veo mi dirección guardada
**Solución:**
- Verifica que la guardaste correctamente
- Comprueba que estés logeado
- Abre el perfil y edita la dirección

---

## 🌍 Ubicaciones Soportadas

- ✅ Ecuador (Completo)
- ✅ Cualquier país del mundo
- ✅ Direcciones con referencias

---

**Sistema de Entregas a Domicilio**
**Versión:** 1.0
**Última actualización:** 2 de Febrero de 2026

Para cualquier duda, contacta al equipo de SofiShop.
