// src/utils/imageHelper.js

// Función para construir la URL completa de la imagen
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-product.png';
    // Remover /api/ si está presente en la ruta de la imagen
    const cleanPath = imagePath.replace('/api/', '/');
    return `${import.meta.env.VITE_API_URL_IMG}${cleanPath}`;
};