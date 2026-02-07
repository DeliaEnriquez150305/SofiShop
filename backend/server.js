// ============================================
// SERVIDOR PRINCIPAL - SOFISHOP
// ============================================
// Este archivo configura y ejecuta el servidor Express
// que maneja tanto el backend API como el frontend estático

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno

// Importar configuraciones y rutas
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');

// Inicializar aplicación Express
const app = express();

// Conectar a la base de datos MongoDB
connectDB();

// ============================================
// MIDDLEWARES
// ============================================
// CORS: Permitir peticiones desde cualquier origen
app.use(cors());

// Parser JSON: Permite leer datos JSON en el body de las peticiones
app.use(express.json());

// ============================================
// RUTAS API REST
// ============================================
app.use('/api/auth', authRoutes);       // Autenticación y registro de usuarios
app.use('/api/products', productRoutes); // CRUD de productos
app.use('/api/orders', orderRoutes);     // Gestión de pedidos
app.use('/api/payments', paymentRoutes); // Integración con pasarela de pagos

// ============================================
// SERVIR ARCHIVOS ESTÁTICOS (FRONTEND)
// ============================================
// Servir todos los archivos HTML, CSS, JS e imágenes del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Servir la carpeta de uploads para imágenes de productos
app.use('/uploads', express.static(path.join(__dirname, '../frontend/uploads')));

// ============================================
// RUTA RAÍZ
// ============================================
// Cuando se accede a localhost:3000, mostrar la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: MongoDB`);
  console.log(`🚀 Listo para recibir peticiones`);
});
