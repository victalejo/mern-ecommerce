// routes/cart.routes.jsx
const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCart,
    removeFromCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// Todas las rutas del carrito requieren autenticación
router.use(protect);

router.post('/', addToCart);
router.get('/', getCart);
router.delete('/:productId', removeFromCart);

module.exports = router;