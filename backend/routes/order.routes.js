const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Todas las rutas de órdenes requieren autenticación
router.use(protect);

// Rutas para órdenes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);

module.exports = router;