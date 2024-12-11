// routes/product.routes.jsx
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const isAdmin = require("../middleware/admin");

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProduct);

// Rutas protegidas (solo administradores)
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;