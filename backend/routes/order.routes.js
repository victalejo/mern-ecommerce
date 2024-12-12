const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus  // Añadir este controlador
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

// Rutas existentes
router.use(protect);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);

// Nueva ruta para actualizar el estado
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

module.exports = router;