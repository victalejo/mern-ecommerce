// routes/product.routes.js
const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const isAdmin = require("../middleware/admin");
const upload = require('../middleware/upload');

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/search', searchProducts);

// Rutas protegidas (solo administradores)
router.post('/', protect, isAdmin, upload.single('image'), createProduct);
router.put('/:id', protect, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;