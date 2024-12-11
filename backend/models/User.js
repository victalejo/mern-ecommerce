const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definición del esquema para la colección de usuarios
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un correo válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    }
}, {
    timestamps: true
});

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar la contraseña ingresada con la almacenada
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Método para eliminar la contraseña del objeto JSON al enviarlo como respuesta
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Exporta el modelo de usuario basado en el esquema definido
module.exports = mongoose.model('User', userSchema);
