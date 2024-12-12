// utils/validation.js

// Validaciones para usuario
const validateUser = (data) => {
    const errors = {};

    // Validar nombre
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.email = 'Email inválido';
    }

    // Validar contraseña
    if (!data.password || data.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

// Validaciones para producto
const validateProduct = (data) => {
    const errors = {};

    // Validar nombre
    if (!data.name || data.name.trim().length < 3) {
        errors.name = 'El nombre del producto debe tener al menos 3 caracteres';
    }

    // Validar descripción
    if (!data.description || data.description.trim().length < 10) {
        errors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    // Validar precio
    if (!data.price || isNaN(data.price) || data.price <= 0) {
        errors.price = 'El precio debe ser un número mayor a 0';
    }

    // Validar stock
    if (!data.stock || isNaN(data.stock) || data.stock < 0) {
        errors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    // Validar categoría
    if (!data.category) {
        errors.category = 'La categoría es requerida';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};


// Validaciones para orden
const validateOrder = (data) => {
    const errors = {};

    // Validar dirección de envío
    if (!data.shippingAddress) {
        errors.shippingAddress = 'La dirección de envío es requerida';
    } else {
        if (!data.shippingAddress.street) {
            errors.street = 'La calle es requerida';
        }
        if (!data.shippingAddress.city) {
            errors.city = 'La ciudad es requerida';
        }
        if (!data.shippingAddress.zipCode) {
            errors.zipCode = 'El código postal es requerido';
        }
    }

    // Validar método de pago
    const validPaymentMethods = ['tarjeta', 'efectivo', 'transferencia'];
    if (!data.paymentMethod || !validPaymentMethods.includes(data.paymentMethod)) {
        errors.paymentMethod = 'Método de pago inválido';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

// Validaciones para categoría
const validateCategory = (data) => {
    const errors = {};

    // Validar nombre
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'El nombre de la categoría debe tener al menos 2 caracteres';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

// Validaciones para items del carrito
const validateCartItem = (data) => {
    const errors = {};

    // Validar ID del producto
    if (!data.productId) {
        errors.productId = 'El ID del producto es requerido';
    }

    // Validar cantidad
    if (!data.quantity || isNaN(data.quantity) || data.quantity < 1) {
        errors.quantity = 'La cantidad debe ser un número mayor a 0';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

module.exports = {
    validateUser,
    validateProduct,
    validateOrder,
    validateCategory,
    validateCartItem
};