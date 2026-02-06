# 🚀 Deployment Guide - PayPhone Integration

## 📋 Pre-Deployment Checklist

- [ ] Todas las dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Base de datos MongoDB configurada
- [ ] Servidor Node.js corriendo sin errores
- [ ] Pruebas básicas completadas
- [ ] Frontend accesible en http://localhost:3000

---

## 🔧 Configuración para Producción

### 1. Variables de Entorno (`.env`)

```env
# PayPhone
PAYPHONE_APP_ID=0986346275
PAYPHONE_TOKEN=Sofia2022
PAYPHONE_COMERCIO_ID=0986346275

# URLs
BACKEND_URL=https://sofishop.com
FRONTEND_URL=https://sofishop.com

# Base de Datos
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/sofishop

# Ambiente
NODE_ENV=production
```

### 2. Actualizar URLs en Código

**frontend/checkout.html** (línea ~250)
```javascript
const API_URL = 'https://sofishop.com/api'; // Cambiar de http://localhost
```

**backend/routes/payment.routes.js**
```javascript
urlRetorno: `${process.env.FRONTEND_URL}/checkout.html?success=true`
urlNotificacion: `${process.env.BACKEND_URL}/api/payments/webhook`
```

### 3. HTTPS Obligatorio

- Usar certificado SSL/TLS válido
- Redirigir HTTP a HTTPS
- PayPhone requiere HTTPS para webhooks

```javascript
// En server.js (con Express)
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/ruta/a/clave-privada.key'),
  cert: fs.readFileSync('/ruta/a/certificado.crt')
};

https.createServer(options, app).listen(443);
```

---

## 🌐 Deployment Opciones

### Opción 1: Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Crear app
heroku create sofishop-app

# Configurar variables de entorno
heroku config:set PAYPHONE_APP_ID=0986346275
heroku config:set PAYPHONE_TOKEN=Sofia2022
heroku config:set MONGODB_URI=mongodb+srv://...

# Deploy
git push heroku main
```

### Opción 2: DigitalOcean / Linode

```bash
# Conexión SSH
ssh root@tu_servidor

# Instalar Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar repositorio
git clone https://github.com/tu-usuario/sofishop.git
cd sofishop/backend

# Instalar dependencias
npm install

# Crear .env
nano .env
# Agregar variables de entorno

# Usar PM2 para mantener el servidor vivo
npm install -g pm2
pm2 start server.js --name "sofishop"
pm2 startup
pm2 save
```

### Opción 3: AWS EC2

```bash
# Crear instancia EC2 con Ubuntu 20.04

# Conectar por SSH
ssh -i mi-clave.pem ubuntu@public-ip

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
sudo apt install nodejs npm -y

# Clonar y configurar (igual que DigitalOcean)
```

### Opción 4: Docker (Recomendado)

**Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ .

EXPOSE 3000

CMD ["node", "server.js"]
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PAYPHONE_APP_ID=0986346275
      - PAYPHONE_TOKEN=Sofia2022
      - MONGODB_URI=mongodb://mongo:27017/sofishop
    depends_on:
      - mongo
  
  mongo:
    image: mongo:5
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo-data:
```

```bash
# Deploy con Docker
docker-compose up -d
```

---

## 📊 Nginx Configuration (Proxy Inverso)

```nginx
server {
    listen 80;
    server_name sofishop.com www.sofishop.com;

    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name sofishop.com www.sofishop.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/sofishop.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sofishop.com/privkey.pem;

    # Seguridad
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Proxy hacia Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts para webhooks
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API de pagos (sin caché)
    location /api/payments/ {
        proxy_pass http://localhost:3000/api/payments/;
        proxy_no_cache 1;
        proxy_cache_bypass 1;
    }
}
```

---

## 🔒 Seguridad en Producción

### 1. Validación de Webhooks
```javascript
// En payment.routes.js
const validarWebhook = (body, firmaEsperada) => {
  const crypto = require('crypto');
  const stringFirma = `${body.idTransaccion}${body.monto}${process.env.PAYPHONE_TOKEN}`;
  const firmaCalculada = crypto.createHash('sha256').update(stringFirma).digest('hex');
  
  return firmaCalculada === firmaEsperada;
};
```

### 2. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests
});

app.use('/api/', limiter);
```

### 3. CORS Restrictivo
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://sofishop.com', 'https://www.sofishop.com'],
  credentials: true
}));
```

### 4. Headers de Seguridad
```javascript
const helmet = require('helmet');
app.use(helmet());

// npm install helmet
```

---

## 📈 Monitoreo y Logs

### PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 logs

# Estadísticas
pm2 monit
```

### Logs de PayPhone
```javascript
// Guardar logs de transacciones
const fs = require('fs');

function logTransaccion(tipo, datos) {
  const log = `[${new Date().toISOString()}] ${tipo}: ${JSON.stringify(datos)}\n`;
  fs.appendFileSync('logs/payphone.log', log);
}

logTransaccion('PAGO_INICIADO', { orderId, monto });
logTransaccion('WEBHOOK_RECIBIDO', { idTransaccion, estado });
```

---

## 🧪 Test antes de Deploy

### 1. Pruebas Locales
```bash
npm test
# Si hay tests

# O usar payphone-test.html
```

### 2. Verificar Conectividad
```bash
# Probar conexión a PayPhone
curl -X POST https://api.payphone.app/api/transacciones \
  -H "Content-Type: application/json" \
  -d '{"appId":"0986346275","token":"Sofia2022",...}'
```

### 3. Verificar Base de Datos
```javascript
// En Node.js
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
// Debe conectarse sin errores
```

---

## 🚨 Solución de Problemas

### Error: "Cannot find module 'axios'"
```bash
npm install axios
npm install
```

### Error: "PAYPHONE_TOKEN is undefined"
```bash
# Verificar que .env existe
ls -la backend/.env

# Recargar ambiente
pm2 restart sofishop
```

### Webhooks no se reciben
- ✓ Verificar URL en `urlNotificacion` es HTTPS
- ✓ Verificar firewall permite puerto 443
- ✓ Revisar logs: `pm2 logs`
- ✓ Contactar PayPhone support

### Base de datos no conecta
```bash
# Verificar MongoDB corriendo
mongosh # Si es local

# Verificar URI en .env
mongo <MONGODB_URI>
```

---

## ✅ Checklist Post-Deploy

- [ ] Sitio accesible en https://sofishop.com
- [ ] Crear orden funciona
- [ ] Pagar con PayPhone funciona
- [ ] Webhook se recibe correctamente
- [ ] Factura se genera
- [ ] Usuario puede descargar factura
- [ ] Base de datos guarda órdenes
- [ ] Logs se generan correctamente
- [ ] SSL válido (verde en navegador)
- [ ] No hay errores en consola

---

## 📞 Contacto de Soporte

**En caso de errores con PayPhone en producción:**

1. Revisar logs: `pm2 logs sofishop`
2. Contactar PayPhone: support@payphone.app
3. Verificar credenciales en .env
4. Reiniciar servidor: `pm2 restart sofishop`

---

**Última actualización**: 3 de Febrero, 2026
