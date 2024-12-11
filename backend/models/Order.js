const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
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

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    status: {
        type: String,
        enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    paymentMethod: {
        type: String,
        required: [true, 'El método de pago es requerido'],
        enum: ['tarjeta', 'efectivo', 'transferencia']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);