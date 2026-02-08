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

const fixMissingImages = async () => {
  try {
    // Mapeo de marcas que no coinciden
    const brandMapping = {
      'Kathy Perry': 'Katty Perry',
      'Ralph Lauren': 'RalphLauren'
    };

    let updated = 0;

    for (const [dbBrand, folderBrand] of Object.entries(brandMapping)) {
      const products = await Product.find({ marca: dbBrand });
      console.log(`  📌 ${dbBrand}: ${products.length} productos`);
      
      const brandPath = path.join(__dirname, '../frontend/perfumeshombre', folderBrand);
      if (fs.existsSync(brandPath)) {
        const images = fs.readdirSync(brandPath).filter(f => f.endsWith('.png'));
        console.log(`     ✅ Encontradas ${images.length} imágenes`);
        
        for (let i = 0; i < products.length; i++) {
          const imageIndex = i % images.length;
          const imagePath = `perfumeshombre/${folderBrand}/${images[imageIndex]}`;
          
          await Product.updateOne(
            { _id: products[i]._id },
            { imagen: imagePath }
          );
          updated++;
        }
      }
    }
    
    console.log(`\n✅ ${updated} productos adicionales actualizados`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

connectDB().then(() => fixMissingImages());
