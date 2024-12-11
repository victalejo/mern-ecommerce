const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/default');

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
    let token;

    // Verificar si hay un token en los encabezados de autorización
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]; // Extraer el token del encabezado
    }

    if (!token) {
        return res.status(401).json({ // Retornar error si no hay token
            success: false,
            message: 'No autorizado para acceder a esta ruta'
        });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Agregar el usuario al objeto de la solicitud
        req.user = await User.findById(decoded.id);
        next(); // Continuar al siguiente middleware o controlador
    } catch (error) {
        return res.status(401).json({ // Retornar error si el token no es válido
            success: false,
            message: 'No autorizado para acceder a esta ruta'
        });
    }
};

// Middleware para autorizar roles específicos
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ // Retornar error si el rol del usuario no está permitido
                success: false,
                message: 'No tiene permiso para realizar esta acción'
            });
        }
        next(); // Continuar al siguiente middleware o controlador
    };
};
