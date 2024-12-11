const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Rutas públicas
router.post('/register', register); // Registro de usuarios
router.post('/login', login); // Inicio de sesión

// Rutas protegidas
router.get('/profile', protect, getProfile); // Obtener perfil de usuario, requiere autenticación

module.exports = router;
