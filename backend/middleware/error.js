// middleware/error.js

// Clase personalizada para errores de la API
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log del error para desarrollo
    console.error(err);

    // Errores de Mongoose - ID inválido
    if (err.name === 'CastError') {
        const message = 'Recurso no encontrado';
        error = new ErrorResponse(message, 404);
    }

    // Errores de Mongoose - Campos duplicados
    if (err.code === 11000) {
        const message = 'Valor duplicado ingresado';
        error = new ErrorResponse(message, 400);
    }

    // Errores de Mongoose - Validación
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Error del servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = {
    ErrorResponse,
    errorHandler
};