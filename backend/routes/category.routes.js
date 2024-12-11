// routes/category.routes.js
const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const isAdmin = require("../middleware/admin");

// Ruta pública para obtener categorías
router.get('/', getCategories);

// Rutas protegidas (solo administradores)
router.post('/', protect, isAdmin, createCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;