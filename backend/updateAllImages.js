const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/SofiShop');
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error al conectar MongoDB', error);
    process.exit(1);
  }
};

const updateAllImages = async () => {
  try {
    console.log('\n🔄 Actualizando imágenes de todos los productos...\n');
    
    // Definir mapeo de marcas a carpetas
    const marcasMujer = {
      'Carolina Herrera': 'Carolina Herrera',
      'Kathy Perry': 'Katty Perry',
      'Ariana Grande': 'Ariana Grande',
      'Britney Spears': 'Britney Spears',
      'Calvin Klein': 'Calvin Klein',
      'Hugo Boss': 'Hugo Boss',
      'Paco Rabanne': 'Paco Rabanne',
      'Paris Hilton': 'Paris Hilton',
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

    let totalActualizados = 0;

    // Actualizar productos de MUJER
    console.log('👗 PERFUMES MUJER:');
    for (const [marcaDB, carpeta] of Object.entries(marcasMujer)) {
      const productos = await Product.find({ 
        marca: marcaDB,
        subcategoria: 'Mujer'
      });
      
      if (productos.length === 0) continue;
      
      const rutaCarpeta = path.join(__dirname, '../frontend/perfumes mujer', carpeta);
      
      if (fs.existsSync(rutaCarpeta)) {
        const imagenes = fs.readdirSync(rutaCarpeta).filter(f => 
          f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp')
        );
        
        console.log(`  📌 ${marcaDB}: ${productos.length} productos, ${imagenes.length} imágenes`);
        
        for (let i = 0; i < productos.length; i++) {
          const indiceImagen = i % imagenes.length;
          const rutaImagen = `perfumes mujer/${carpeta}/${imagenes[indiceImagen]}`;
          
          await Product.updateOne(
            { _id: productos[i]._id },
            { imagen: rutaImagen }
          );
          totalActualizados++;
        }
        console.log(`     ✅ Actualizados`);
      } else {
        console.log(`     ❌ Carpeta no encontrada: ${rutaCarpeta}`);
      }
    }

    // Actualizar productos de HOMBRE
    console.log('\n👔 PERFUMES HOMBRE:');
    for (const [marcaDB, carpeta] of Object.entries(marcasHombre)) {
      const productos = await Product.find({ 
        marca: marcaDB,
        subcategoria: 'Hombre'
      });
      
      if (productos.length === 0) continue;
      
      const rutaCarpeta = path.join(__dirname, '../frontend/perfumes hombre', carpeta);
      
      if (fs.existsSync(rutaCarpeta)) {
        const imagenes = fs.readdirSync(rutaCarpeta).filter(f => 
          f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.webp')
        );
        
        console.log(`  📌 ${marcaDB}: ${productos.length} productos, ${imagenes.length} imágenes`);
        
        for (let i = 0; i < productos.length; i++) {
          const indiceImagen = i % imagenes.length;
          const rutaImagen = `perfumes hombre/${carpeta}/${imagenes[indiceImagen]}`;
          
          await Product.updateOne(
            { _id: productos[i]._id },
            { imagen: rutaImagen }
          );
          totalActualizados++;
        }
        console.log(`     ✅ Actualizados`);
      } else {
        console.log(`     ❌ Carpeta no encontrada: ${rutaCarpeta}`);
      }
    }

    console.log(`\n✅ TOTAL ACTUALIZADO: ${totalActualizados} productos`);
    
    // Verificar productos sin imagen
    const sinImagen = await Product.find({
      $or: [
        { imagen: { $regex: /placeholder/i } },
        { imagen: '' },
        { imagen: null }
      ]
    });
    
    if (sinImagen.length > 0) {
      console.log(`\n⚠️  ${sinImagen.length} productos aún sin imagen real`);
    }

    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

connectDB().then(() => updateAllImages());
