// ============================================
// SERVIDOR PRINCIPAL - SOFISHOP
// ============================================
// Este archivo configura y ejecuta el servidor Express
// que maneja tanto el backend API como el frontend estático

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Cargar variables de entorno

// Importar configuraciones y rutas
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const bcryptjs = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

// Inicializar aplicación Express
const app = express();

// Conectar a la base de datos MongoDB
connectDB();

// ============================================
// AUTO-SEED: Inicializar BD si está vacía
// ============================================
const initializeDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    
    // Verificar si hay productos sin subcategoría (bug anterior)
    const productossinSub = await Product.countDocuments({ subcategoria: { $exists: false } });
    
    const adminEmail = 'compras.sofishop@gmail.com';
    // Ensure only the main admin remains admin
    await User.updateMany(
      { email: { $ne: adminEmail }, rol: 'admin' },
      { $set: { rol: 'cliente' } }
    );
    const adminUser = await User.findOne({ email: adminEmail });

    if (productCount === 0 || userCount === 0 || productossinSub > 0) {
      console.log('📊 Base de datos vacía, inicializando...');
      
      // Limpiar
      await User.deleteMany({});
      await Product.deleteMany({});
      
      // Crear admin
      const hashedPassword = await bcryptjs.hash('Sofia2022...', 10);
      await User.create({
        nombre: 'Admin SofiShop',
        email: adminEmail,
        password: hashedPassword,
        rol: 'admin',
        emailVerified: true
      });
      
      // Crear cliente demo
      await User.create({
        nombre: 'Usuario Demo',
        email: 'deliaenriquez150305@gmail.com',
        password: await bcryptjs.hash('usuario123', 10),
        rol: 'cliente',
        emailVerified: true
      });
      
      // Datos de productos
      const perfumesData = {
        mujer: {
          'Carolina Herrera': [
            { nombre: 'Good Girl', precio: 85 },
            { nombre: 'Very Good Girl', precio: 90 },
            { nombre: 'Very Good Girl Légère', precio: 88 },
            { nombre: 'Good Girl Supreme', precio: 95 },
            { nombre: 'Good Girl Golden Femininity', precio: 92 },
            { nombre: 'Good Girl Eau de Parfum', precio: 87 },
            { nombre: 'Good Girl Collector Edition', precio: 98 },
            { nombre: 'Very Good Girl Oui', precio: 89 },
            { nombre: 'CH Privée', precio: 110 },
            { nombre: 'CH212 VIP Rosé', precio: 105 }
          ],
          'Ariana Grande': [
            { nombre: 'Ari by Ariana Grande', precio: 50 },
            { nombre: 'Moonlight', precio: 55 },
            { nombre: 'Cloud', precio: 60 },
            { nombre: 'God is a Woman', precio: 58 },
            { nombre: 'Thank U, Next', precio: 62 },
            { nombre: 'Girlboss', precio: 65 },
            { nombre: 'Stronger Together', precio: 63 },
            { nombre: 'REM', precio: 67 },
            { nombre: 'Eternal Petals', precio: 69 },
            { nombre: 'Summer Peach', precio: 61 }
          ],
          'Britney Spears': [
            { nombre: 'Circus', precio: 45 },
            { nombre: 'Curious', precio: 48 },
            { nombre: 'Midnight Fantasy', precio: 52 },
            { nombre: 'Radiance', precio: 50 },
            { nombre: 'Believe', precio: 46 },
            { nombre: 'Fantasy', precio: 49 },
            { nombre: 'Toxic', precio: 54 },
            { nombre: 'Prerogative', precio: 51 },
            { nombre: 'In Control', precio: 53 },
            { nombre: 'Hidden Fantasy', precio: 55 },
            { nombre: 'Ooh La La', precio: 47 },
            { nombre: 'Intimate', precio: 44 },
            { nombre: 'Seduction', precio: 56 }
          ],
          'Calvin Klein': [
            { nombre: 'Obsession', precio: 75 },
            { nombre: 'Eternity', precio: 78 },
            { nombre: 'Be', precio: 68 },
            { nombre: 'Reveal', precio: 72 },
            { nombre: 'Truth', precio: 70 },
            { nombre: 'One', precio: 69 },
            { nombre: 'Escape', precio: 71 },
            { nombre: 'Deep Euphoria', precio: 76 },
            { nombre: 'Euphoria', precio: 74 },
            { nombre: 'Woman', precio: 73 },
            { nombre: 'Downtown', precio: 77 },
            { nombre: 'Aqua', precio: 65 }
          ],
          'Hugo Boss': [
            { nombre: 'Boss Orange Woman', precio: 68 },
            { nombre: 'Boss Bottled Scent', precio: 72 },
            { nombre: 'Boss Ma Vie', precio: 75 },
            { nombre: 'Boss Nuit', precio: 78 },
            { nombre: 'Boss Essence', precio: 70 },
            { nombre: 'Boss Intense', precio: 76 },
            { nombre: 'Boss Sparkling', precio: 69 },
            { nombre: 'Boss Jour', precio: 73 },
            { nombre: 'Boss Just Different', precio: 74 },
            { nombre: 'Boss Magnetix', precio: 77 },
            { nombre: 'Boss Alive', precio: 71 },
            { nombre: 'Boss Rose', precio: 79 }
          ],
          'Paco Rabanne': [
            { nombre: 'Olympea', precio: 85 },
            { nombre: 'Phantom', precio: 88 },
            { nombre: '1 Million', precio: 90 },
            { nombre: 'Invictus', precio: 89 },
            { nombre: 'Fame', precio: 92 },
            { nombre: 'Ultraviolet', precio: 91 },
            { nombre: 'Invictus Legend', precio: 86 },
            { nombre: 'Pure XS', precio: 87 },
            { nombre: 'Givenchy', precio: 94 },
            { nombre: 'Eros', precio: 93 },
            { nombre: 'Phantom Secret', precio: 95 },
            { nombre: 'Invictus Victory', precio: 84 }
          ],
          'Paris Hilton': [
            { nombre: 'Just Me', precio: 40 },
            { nombre: 'Heiress', precio: 45 },
            { nombre: 'Come Hither', precio: 42 },
            { nombre: 'Dazzle', precio: 41 },
            { nombre: 'Luxe', precio: 43 },
            { nombre: 'Electrify Me', precio: 39 },
            { nombre: 'Fairy Dust', precio: 38 },
            { nombre: 'Insatiable', precio: 44 }
          ],
          'Katty Perry': [
            { nombre: 'Meowing Nudes', precio: 35 },
            { nombre: 'Purr', precio: 38 },
            { nombre: 'Indi Visible', precio: 36 },
            { nombre: 'Killer Queen', precio: 40 },
            { nombre: 'Mad Potion', precio: 37 },
            { nombre: 'Cosmic', precio: 39 },
            { nombre: 'Royal Revolution', precio: 41 },
            { nombre: 'Citrine Mystique', precio: 42 }
          ],
          'Afnan': [
            { nombre: 'Naseej Al Ward', precio: 65 },
            { nombre: 'Sehr Al Madina', precio: 68 },
            { nombre: 'Turathi', precio: 62 },
            { nombre: 'Naseej', precio: 66 },
            { nombre: 'Supremacy Pour Femme', precio: 70 },
            { nombre: 'Manara Gold', precio: 72 },
            { nombre: 'Supremacy Pour Homme', precio: 75 },
            { nombre: 'Naseej Al Reef', precio: 67 },
            { nombre: 'Bilqis', precio: 71 },
            { nombre: 'Turathi Oud', precio: 73 }
          ]
        },
        hombre: {
          'Carolina Herrera': [
            { nombre: 'Bad Boy', precio: 95 },
            { nombre: 'CH Men', precio: 98 },
            { nombre: 'Gentleman', precio: 100 },
            { nombre: 'VIP', precio: 102 },
            { nombre: 'Play', precio: 89 },
            { nombre: 'Aqua', precio: 85 },
            { nombre: 'Concentré', precio: 105 },
            { nombre: 'Privée Cologne', precio: 110 }
          ],
          'Paco Rabanne': [
            { nombre: '1 Million', precio: 95 },
            { nombre: 'Invictus', precio: 98 },
            { nombre: 'Phantom', precio: 102 },
            { nombre: 'Hero', precio: 85 },
            { nombre: 'Fame', precio: 100 },
            { nombre: 'Legend', precio: 88 },
            { nombre: 'Infrared', precio: 97 },
            { nombre: 'Cologne', precio: 80 }
          ],
          'Calvin Klein': [
            { nombre: 'Obsession', precio: 85 },
            { nombre: 'Eternity', precio: 88 },
            { nombre: 'Escape', precio: 80 },
            { nombre: 'Code', precio: 82 },
            { nombre: 'Truth', precio: 78 },
            { nombre: 'One', precio: 77 },
            { nombre: 'Be', precio: 76 },
            { nombre: 'Downtown', precio: 84 },
            { nombre: 'Aqua', precio: 74 }
          ],
          'Hugo Boss': [
            { nombre: 'Boss Bottled', precio: 85 },
            { nombre: 'Boss Intense', precio: 88 },
            { nombre: 'Boss Orange', precio: 81 },
            { nombre: 'Boss Soul', precio: 89 },
            { nombre: 'Boss Nuit', precio: 91 },
            { nombre: 'Boss Jour', precio: 79 },
            { nombre: 'Boss Magnetix', precio: 87 },
            { nombre: 'Boss Alive', precio: 83 },
            { nombre: 'Boss Rebellion', precio: 90 }
          ],
          'Gucci': [
            { nombre: 'Gucci Guilty', precio: 105 },
            { nombre: 'Gucci Pour Homme', precio: 98 },
            { nombre: 'Made to Measure', precio: 110 },
            { nombre: 'Oud', precio: 125 },
            { nombre: 'Guilty Black', precio: 108 },
            { nombre: 'By Gucci', precio: 95 },
            { nombre: 'Memoire', precio: 115 },
            { nombre: 'Bamboo', precio: 100 }
          ],
          'Ralph Lauren': [
            { nombre: 'Polo', precio: 80 },
            { nombre: 'Polo Black', precio: 85 },
            { nombre: 'Romance', precio: 88 },
            { nombre: 'Safari', precio: 92 },
            { nombre: 'Purple Label', precio: 110 },
            { nombre: 'Rl Blue Label', precio: 78 },
            { nombre: 'Chaps', precio: 70 },
            { nombre: 'Eau de Toilette', precio: 75 },
            { nombre: 'Legend', precio: 82 },
            { nombre: 'Rhapsody', precio: 95 }
          ],
          'Bharara': [
            { nombre: 'Black Afghano', precio: 95 },
            { nombre: 'King Oud', precio: 98 },
            { nombre: 'Oud Wood', precio: 100 },
            { nombre: 'White Oud', precio: 105 },
            { nombre: 'Royal Oud', precio: 110 },
            { nombre: 'Exclusif', precio: 115 },
            { nombre: 'Heritage', precio: 92 },
            { nombre: 'Vintage', precio: 88 }
          ],
          'Lattafa': [
            { nombre: 'Opulence Gold', precio: 75 },
            { nombre: 'Kudus Oud', precio: 78 },
            { nombre: 'Al Amir', precio: 72 },
            { nombre: 'Fakhar', precio: 70 },
            { nombre: 'Qism Al Dhahab', precio: 76 },
            { nombre: 'Asad', precio: 74 },
            { nombre: 'Pride', precio: 73 },
            { nombre: 'Majmua', precio: 71 }
          ]
        }
      };
      
      // Crear productos
      let count = 0;
      for (const [gender, brands] of Object.entries(perfumesData)) {
        for (const [brand, perfumes] of Object.entries(brands)) {
          for (const perfume of perfumes) {
            await Product.create({
              nombre: perfume.nombre,
              marca: brand,
              genero: gender === 'mujer' ? 'Mujer' : 'Hombre',
              subcategoria: gender, // 'mujer' o 'hombre'
              precio: perfume.precio,
              descripcion: `Perfume ${perfume.nombre} de ${brand}`,
              categoria: 'perfumes',
              stock: 10,
              imagen: `perfumes${gender}/${brand}/${perfume.nombre}.png`
            });
            count++;
          }
        }
      }
      
      console.log(`✅ BD inicializada: ${count} productos, 2 usuarios`);
      
      // ==========================================
      // MAPEAR IMÁGENES REALES
      // ==========================================
      console.log('\n🖼️ Mapeando imágenes reales...');
      
      const marcasMujer = {
        'Carolina Herrera': 'CarolinaHerrera',
        'Katty Perry': 'KattyPerry',
        'Ariana Grande': 'ArianaGrande',
        'Britney Spears': 'BritneySpears',
        'Calvin Klein': 'CalvinKlein',
        'Hugo Boss': 'HugoBoss',
        'Paco Rabanne': 'PacoRabanne',
        'Paris Hilton': 'ParisHilton',
        'Afnan': 'Afnan'
      };

      const marcasHombre = {
        'Carolina Herrera': 'CarolinaHerrera',
        'Paco Rabanne': 'PacoRabanne',
        'Calvin Klein': 'CalvinKlein',
        'Hugo Boss': 'HugoBoss',
        'Gucci': 'Gucci',
        'Ralph Lauren': 'RalphLauren',
        'Paris Hilton': 'ParisHilton',
        'Bharara': 'Bharara',
        'Lattafa': 'Lattafa'
      };
      
      let imagenesMapeadas = 0;
      
      // Mapear mujer
      for (const [marcaDB, carpeta] of Object.entries(marcasMujer)) {
        const productos = await Product.find({ marca: marcaDB, subcategoria: 'mujer' });
        const rutaCarpeta = path.join(__dirname, '../frontend/perfumesmujer', carpeta);
        
        if (fs.existsSync(rutaCarpeta)) {
          const imagenes = fs.readdirSync(rutaCarpeta).filter(f => 
            f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp')
          );
          
          for (let i = 0; i < productos.length; i++) {
            const indiceImagen = i % imagenes.length;
            const rutaImagen = `perfumesmujer/${carpeta}/${imagenes[indiceImagen]}`;
            await Product.updateOne({ _id: productos[i]._id }, { imagen: rutaImagen });
            imagenesMapeadas++;
          }
        }
      }
      
      // Mapear hombre
      for (const [marcaDB, carpeta] of Object.entries(marcasHombre)) {
        const productos = await Product.find({ marca: marcaDB, subcategoria: 'hombre' });
        const rutaCarpeta = path.join(__dirname, '../frontend/perfumeshombre', carpeta);
        
        if (fs.existsSync(rutaCarpeta)) {
          const imagenes = fs.readdirSync(rutaCarpeta).filter(f => 
            f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp')
          );
          
          for (let i = 0; i < productos.length; i++) {
            const indiceImagen = i % imagenes.length;
            const rutaImagen = `perfumeshombre/${carpeta}/${imagenes[indiceImagen]}`;
            await Product.updateOne({ _id: productos[i]._id }, { imagen: rutaImagen });
            imagenesMapeadas++;
          }
        }
      }
      
      console.log(`✅ ${imagenesMapeadas} imágenes mapeadas correctamente`);
    } else {
      if (!adminUser) {
        const hashedPassword = await bcryptjs.hash('Sofia2022...', 10);
        await User.create({
          nombre: 'Admin SofiShop',
          email: adminEmail,
          password: hashedPassword,
          rol: 'admin',
          emailVerified: true
        });
        console.log('✅ Admin creado: BD ya tenia datos');
      }
      console.log(`✅ BD lista: ${productCount} productos, ${userCount} usuarios`);
    }
  } catch (error) {
    console.error('⚠️ Error al inicializar BD:', error.message);
  }
};

// Ejecutar auto-seed después de conectar
setTimeout(initializeDatabase, 2000);

// ============================================
// MIDDLEWARES
// ============================================
// CORS: Permitir peticiones desde cualquier origen
app.use(cors());

// CORS headers para imágenes y assets
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Parser JSON: Permite leer datos JSON en el body de las peticiones
app.use(express.json());

// ============================================
// RUTAS API REST
// ============================================
app.use('/api/auth', authRoutes);       // Autenticación y registro de usuarios
app.use('/api/products', productRoutes); // CRUD de productos
app.use('/api/orders', orderRoutes);     // Gestión de pedidos

// ============================================
// SERVIR ARCHIVOS ESTÁTICOS (FRONTEND)
// ============================================
// Servir todos los archivos HTML, CSS, JS e imágenes del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Servir la carpeta de uploads para imágenes de productos
app.use('/uploads', express.static(path.join(__dirname, '../frontend/uploads')));

// Servir carpetas de perfumes (sin espacios en el nombre)
app.use('/perfumesmujer', express.static(path.join(__dirname, '../frontend/perfumesmujer')));
app.use('/perfumeshombre', express.static(path.join(__dirname, '../frontend/perfumeshombre')));

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor SofiShop corriendo en el puerto ${PORT}`);
});