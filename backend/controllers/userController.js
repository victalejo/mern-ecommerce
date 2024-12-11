// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/default');
const { validateUser } = require('../utils/validation');
const { ErrorResponse } = require('../middleware/error');
const { sanitizeInput } = require('../utils/helpers');

// Función para generar token JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwtSecret, {
        expiresIn: '30d'
    });
};

// Registrar usuario
exports.register = async (req, res, next) => {
    try {
        // Validar datos de entrada
        const { errors, isValid } = validateUser(req.body);
        if (!isValid) {
            throw new ErrorResponse('Datos de usuario inválidos', 400, errors);
        }

        // Sanitizar datos de entrada
        const sanitizedData = sanitizeInput(req.body);

        // Verificar si el usuario existe
        const userExists = await User.findOne({ email: sanitizedData.email });
        if (userExists) {
            throw new ErrorResponse('El usuario ya existe', 400);
        }

        // Crear usuario
        const user = await User.create({
            name: sanitizedData.name,
            email: sanitizedData.email,
            password: sanitizedData.password,
            address: sanitizedData.address
        });

        // Generar token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: user,
            token
        });
    } catch (error) {
        next(error);
    }
};

// Login de usuario
exports.login = async (req, res, next) => {
    try {
        const { email, password } = sanitizeInput(req.body);

        // Validar campos requeridos
        if (!email || !password) {
            throw new ErrorResponse('Por favor proporcione email y contraseña', 400);
        }

        // Buscar usuario
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ErrorResponse('Credenciales inválidas', 401);
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ErrorResponse('Credenciales inválidas', 401);
        }

        // Generar token
        const token = generateToken(user._id);

        // Remover contraseña de la respuesta
        user.password = undefined;

        res.status(200).json({
            success: true,
            data: user,
            token
        });
    } catch (error) {
        next(error);
    }
};

// Obtener perfil
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new ErrorResponse('Usuario no encontrado', 404);
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar perfil
exports.updateProfile = async (req, res, next) => {
    try {
        const sanitizedData = sanitizeInput(req.body);

        // Prevenir actualización de contraseña por esta ruta
        if (sanitizedData.password) {
            throw new ErrorResponse('Esta ruta no es para actualizar contraseña', 400);
        }

        // Validar datos de actualización
        const { errors, isValid } = validateUser({
            ...sanitizedData,
            password: 'dummypass' // Para pasar la validación
        });

        if (!isValid) {
            throw new ErrorResponse('Datos de actualización inválidos', 400, errors);
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                name: sanitizedData.name,
                email: sanitizedData.email,
                address: sanitizedData.address
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Cambiar contraseña
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = sanitizeInput(req.body);

        if (!currentPassword || !newPassword) {
            throw new ErrorResponse('Por favor proporcione la contraseña actual y la nueva', 400);
        }

        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            throw new ErrorResponse('Usuario no encontrado', 404);
        }

        // Verificar contraseña actual
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            throw new ErrorResponse('Contraseña actual incorrecta', 401);
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        next(error);
    }
};