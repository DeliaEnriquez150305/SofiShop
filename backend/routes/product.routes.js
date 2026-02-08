const express = require('express');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configurar multer para subir imágenes
const uploadDir = path.join(__dirname, '../../frontend/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // carpeta para imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const { categoria } = req.query;
  let query = {};
  if (categoria) {
    query.categoria = categoria;
  }
  const products = await Product.find(query);
  const baseUrl = process.env.BACKEND_URL || 'https://sofishop-21.onrender.com';
  const normalizeImage = (img) => {
    if (!img) return img;
    if (img.startsWith('http://localhost:3000')) return img.replace('http://localhost:3000', baseUrl);
    if (img.startsWith('https://localhost:3000')) return img.replace('https://localhost:3000', baseUrl);
    if (img.startsWith('http')) return img;
    if (!img.includes('/')) return `${baseUrl}/uploads/${img}`;
    return `${baseUrl}/${encodeURI(img)}`;
  };
  const normalized = products.map(p => ({
    ...p.toObject(),
    imagen: normalizeImage(p.imagen)
  }));
  res.json(normalized);
});

router.post('/', upload.single('imagen'), async (req, res) => {
  const { nombre, precio, stock, categoria, subcategoria, marca } = req.body;
  const imagen = req.file ? req.file.filename : '';
  const product = new Product({ nombre, precio, stock, categoria, subcategoria, marca, imagen });
  await product.save();
  res.json({ mensaje: 'Producto agregado' });
});

router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Producto eliminado' });
});

// Actualizar producto (incluye imagen opcional)
router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const allowed = ['nombre', 'precio', 'stock', 'categoria', 'subcategoria', 'marca'];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];

    const productActual = await Product.findById(req.params.id);
    if (!productActual) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    if (req.file) {
      update.imagen = req.file.filename;
      if (productActual.imagen && !productActual.imagen.startsWith('http')) {
        const oldPath = path.join(uploadDir, productActual.imagen);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error actualizando', error: err.message });
  }
});

// Calificar producto (1..5)
router.post('/:id/rate', async (req, res) => {
  try {
    let { value } = req.body;
    value = Number(value);
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ mensaje: 'Valor de calificación inválido' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    const currentAvg = Number(product.rating || 0);
    const currentCount = Number(product.ratingCount || 0);
    const newAvg = ((currentAvg * currentCount) + value) / (currentCount + 1);
    product.rating = Math.round(newAvg * 10) / 10; // una cifra decimal
    product.ratingCount = currentCount + 1;
    await product.save();
    res.json({ rating: product.rating, ratingCount: product.ratingCount });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error calificando', error: err.message });
  }
});

module.exports = router;   // 👈 OBLIGATORIO
