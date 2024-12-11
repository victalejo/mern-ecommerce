const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true,
        maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción del producto es requerida'],
        maxlength: [2000, 'La descripción no puede tener más de 2000 caracteres']
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    image: {
        type: String,
        required: [true, 'La imagen del producto es requerida']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La categoría del producto es requerida']
    },
    stock: {
        type: Number,
        required: [true, 'El stock del producto es requerido'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true // Agrega automáticamente createdAt y updatedAt
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
