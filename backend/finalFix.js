const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

(async () => {
  try {
    await mongoose.connect('mongodb+srv://deliaenriquez_db_user:admin123@sofi.5a5opzn.mongodb.net/');
    
    // Actualizar Ralph Lauren
    const products = await Product.find({ marca: 'Ralph Lauren' });
    const brandPath = path.join(__dirname, '../frontend/perfumeshombre/RalphLauren');
    
    if (fs.existsSync(brandPath)) {
      const images = fs.readdirSync(brandPath).filter(f => f.endsWith('.png'));
      console.log(`Ralph Lauren encontrado con ${images.length} imágenes`);
      
      for (let i = 0; i < products.length; i++) {
        const imageIndex = i % images.length;
        const imagePath = `perfumeshombre/RalphLauren/${images[imageIndex]}`;
        await Product.updateOne({ _id: products[i]._id }, { imagen: imagePath });
      }
      console.log(`✅ Ralph Lauren actualizado: ${products.length} productos`);
    } else {
      console.log(`❌ Ruta no encontrada: ${brandPath}`);
    }
    
    // Verificar productos sin imagen válida
    const productsNoImage = await Product.find({ 
      $or: [{ imagen: '' }, { imagen: null }, { imagen: undefined }]
    });
    console.log(`📌 Productos sin imagen: ${productsNoImage.length}`);
    
    // Contar total
    const total = await Product.countDocuments({});
    console.log(`📊 Total de productos en BD: ${total}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
