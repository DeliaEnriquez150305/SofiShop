const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://deliaenriquez_db_user:admin123@sofi.5a5opzn.mongodb.net/');
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error al conectar MongoDB', error);
    process.exit(1);
  }
};

const getImageFiles = () => {
  const imagePath = path.join(__dirname, '../frontend');
  const mujerPath = path.join(imagePath, 'perfumes mujer');
  const hombrePath = path.join(imagePath, 'perfumes hombre');

  let imageMap = {};

  // Función para scanear carpetas
  const scanFolder = (folderPath, gender) => {
    try {
      const folders = fs.readdirSync(folderPath);
      folders.forEach(brandFolder => {
        const brandPath = path.join(folderPath, brandFolder);
        if (fs.statSync(brandPath).isDirectory()) {
          const files = fs.readdirSync(brandPath);
          files.forEach((file, index) => {
            const filePath = path.join(brandPath, file);
            const relativePath = `perfumes ${gender}/${brandFolder}/${file}`;
            
            if (!imageMap[brandFolder]) {
              imageMap[brandFolder] = [];
            }
            imageMap[brandFolder].push({ imagen: relativePath, index });
          });
        }
      });
    } catch (error) {
      console.log(`⚠️ No se pudo leer ${folderPath}`);
    }
  };

  scanFolder(mujerPath, 'mujer');
  scanFolder(hombrePath, 'hombre');

  return imageMap;
};

const updateProductImages = async () => {
  try {
    const imageMap = getImageFiles();
    console.log('📂 Marcas encontradas:', Object.keys(imageMap).length);

    let updated = 0;

    for (const [brand, images] of Object.entries(imageMap)) {
      // Obtener todos los productos de esta marca
      const products = await Product.find({ marca: brand });
      
      console.log(`  📌 ${brand}: ${products.length} productos, ${images.length} imágenes`);

      // Asignar imágenes cíclicamente
      for (let i = 0; i < products.length; i++) {
        const imageIndex = i % images.length;
        const imagePath = images[imageIndex].imagen;
        
        await Product.updateOne(
          { _id: products[i]._id },
          { imagen: imagePath }
        );
        updated++;
      }
    }

    console.log(`\n✅ ${updated} productos actualizados con imágenes locales`);

    // Mostrar algunos ejemplos
    const examples = await Product.find().limit(5);
    console.log('\n📸 Ejemplos de productos:');
    examples.forEach(p => {
      console.log(`  - ${p.nombre}: ${p.imagen}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

connectDB().then(() => updateProductImages());
