// Configuración global de la aplicación
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://sofishop-21.onrender.com';

// Función para obtener URL correcta de imagen (manejando espacios)
function getImageUrl(imagePath) {
  if (!imagePath) return 'https://via.placeholder.com/280x280?text=Perfume';
  if (imagePath.startsWith('http')) return imagePath;
  // Reemplazar espacios por %20 para URLs
  const encodedPath = imagePath.replace(/ /g, '%20');
  return `${API_URL}/${encodedPath}`;
}
