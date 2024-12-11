// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es requerido'],
        unique: true,
        trim: true,
        maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
    },
    description: {
        type: String,
        maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);