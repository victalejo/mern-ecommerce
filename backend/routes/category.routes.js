// routes/category.routes.js
const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

// Ruta pública para obtener categorías
router.get('/', getCategories);

// Rutas protegidas (solo administradores)
router.post('/', protect, authorize('admin'), createCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;