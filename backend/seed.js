const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

// Modelos
const User = require('./models/User');
const Product = require('./models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/SofiShop');
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar MongoDB', error);
    process.exit(1);
  }
};

const seedDB = async () => {
  try {
    // Limpiar datos existentes
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Base de datos limpiada');

    // Crear usuarios
    const usuarios = [
      {
        nombre: 'SofiShop Admin',
        email: 'compras.sofishop@gmail.com',
        password: await bcryptjs.hash('Sofia2022...', 10),
        rol: 'admin',
        emailVerified: true
      },
      {
        nombre: 'Delia Enríquez',
        email: 'deliaenriquez150305@gmail.com',
        password: await bcryptjs.hash('usuario123', 10),
        rol: 'cliente',
        emailVerified: true
      }
    ];

    const usuariosCreados = await User.insertMany(usuarios);
    console.log('✅ Usuarios creados:', usuariosCreados.length);

    // MUJER - 9 MARCAS x 10 PRODUCTOS = 90
    const productosM = [
      // CAROLINA HERRERA MUJER (10)
      { nombre: 'Good Girl', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Mujer', precio: 110, stock: 18, descripcion: 'Fragancia audaz y sofisticada', imagen: 'https://via.placeholder.com/280x280?text=Good+Girl' },
      { nombre: 'Very Good Girl', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Mujer', precio: 100, stock: 20, descripcion: 'Versión suave y romántica', imagen: 'https://via.placeholder.com/280x280?text=Very+Good+Girl' },
      { nombre: '212 NYC', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Mujer', precio: 95, stock: 17, descripcion: 'Clásico moderno y elegante', imagen: 'https://via.placeholder.com/280x280?text=212+NYC' },
      { nombre: 'Good Girl Blush', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Mujer', precio: 105, stock: 19, descripcion: 'Deseo sin límites', imagen: 'https://via.placeholder.com/280x280?text=Good+Girl+Blush' },
      { nombre: 'Good Girl Bowtastic', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Mujer', precio: 115, stock: 16, descripcion: 'Glamour absoluto', imagen: 'https://via.placeholder.com/280x280?text=Good+Girl+Bowtastic' },
      { nombre: 'CH Pasion', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Mujer', precio: 100, stock: 21, descripcion: 'Elegancia femenina', imagen: 'https://via.placeholder.com/280x280?text=CH+Pasion' },
      { nombre: 'La Bomba', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Mujer', precio: 110, stock: 19, descripcion: 'Heroísmo y valentía', imagen: 'https://via.placeholder.com/280x280?text=La+Bomba' },
      { nombre: '5212 VIP Rose', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Mujer', precio: 120, stock: 15, descripcion: 'Esencia del lujo', imagen: 'https://via.placeholder.com/280x280?text=5212+VIP+Rose' },
      { nombre: 'Carolina Herrera Elegante', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Mujer', precio: 105, stock: 18, descripcion: 'Elegancia suprema', imagen: 'https://via.placeholder.com/280x280?text=CH+Elegante' },
      { nombre: 'Carolina Herrera Classic', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Mujer', precio: 95, stock: 22, descripcion: 'El clásico atemporal', imagen: 'https://via.placeholder.com/280x280?text=CH+Classic' },
      // KATHY PERRY MUJER (10)
      { nombre: 'Meow', marca: 'Kathy Perry', categoria: 'perfumes', subcategoria: 'Mujer', precio: 75, stock: 25, descripcion: 'Fragancia dulce y seductora', imagen: 'https://via.placeholder.com/280x280?text=Meow' },
      { nombre: 'Purr', marca: 'Kathy Perry', categoria: 'perfumes', subcategoria: 'Mujer', precio: 75, stock: 20, descripcion: 'Aroma sensual y misterioso', imagen: 'https://via.placeholder.com/280x280?text=Purr' },
      { nombre: 'Killer Queen', marca: 'Kathy Perry', categoria: 'perfumes', subcategoria: 'Mujer', precio: 80, stock: 18, descripcion: 'Reina asesina', imagen: 'https://via.placeholder.com/300x300?text=Katty+Killer' },
      { nombre: 'Firework', marca: 'Kathy Perry', categoria: 'perfumes', subcategoria: 'Mujer', precio: 78, stock: 21, descripcion: 'Fuegos artificiales', imagen: 'https://via.placeholder.com/300x300?text=Katty+Firework' },
      { nombre: 'Roar', marca: 'Kathy Perry', categoria: 'perfumes', subcategoria: 'Mujer', precio: 76, stock: 23, descripcion: 'Rugido de poder', imagen: 'https://via.placeholder.com/300x300?text=Katty+Roar' },
      { nombre: 'Teenage Dream', marca: 'Kathy Perry', categoria: 'perfumes', subcategoria: 'Mujer', precio: 72, stock: 25, descripcion: 'Sueño adolescente', imagen: 'https://via.placeholder.com/300x300?text=Katty+Dream' },
      { nombre: 'Sensual', marca: 'Kathy Perry', categoria: 'perfumes', subcategoria: 'Mujer', precio: 77, stock: 22, descripcion: 'Sensualidad pura', imagen: 'https://via.placeholder.com/300x300?text=Katty+Sensual' },
      { nombre: 'Cosmic', marca: 'Kathy Perry', categoria: 'perfumes', subcategoria: 'Mujer', precio: 79, stock: 19, descripcion: 'Cosmético universal', imagen: 'https://via.placeholder.com/300x300?text=Katty+Cosmic' },
      { nombre: 'Divine', marca: 'Kathy Perry', categoria: 'perfumes', subcategoria: 'Mujer', precio: 81, stock: 17, descripcion: 'Divinidad femenina', imagen: 'https://via.placeholder.com/300x300?text=Katty+Divine' },
      { nombre: 'Midnight', marca: 'Kathy Perry', categoria: 'perfumes', subcategoria: 'Mujer', precio: 80, stock: 20, descripcion: 'Medianoche mágica', imagen: 'https://via.placeholder.com/300x300?text=Katty+Midnight' },
      // ARIANA GRANDE MUJER (10)
      { nombre: 'Cloud', marca: 'Ariana Grande', categoria: 'perfumes', subcategoria: 'Mujer', precio: 85, stock: 22, descripcion: 'Nube de felicidad', imagen: 'https://via.placeholder.com/280x280?text=Cloud' },
      { nombre: 'Cloud Pink', marca: 'Ariana Grande', categoria: 'perfumes', subcategoria: 'Mujer', precio: 88, stock: 20, descripcion: 'Nube rosa romántica', imagen: 'https://via.placeholder.com/280x280?text=Cloud+Pink' },
      { nombre: 'Cloud 2.0 Intense', marca: 'Ariana Grande', categoria: 'perfumes', subcategoria: 'Mujer', precio: 92, stock: 18, descripcion: 'Nube intensificada', imagen: 'https://via.placeholder.com/280x280?text=Cloud+2.0+Intense' },
      { nombre: 'God Is A Woman', marca: 'Ariana Grande', categoria: 'perfumes', subcategoria: 'Mujer', precio: 90, stock: 19, descripcion: 'Poder femenino', imagen: 'https://via.placeholder.com/280x280?text=God+Is+A+Woman' },
      { nombre: 'Mod Blush', marca: 'Ariana Grande', categoria: 'perfumes', subcategoria: 'Mujer', precio: 87, stock: 21, descripcion: 'Sonrojo moderno', imagen: 'https://via.placeholder.com/280x280?text=Mod+Blush' },
      { nombre: 'Mod Vanilla', marca: 'Ariana Grande', categoria: 'perfumes', subcategoria: 'Mujer', precio: 86, stock: 23, descripcion: 'Vainilla moderna', imagen: 'https://via.placeholder.com/280x280?text=Mod+Vanilla' },
      { nombre: 'R.E.M', marca: 'Ariana Grande', categoria: 'perfumes', subcategoria: 'Mujer', precio: 89, stock: 17, descripcion: 'Rápido movimiento de ojos', imagen: 'https://via.placeholder.com/280x280?text=R.E.M' },
      { nombre: 'Moonlight', marca: 'Ariana Grande', categoria: 'perfumes', subcategoria: 'Mujer', precio: 91, stock: 20, descripcion: 'Luz de luna', imagen: 'https://via.placeholder.com/280x280?text=Moonlight' },
      { nombre: 'Sweet Like Candy', marca: 'Ariana Grande', categoria: 'perfumes', subcategoria: 'Mujer', precio: 85, stock: 24, descripcion: 'Dulce como caramelo', imagen: 'https://via.placeholder.com/280x280?text=Sweet+Like+Candy' },
      { nombre: 'Cloud Body', marca: 'Ariana Grande', categoria: 'perfumes', subcategoria: 'Mujer', precio: 40, stock: 30, descripcion: 'Loción corporal nube', imagen: 'https://via.placeholder.com/280x280?text=Cloud+Body' },
      // BRITNEY SPEARS MUJER (10)
      { nombre: 'Toxic', marca: 'Britney Spears', categoria: 'perfumes', subcategoria: 'Mujer', precio: 70, stock: 23, descripcion: 'Fragancia atrevida y seductora', imagen: 'https://via.placeholder.com/300x300?text=Britney+Toxic' },
      { nombre: 'Circus', marca: 'Britney Spears', categoria: 'perfumes', subcategoria: 'Mujer', precio: 65, stock: 25, descripcion: 'Aroma circense y divertido', imagen: 'https://via.placeholder.com/300x300?text=Britney+Circus' },
      { nombre: 'Radiance', marca: 'Britney Spears', categoria: 'perfumes', subcategoria: 'Mujer', precio: 60, stock: 28, descripcion: 'Aroma brillante y radiante', imagen: 'https://via.placeholder.com/300x300?text=Britney+Radiance' },
      { nombre: 'Midnight Fantasy', marca: 'Britney Spears', categoria: 'perfumes', subcategoria: 'Mujer', precio: 68, stock: 22, descripcion: 'Fantasía nocturna oscura', imagen: 'https://via.placeholder.com/300x300?text=Britney+Midnight' },
      { nombre: 'Fantasy', marca: 'Britney Spears', categoria: 'perfumes', subcategoria: 'Mujer', precio: 65, stock: 24, descripcion: 'Fantasía pura', imagen: 'https://via.placeholder.com/300x300?text=Britney+Fantasy' },
      { nombre: 'Prerogative', marca: 'Britney Spears', categoria: 'perfumes', subcategoria: 'Mujer', precio: 62, stock: 26, descripcion: 'Derecho de la mujer', imagen: 'https://via.placeholder.com/300x300?text=Britney+Prerog' },
      { nombre: 'Oops', marca: 'Britney Spears', categoria: 'perfumes', subcategoria: 'Mujer', precio: 58, stock: 30, descripcion: '¡Oops, lo hice de nuevo!', imagen: 'https://via.placeholder.com/300x300?text=Britney+Oops' },
      { nombre: 'Glory', marca: 'Britney Spears', categoria: 'perfumes', subcategoria: 'Mujer', precio: 72, stock: 20, descripcion: 'Gloria y triunfo', imagen: 'https://via.placeholder.com/300x300?text=Britney+Glory' },
      { nombre: 'Curious', marca: 'Britney Spears', categoria: 'perfumes', subcategoria: 'Mujer', precio: 60, stock: 27, descripcion: 'Curiosidad intrigante', imagen: 'https://via.placeholder.com/300x300?text=Britney+Curious' },
      { nombre: 'Signature', marca: 'Britney Spears', categoria: 'perfumes', subcategoria: 'Mujer', precio: 75, stock: 19, descripcion: 'La firma de Britney', imagen: 'https://via.placeholder.com/300x300?text=Britney+Signature' },
      // CALVIN KLEIN MUJER (10)
      { nombre: 'Obsession Woman', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Mujer', precio: 100, stock: 19, descripcion: 'Obsesión femenina', imagen: 'https://via.placeholder.com/280x280?text=Obsession+Woman' },
      { nombre: 'Euphoria Woman', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Mujer', precio: 110, stock: 17, descripcion: 'Éxtasis para la mujer', imagen: 'https://via.placeholder.com/280x280?text=Euphoria+Woman' },
      { nombre: 'Eternity Woman', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Mujer', precio: 95, stock: 21, descripcion: 'Eternidad femenina', imagen: 'https://via.placeholder.com/280x280?text=Eternity+Woman' },
      { nombre: 'Be', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Mujer', precio: 92, stock: 20, descripcion: 'Sé auténtica', imagen: 'https://via.placeholder.com/300x300?text=CK+Be' },
      { nombre: 'Serenity', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Mujer', precio: 105, stock: 18, descripcion: 'Serenidad pura', imagen: 'https://via.placeholder.com/300x300?text=CK+Serenity' },
      { nombre: 'Escape Woman', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Mujer', precio: 88, stock: 22, descripcion: 'Escape femenino', imagen: 'https://via.placeholder.com/280x280?text=Escape+Woman' },
      { nombre: 'One', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Mujer', precio: 98, stock: 19, descripcion: 'El número uno', imagen: 'https://via.placeholder.com/280x280?text=CK+One' },
      { nombre: 'Moment', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Mujer', precio: 102, stock: 18, descripcion: 'El momento perfecto', imagen: 'https://via.placeholder.com/280x280?text=CK+Moment' },
      { nombre: 'Calvin Klein Bliss', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Mujer', precio: 96, stock: 20, descripcion: 'Dicha pura', imagen: 'https://via.placeholder.com/300x300?text=CK+Bliss' },
      { nombre: 'Calvin Klein Classic', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Mujer', precio: 94, stock: 21, descripcion: 'El clásico de CK', imagen: 'https://via.placeholder.com/280x280?text=CK+Classic' },
      // PARIS HILTON MUJER (10)
      { nombre: 'Paris Hilton Original', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Mujer', precio: 72, stock: 24, descripcion: 'Original y lujoso', imagen: 'https://via.placeholder.com/300x300?text=Paris+Original' },
      { nombre: 'Just Me', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Mujer', precio: 68, stock: 26, descripcion: 'Solo yo', imagen: 'https://via.placeholder.com/300x300?text=Paris+JustMe' },
      { nombre: 'Heiress', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Mujer', precio: 75, stock: 22, descripcion: 'Heredera de lujo', imagen: 'https://via.placeholder.com/300x300?text=Paris+Heiress' },
      { nombre: 'Siren', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Mujer', precio: 70, stock: 23, descripcion: 'Sirena seductora', imagen: 'https://via.placeholder.com/300x300?text=Paris+Siren' },
      { nombre: 'Love Always', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Mujer', precio: 69, stock: 25, descripcion: 'Amor siempre', imagen: 'https://via.placeholder.com/300x300?text=Paris+Love' },
      { nombre: 'Fairy Dust', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Mujer', precio: 71, stock: 24, descripcion: 'Polvo de hada', imagen: 'https://via.placeholder.com/300x300?text=Paris+Fairy' },
      { nombre: 'Bedazzled', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Mujer', precio: 73, stock: 21, descripcion: 'Brillante y deslumbrante', imagen: 'https://via.placeholder.com/300x300?text=Paris+Bedazzled' },
      { nombre: 'Infinite Radiance', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Mujer', precio: 76, stock: 20, descripcion: 'Radiancia infinita', imagen: 'https://via.placeholder.com/300x300?text=Paris+Radiance' },
      { nombre: 'Paris Hilton Gold', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Mujer', precio: 78, stock: 18, descripcion: 'Dorado y lujoso', imagen: 'https://via.placeholder.com/300x300?text=Paris+Gold' },
      { nombre: 'Paris Hilton Pink', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Mujer', precio: 74, stock: 22, descripcion: 'Rosa signature', imagen: 'https://via.placeholder.com/300x300?text=Paris+Pink' },
      // AFNAN MUJER (10)
      { nombre: 'Supremacy Pink', marca: 'Afnan', categoria: 'perfumes', subcategoria: 'Mujer', precio: 82, stock: 20, descripcion: 'Supremacía rosa', imagen: 'https://via.placeholder.com/300x300?text=Afnan+Pink' },
      { nombre: 'Noor Al Ain', marca: 'Afnan', categoria: 'perfumes', subcategoria: 'Mujer', precio: 80, stock: 22, descripcion: 'Luz de los ojos', imagen: 'https://via.placeholder.com/300x300?text=Afnan+Noor' },
      { nombre: 'Turathi', marca: 'Afnan', categoria: 'perfumes', subcategoria: 'Mujer', precio: 84, stock: 18, descripcion: 'Herencia oriental', imagen: 'https://via.placeholder.com/300x300?text=Afnan+Turathi' },
      { nombre: 'Mystique Musk', marca: 'Afnan', categoria: 'perfumes', subcategoria: 'Mujer', precio: 81, stock: 21, descripcion: 'Misterio musgo', imagen: 'https://via.placeholder.com/300x300?text=Afnan+Mystique' },
      { nombre: 'Orient Oud', marca: 'Afnan', categoria: 'perfumes', subcategoria: 'Mujer', precio: 85, stock: 19, descripcion: 'Oriente Oud', imagen: 'https://via.placeholder.com/300x300?text=Afnan+Oud' },
      { nombre: 'Emirati', marca: 'Afnan', categoria: 'perfumes', subcategoria: 'Mujer', precio: 83, stock: 20, descripcion: 'Esencia emiratí', imagen: 'https://via.placeholder.com/300x300?text=Afnan+Emirati' },
      { nombre: 'Shareef Eau de Parfum', marca: 'Afnan', categoria: 'perfumes', subcategoria: 'Mujer', precio: 86, stock: 17, descripcion: 'Noble y distinguido', imagen: 'https://via.placeholder.com/300x300?text=Afnan+Shareef' },
      { nombre: 'Precious Blend', marca: 'Afnan', categoria: 'perfumes', subcategoria: 'Mujer', precio: 88, stock: 16, descripcion: 'Mezcla preciosa', imagen: 'https://via.placeholder.com/300x300?text=Afnan+Precious' },
      { nombre: 'Fragrant Soul', marca: 'Afnan', categoria: 'perfumes', subcategoria: 'Mujer', precio: 87, stock: 18, descripcion: 'Alma fragrante', imagen: 'https://via.placeholder.com/300x300?text=Afnan+Soul' },
      { nombre: 'Royal Reserve', marca: 'Afnan', categoria: 'perfumes', subcategoria: 'Mujer', precio: 89, stock: 15, descripcion: 'Reserva real', imagen: 'https://via.placeholder.com/300x300?text=Afnan+Reserve' },
      // PACO RABANNE MUJER (10)
      { nombre: 'Olympéa', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Mujer', precio: 115, stock: 16, descripcion: 'Fragancia diosa griega', imagen: 'https://via.placeholder.com/300x300?text=Paco+Olympea' },
      { nombre: 'Bright Crystal', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Mujer', precio: 105, stock: 19, descripcion: 'Aroma cristalino y fresco', imagen: 'https://via.placeholder.com/300x300?text=Paco+Crystal' },
      { nombre: 'Daydream', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Mujer', precio: 110, stock: 17, descripcion: 'Sueño hecho perfume', imagen: 'https://via.placeholder.com/300x300?text=Paco+Daydream' },
      { nombre: 'Black XS', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Mujer', precio: 115, stock: 18, descripcion: 'Misterio oscuro y seductor', imagen: 'https://via.placeholder.com/300x300?text=Paco+Black' },
      { nombre: 'Amber', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Mujer', precio: 120, stock: 14, descripcion: 'Cálido y envolvente', imagen: 'https://via.placeholder.com/300x300?text=Paco+Amber' },
      { nombre: 'Phantom', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Mujer', precio: 112, stock: 17, descripcion: 'Espectro cautivador', imagen: 'https://via.placeholder.com/300x300?text=Paco+Phantom' },
      { nombre: 'Scandal', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Mujer', precio: 118, stock: 15, descripcion: 'Escándalo sensual', imagen: 'https://via.placeholder.com/300x300?text=Paco+Scandal' },
      { nombre: 'Fame', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Mujer', precio: 114, stock: 16, descripcion: 'Fama eterna', imagen: 'https://via.placeholder.com/300x300?text=Paco+Fame' },
      { nombre: 'Velvet', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Mujer', precio: 116, stock: 14, descripcion: 'Terciopelo suave', imagen: 'https://via.placeholder.com/300x300?text=Paco+Velvet' },
      { nombre: 'Roses', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Mujer', precio: 108, stock: 18, descripcion: 'Rosas románticas', imagen: 'https://via.placeholder.com/300x300?text=Paco+Roses' },
      // HUGO BOSS MUJER (10)
      { nombre: 'Boss Woman', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Mujer', precio: 98, stock: 20, descripcion: 'La mujer jefe', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Boss+Woman' },
      { nombre: 'Boss Femme', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Mujer', precio: 102, stock: 18, descripcion: 'Mujer poderosa', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Femme' },
      { nombre: 'Boss Nuit', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Mujer', precio: 105, stock: 17, descripcion: 'Noche elegante', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Nuit' },
      { nombre: 'Boss Orange', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Mujer', precio: 96, stock: 22, descripcion: 'Naranja fresco', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Orange' },
      { nombre: 'Boss Deep Red', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Mujer', precio: 104, stock: 19, descripcion: 'Rojo profundo', imagen: 'https://via.placeholder.com/300x300?text=Hugo+DeepRed' },
      { nombre: 'Boss Alive', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Mujer', precio: 100, stock: 21, descripcion: 'Viva y energética', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Alive' },
      { nombre: 'Boss Soul', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Mujer', precio: 103, stock: 18, descripcion: 'Alma femenina', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Soul' },
      { nombre: 'Boss Ruby', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Mujer', precio: 106, stock: 16, descripcion: 'Rubí precioso', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Ruby' },
      { nombre: 'Boss Jour', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Mujer', precio: 99, stock: 20, descripcion: 'Día de gloria', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Jour' },
      { nombre: 'Boss Essence', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Mujer', precio: 101, stock: 19, descripcion: 'Esencia de poder', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Essence' }
    ];

    // HOMBRE - 9 MARCAS x 10 PRODUCTOS = 90
    const productosH = [
      // BHARARA HOMBRE (10)
      { nombre: 'Oud for Glory', marca: 'Bharara', categoria: 'perfumes', subcategoria: 'Hombre', precio: 140, stock: 10, descripcion: 'Perfume oriental y profundo', imagen: 'https://via.placeholder.com/280x280?text=Bharara+Glory' },
      { nombre: 'Manhattan', marca: 'Bharara', categoria: 'perfumes', subcategoria: 'Hombre', precio: 125, stock: 14, descripcion: 'Aroma urbano y cosmopolita', imagen: 'https://via.placeholder.com/280x280?text=Bharara+Manhattan' },
      { nombre: 'Royal Essence', marca: 'Bharara', categoria: 'perfumes', subcategoria: 'Hombre', precio: 135, stock: 12, descripcion: 'Esencia real y noble', imagen: 'https://via.placeholder.com/280x280?text=Bharara+Royal' },
      { nombre: 'Heritage', marca: 'Bharara', categoria: 'perfumes', subcategoria: 'Hombre', precio: 130, stock: 13, descripcion: 'Herencia y tradición', imagen: 'https://via.placeholder.com/280x280?text=Bharara+Heritage' },
      { nombre: 'Sultan', marca: 'Bharara', categoria: 'perfumes', subcategoria: 'Hombre', precio: 145, stock: 9, descripcion: 'Poder del sultán', imagen: 'https://via.placeholder.com/280x280?text=Bharara+Sultan' },
      { nombre: 'Dynasty', marca: 'Bharara', categoria: 'perfumes', subcategoria: 'Hombre', precio: 150, stock: 8, descripcion: 'Dinastía y poder', imagen: 'https://via.placeholder.com/300x300?text=Bharara+Dynasty' },
      { nombre: 'Noble', marca: 'Bharara', categoria: 'perfumes', subcategoria: 'Hombre', precio: 138, stock: 11, descripcion: 'Nobleza sin igual', imagen: 'https://via.placeholder.com/300x300?text=Bharara+Noble' },
      { nombre: 'Phoenix', marca: 'Bharara', categoria: 'perfumes', subcategoria: 'Hombre', precio: 140, stock: 10, descripcion: 'Renacimiento y poder', imagen: 'https://via.placeholder.com/300x300?text=Bharara+Phoenix' },
      { nombre: 'Enigma', marca: 'Bharara', categoria: 'perfumes', subcategoria: 'Hombre', precio: 132, stock: 12, descripcion: 'Misterio envolvente', imagen: 'https://via.placeholder.com/300x300?text=Bharara+Enigma' },
      { nombre: 'Golden', marca: 'Bharara', categoria: 'perfumes', subcategoria: 'Hombre', precio: 142, stock: 11, descripcion: 'Lujo dorado', imagen: 'https://via.placeholder.com/300x300?text=Bharara+Golden' },
      // PACO RABANNE HOMBRE (10)
      { nombre: '1 Million', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Hombre', precio: 120, stock: 15, descripcion: 'Fragancia fresca y sensual para hombre', imagen: 'https://via.placeholder.com/280x280?text=Paco+Million' },
      { nombre: 'Phantom', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Hombre', precio: 135, stock: 12, descripcion: 'Perfume moderno y sofisticado', imagen: 'https://via.placeholder.com/300x300?text=Paco+Phantom' },
      { nombre: 'Invictus', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Hombre', precio: 110, stock: 18, descripcion: 'Aroma deportivo y energético', imagen: 'https://via.placeholder.com/280x280?text=Paco+Invictus' },
      { nombre: 'Xs Excess', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Hombre', precio: 100, stock: 20, descripcion: 'Fragancia intensa y aventurera', imagen: 'https://via.placeholder.com/280x280?text=Paco+Excess' },
      { nombre: 'Pour Homme', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Hombre', precio: 95, stock: 25, descripcion: 'Clásico elegante para hombre', imagen: 'https://via.placeholder.com/280x280?text=Paco+Homme' },
      { nombre: 'Rabanito', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Hombre', precio: 115, stock: 16, descripcion: 'Aroma pequeño pero poderoso', imagen: 'https://via.placeholder.com/280x280?text=Paco+Rabanito' },
      { nombre: 'Legacy', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Hombre', precio: 125, stock: 14, descripcion: 'Legado de elegancia', imagen: 'https://via.placeholder.com/300x300?text=Paco+Legacy' },
      { nombre: 'Scandal', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Hombre', precio: 118, stock: 15, descripcion: 'Escándalo masculino', imagen: 'https://via.placeholder.com/300x300?text=Paco+Scandal' },
      { nombre: 'Extreme', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Hombre', precio: 112, stock: 17, descripcion: 'Aroma extremo', imagen: 'https://via.placeholder.com/300x300?text=Paco+Extreme' },
      { nombre: 'Fuel', marca: 'Paco Rabanne', categoria: 'perfumes', subcategoria: 'Hombre', precio: 108, stock: 19, descripcion: 'Combustible de energía', imagen: 'https://via.placeholder.com/300x300?text=Paco+Fuel' },
      // HUGO BOSS HOMBRE (10)
      { nombre: 'Boss Bottled', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Hombre', precio: 100, stock: 20, descripcion: 'Clásico empresarial', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Bottled' },
      { nombre: 'Boss Dark Blue', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Hombre', precio: 95, stock: 22, descripcion: 'Azul oscuro sofisticado', imagen: 'https://via.placeholder.com/300x300?text=Hugo+DarkBlue' },
      { nombre: 'Boss Intense', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Hombre', precio: 105, stock: 18, descripcion: 'Intensidad ejecutiva', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Intense' },
      { nombre: 'Boss Soul', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Hombre', precio: 102, stock: 19, descripcion: 'Alma empresarial', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Soul' },
      { nombre: 'Boss Orange', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Hombre', precio: 98, stock: 21, descripcion: 'Naranja vibrante', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Orange' },
      { nombre: 'Boss The Scent', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Hombre', precio: 110, stock: 16, descripcion: 'La esencia del jefe', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Scent' },
      { nombre: 'Boss Jour', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Hombre', precio: 103, stock: 18, descripcion: 'Día de negocios', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Jour' },
      { nombre: 'Boss Nuit', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Hombre', precio: 108, stock: 17, descripcion: 'Noche elegante', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Nuit' },
      { nombre: 'Boss Absolute', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Hombre', precio: 112, stock: 15, descripcion: 'Poder absoluto', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Absolute' },
      { nombre: 'Boss Rebellion', marca: 'Hugo Boss', categoria: 'perfumes', subcategoria: 'Hombre', precio: 106, stock: 17, descripcion: 'Rebeldía ejecutiva', imagen: 'https://via.placeholder.com/300x300?text=Hugo+Rebellion' },
      // RALPH LAUREN HOMBRE (10)
      { nombre: 'Polo Blue', marca: 'Ralph Lauren', categoria: 'perfumes', subcategoria: 'Hombre', precio: 108, stock: 18, descripcion: 'Azul clásico de polo', imagen: 'https://via.placeholder.com/300x300?text=Ralph+Polo+Blue' },
      { nombre: 'Polo Black', marca: 'Ralph Lauren', categoria: 'perfumes', subcategoria: 'Hombre', precio: 110, stock: 16, descripcion: 'Negro sofisticado', imagen: 'https://via.placeholder.com/300x300?text=Ralph+Polo+Black' },
      { nombre: 'Polo Green', marca: 'Ralph Lauren', categoria: 'perfumes', subcategoria: 'Hombre', precio: 105, stock: 19, descripcion: 'Verde fresco', imagen: 'https://via.placeholder.com/300x300?text=Ralph+Polo+Green' },
      { nombre: 'Polo Red', marca: 'Ralph Lauren', categoria: 'perfumes', subcategoria: 'Hombre', precio: 112, stock: 15, descripcion: 'Rojo intenso', imagen: 'https://via.placeholder.com/300x300?text=Ralph+Polo+Red' },
      { nombre: 'Safari', marca: 'Ralph Lauren', categoria: 'perfumes', subcategoria: 'Hombre', precio: 115, stock: 14, descripcion: 'Safari aventurero', imagen: 'https://via.placeholder.com/300x300?text=Ralph+Safari' },
      { nombre: 'Chaps', marca: 'Ralph Lauren', categoria: 'perfumes', subcategoria: 'Hombre', precio: 98, stock: 22, descripcion: 'Clásico americano', imagen: 'https://via.placeholder.com/300x300?text=Ralph+Chaps' },
      { nombre: 'Rl67', marca: 'Ralph Lauren', categoria: 'perfumes', subcategoria: 'Hombre', precio: 102, stock: 20, descripcion: '1967, el año de la marca', imagen: 'https://via.placeholder.com/300x300?text=Ralph+RL67' },
      { nombre: 'Duchess', marca: 'Ralph Lauren', categoria: 'perfumes', subcategoria: 'Hombre', precio: 106, stock: 17, descripcion: 'Duquesa de lujo', imagen: 'https://via.placeholder.com/300x300?text=Ralph+Duchess' },
      { nombre: 'Ultra Male', marca: 'Ralph Lauren', categoria: 'perfumes', subcategoria: 'Hombre', precio: 114, stock: 13, descripcion: 'Ultra masculino', imagen: 'https://via.placeholder.com/300x300?text=Ralph+Ultra' },
      { nombre: 'Romance', marca: 'Ralph Lauren', categoria: 'perfumes', subcategoria: 'Hombre', precio: 111, stock: 14, descripcion: 'Romanticismo masculino', imagen: 'https://via.placeholder.com/300x300?text=Ralph+Romance' },
      // LATTAFA HOMBRE (10)
      { nombre: 'Opulent Oud', marca: 'Lattafa', categoria: 'perfumes', subcategoria: 'Hombre', precio: 85, stock: 25, descripcion: 'Oud opulento oriental', imagen: 'https://via.placeholder.com/300x300?text=Lattafa+Oud' },
      { nombre: 'Qalaat', marca: 'Lattafa', categoria: 'perfumes', subcategoria: 'Hombre', precio: 80, stock: 28, descripcion: 'Castillo de tradición', imagen: 'https://via.placeholder.com/300x300?text=Lattafa+Qalaat' },
      { nombre: 'Ashaar', marca: 'Lattafa', categoria: 'perfumes', subcategoria: 'Hombre', precio: 82, stock: 26, descripcion: 'Poesía en botella', imagen: 'https://via.placeholder.com/300x300?text=Lattafa+Ashaar' },
      { nombre: 'Khamrah', marca: 'Lattafa', categoria: 'perfumes', subcategoria: 'Hombre', precio: 88, stock: 22, descripcion: 'Elixir dorado', imagen: 'https://via.placeholder.com/300x300?text=Lattafa+Khamrah' },
      { nombre: 'Badee Al Oud', marca: 'Lattafa', categoria: 'perfumes', subcategoria: 'Hombre', precio: 90, stock: 20, descripcion: 'Oud magnificente', imagen: 'https://via.placeholder.com/300x300?text=Lattafa+Badee' },
      { nombre: 'Amira', marca: 'Lattafa', categoria: 'perfumes', subcategoria: 'Hombre', precio: 79, stock: 30, descripcion: 'Princesa del desierto', imagen: 'https://via.placeholder.com/300x300?text=Lattafa+Amira' },
      { nombre: 'Kalimat', marca: 'Lattafa', categoria: 'perfumes', subcategoria: 'Hombre', precio: 81, stock: 27, descripcion: 'Palabra de poder', imagen: 'https://via.placeholder.com/300x300?text=Lattafa+Kalimat' },
      { nombre: 'Raghba', marca: 'Lattafa', categoria: 'perfumes', subcategoria: 'Hombre', precio: 86, stock: 23, descripcion: 'Deseo ardiente', imagen: 'https://via.placeholder.com/300x300?text=Lattafa+Raghba' },
      { nombre: 'Atoor Al Oud', marca: 'Lattafa', categoria: 'perfumes', subcategoria: 'Hombre', precio: 92, stock: 18, descripcion: 'Esencia del Oud', imagen: 'https://via.placeholder.com/300x300?text=Lattafa+Atoor' },
      { nombre: 'Dirham', marca: 'Lattafa', categoria: 'perfumes', subcategoria: 'Hombre', precio: 78, stock: 32, descripcion: 'Moneda de lujo', imagen: 'https://via.placeholder.com/300x300?text=Lattafa+Dirham' },
      // PARIS HILTON HOMBRE (10)
      { nombre: 'Paris for Men', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Hombre', precio: 72, stock: 26, descripcion: 'París para el hombre moderno', imagen: 'https://via.placeholder.com/300x300?text=Paris+Men' },
      { nombre: 'Just Me Homme', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Hombre', precio: 68, stock: 28, descripcion: 'Solo yo, versión hombre', imagen: 'https://via.placeholder.com/300x300?text=Paris+JustMe' },
      { nombre: 'Heir', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Hombre', precio: 75, stock: 24, descripcion: 'Heredero de fortuna', imagen: 'https://via.placeholder.com/300x300?text=Paris+Heir' },
      { nombre: 'Love Always Homme', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Hombre', precio: 69, stock: 27, descripcion: 'Amor siempre para él', imagen: 'https://via.placeholder.com/300x300?text=Paris+LoveH' },
      { nombre: 'Gold Homme', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Hombre', precio: 77, stock: 21, descripcion: 'Dorado y lujoso para hombre', imagen: 'https://via.placeholder.com/300x300?text=Paris+GoldH' },
      { nombre: 'Platinum', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Hombre', precio: 78, stock: 20, descripcion: 'Platino puro', imagen: 'https://via.placeholder.com/300x300?text=Paris+Platinum' },
      { nombre: 'Celeste Homme', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Hombre', precio: 73, stock: 23, descripcion: 'Celestial para hombre', imagen: 'https://via.placeholder.com/300x300?text=Paris+Celeste' },
      { nombre: 'Diamond', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Hombre', precio: 76, stock: 22, descripcion: 'Diamante precioso', imagen: 'https://via.placeholder.com/300x300?text=Paris+Diamond' },
      { nombre: 'Silver Homme', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Hombre', precio: 71, stock: 25, descripcion: 'Plata brillante', imagen: 'https://via.placeholder.com/300x300?text=Paris+Silver' },
      { nombre: 'Paris Legend', marca: 'Paris Hilton', categoria: 'perfumes', subcategoria: 'Hombre', precio: 79, stock: 19, descripcion: 'Leyenda de París', imagen: 'https://via.placeholder.com/300x300?text=Paris+Legend' },
      // CALVIN KLEIN HOMBRE (10)
      { nombre: 'Obsession', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Hombre', precio: 95, stock: 20, descripcion: 'Perfume clásico y sofisticado', imagen: 'https://via.placeholder.com/300x300?text=CK+Obsession' },
      { nombre: 'Euphoria', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Hombre', precio: 105, stock: 16, descripcion: 'Fragancia intensa y cautivadora', imagen: 'https://via.placeholder.com/300x300?text=CK+Euphoria' },
      { nombre: 'Escape', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Hombre', precio: 85, stock: 22, descripcion: 'Aroma fresco y aventurero', imagen: 'https://via.placeholder.com/300x300?text=CK+Escape' },
      { nombre: 'Eternity', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Hombre', precio: 90, stock: 24, descripcion: 'Eternidad en una botella', imagen: 'https://via.placeholder.com/300x300?text=CK+Eternity' },
      { nombre: 'Intense', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Hombre', precio: 100, stock: 18, descripcion: 'Intensidad pura y directa', imagen: 'https://via.placeholder.com/300x300?text=CK+Intense' },
      { nombre: 'One', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Hombre', precio: 88, stock: 22, descripcion: 'El número uno', imagen: 'https://via.placeholder.com/300x300?text=CK+One' },
      { nombre: 'In2U', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Hombre', precio: 92, stock: 20, descripcion: 'En ti', imagen: 'https://via.placeholder.com/300x300?text=CK+In2U' },
      { nombre: 'Moment', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Hombre', precio: 98, stock: 19, descripcion: 'El momento perfecto', imagen: 'https://via.placeholder.com/300x300?text=CK+Moment' },
      { nombre: 'Blue', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Hombre', precio: 94, stock: 21, descripcion: 'Azul calmante', imagen: 'https://via.placeholder.com/300x300?text=CK+Blue' },
      { nombre: 'Reverence', marca: 'Calvin Klein', categoria: 'perfumes', subcategoria: 'Hombre', precio: 102, stock: 17, descripcion: 'Reverencia y respeto', imagen: 'https://via.placeholder.com/300x300?text=CK+Reverence' },
      // GUCCI HOMBRE (10)
      { nombre: 'Gucci Guilty', marca: 'Gucci', categoria: 'perfumes', subcategoria: 'Hombre', precio: 125, stock: 14, descripcion: 'Culpable y seductor', imagen: 'https://via.placeholder.com/300x300?text=Gucci+Guilty' },
      { nombre: 'Made to Measure', marca: 'Gucci', categoria: 'perfumes', subcategoria: 'Hombre', precio: 130, stock: 12, descripcion: 'Hecho a medida', imagen: 'https://via.placeholder.com/300x300?text=Gucci+Measure' },
      { nombre: 'Intense Oud', marca: 'Gucci', categoria: 'perfumes', subcategoria: 'Hombre', precio: 140, stock: 10, descripcion: 'Oud intenso oriental', imagen: 'https://via.placeholder.com/300x300?text=Gucci+Oud' },
      { nombre: 'Flora', marca: 'Gucci', categoria: 'perfumes', subcategoria: 'Hombre', precio: 115, stock: 16, descripcion: 'Floral elegante', imagen: 'https://via.placeholder.com/300x300?text=Gucci+Flora' },
      { nombre: 'Bamboo', marca: 'Gucci', categoria: 'perfumes', subcategoria: 'Hombre', precio: 120, stock: 15, descripcion: 'Bambú fresco', imagen: 'https://via.placeholder.com/300x300?text=Gucci+Bamboo' },
      { nombre: 'Pour Homme', marca: 'Gucci', categoria: 'perfumes', subcategoria: 'Hombre', precio: 110, stock: 18, descripcion: 'Para el hombre', imagen: 'https://via.placeholder.com/300x300?text=Gucci+Homme' },
      { nombre: 'Envy', marca: 'Gucci', categoria: 'perfumes', subcategoria: 'Hombre', precio: 105, stock: 20, descripcion: 'Envidia deseable', imagen: 'https://via.placeholder.com/300x300?text=Gucci+Envy' },
      { nombre: 'Absolute', marca: 'Gucci', categoria: 'perfumes', subcategoria: 'Hombre', precio: 128, stock: 13, descripcion: 'Absoluto y potente', imagen: 'https://via.placeholder.com/300x300?text=Gucci+Absolute' },
      { nombre: 'Presentation', marca: 'Gucci', categoria: 'perfumes', subcategoria: 'Hombre', precio: 118, stock: 15, descripcion: 'Presentación distinguida', imagen: 'https://via.placeholder.com/300x300?text=Gucci+Present' },
      { nombre: 'Heritage', marca: 'Gucci', categoria: 'perfumes', subcategoria: 'Hombre', precio: 135, stock: 11, descripcion: 'Herencia de lujo', imagen: 'https://via.placeholder.com/300x300?text=Gucci+Heritage' },
      // CAROLINA HERRERA HOMBRE (10)
      { nombre: 'for Men', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Hombre', precio: 100, stock: 21, descripcion: 'Elegancia masculina', imagen: 'https://via.placeholder.com/300x300?text=CH+Men' },
      { nombre: 'Hero', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Hombre', precio: 120, stock: 15, descripcion: 'Heroísmo y valentía', imagen: 'https://via.placeholder.com/300x300?text=CH+Hero' },
      { nombre: 'Essence', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Hombre', precio: 110, stock: 19, descripcion: 'La esencia del hombre', imagen: 'https://via.placeholder.com/300x300?text=CH+Essence' },
      { nombre: 'Legacy', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Hombre', precio: 125, stock: 14, descripcion: 'Legado de elegancia', imagen: 'https://via.placeholder.com/300x300?text=CH+Legacy' },
      { nombre: 'Gentleman', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Hombre', precio: 115, stock: 17, descripcion: 'Caballero distinguido', imagen: 'https://via.placeholder.com/300x300?text=CH+Gentleman' },
      { nombre: 'Invierno', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Hombre', precio: 105, stock: 20, descripcion: 'Frío invernal', imagen: 'https://via.placeholder.com/300x300?text=CH+Winter' },
      { nombre: 'Verano', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Hombre', precio: 105, stock: 20, descripcion: 'Calor estival', imagen: 'https://via.placeholder.com/300x300?text=CH+Summer' },
      { nombre: 'Intenso', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Hombre', precio: 112, stock: 16, descripcion: 'Intensidad pura', imagen: 'https://via.placeholder.com/300x300?text=CH+Intenso' },
      { nombre: 'Clásico', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Hombre', precio: 98, stock: 22, descripcion: 'El clásico de CH', imagen: 'https://via.placeholder.com/300x300?text=CH+Classic' },
      { nombre: 'Moderno', marca: 'Carolina Herrera', categoria: 'perfumes', subcategoria: 'Hombre', precio: 108, stock: 18, descripcion: 'Modernidad refinada', imagen: 'https://via.placeholder.com/300x300?text=CH+Modern' }
    ];

    const todosLosProductos = [...productosM, ...productosH];
    const productosCreados = await Product.insertMany(todosLosProductos);
    console.log('✅ Productos creados:', productosCreados.length);

    console.log('\n✨ Base de datos poblada exitosamente');
    console.log('\n📝 Credenciales:');
    console.log('   👑 ADMIN:');
    console.log('   📧 Email: compras.sofishop@gmail.com');
    console.log('   🔑 Password: Sofia2022...');
    console.log('\n   👤 USUARIO:');
    console.log('   📧 Email: deliaenriquez150305@gmail.com');
    console.log('   🔑 Password: usuario123');
    
    console.log('\n📊 Estadísticas:');
    const mujer = await Product.countDocuments({subcategoria: 'Mujer'});
    const hombre = await Product.countDocuments({subcategoria: 'Hombre'});
    console.log('   👗 Mujer:', mujer);
    console.log('   👔 Hombre:', hombre);
    console.log('   📦 Total:', mujer + hombre);

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConexión cerrada');
    process.exit(0);
  }
};

connectDB().then(() => seedDB());
