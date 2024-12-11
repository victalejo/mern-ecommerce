// models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'El producto es requerido']
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad es requerida'],
        min: [1, 'La cantidad mínima es 1']
    },
    price: {
        type: Number,
        required: [true, 'El precio es requerido']
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware para calcular el total antes de guardar
cartSchema.pre('save', function(next) {
    this.total = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    next();
});

module.exports = mongoose.model('Cart', cartSchema);