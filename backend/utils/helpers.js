// utils/helpers.js

// Función para generar un código único para las órdenes
const generateOrderCode = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
};

// Función para calcular el total de una orden o carrito
const calculateTotal = (items) => {
    return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

// Función para validar campos requeridos
const validateRequiredFields = (object, requiredFields) => {
    const missingFields = [];

    requiredFields.forEach(field => {
        if (!object[field]) {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
    }

    return true;
};

// Función para formatear precios
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

// Función para validar un email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Función para sanitizar datos de entrada
const sanitizeInput = (data) => {
    if (typeof data !== 'object') return data;

    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            sanitized[key] = value.trim();
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};

// Función para paginar resultados
const paginateResults = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return {
        skip,
        limit: parseInt(limit)
    };
};

// Función para construir un objeto de filtros para consultas
const buildQueryFilters = (queryParams) => {
    const filters = {};

    // Eliminar campos especiales de query
    const { page, limit, sort, ...params } = queryParams;

    // Construir filtros básicos
    Object.keys(params).forEach(key => {
        if (params[key]) {
            filters[key] = params[key];
        }
    });

    return filters;
};

module.exports = {
    generateOrderCode,
    calculateTotal,
    validateRequiredFields,
    formatPrice,
    isValidEmail,
    sanitizeInput,
    paginateResults,
    buildQueryFilters
};