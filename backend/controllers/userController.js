const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/default');

// Función para generar un token JWT para un usuario
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwtSecret, {
        expiresIn: '30d' // El token será válido por 30 días
    });
};

// Endpoint para registrar un usuario
exports.register = async (req, res) => {
    try {
        const { name, email, password, address } = req.body; // Extraer datos del usuario del cuerpo de la solicitud

        // Verificar si el usuario ya existe buscando por correo
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ // Retornar error si el correo ya está registrado
                success: false,
                message: 'El usuario ya existe'
            });
        }

        // Crear un nuevo usuario con los datos proporcionados
        const user = await User.create({
            name,
            email,
            password,
            address
        });

        // Generar un token JWT para el nuevo usuario
        const token = generateToken(user._id);

        // Enviar respuesta con el usuario creado y el token
        res.status(201).json({
            success: true,
            data: user,
            token
        });
    } catch (error) {
        // Manejar errores durante el registro
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Endpoint para iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // Extraer correo y contraseña del cuerpo de la solicitud

        // Verificar si el usuario existe en la base de datos
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ // Retornar error si el correo no está registrado
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si la contraseña proporcionada coincide con la almacenada
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ // Retornar error si las contraseñas no coinciden
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar un token JWT para el usuario autenticado
        const token = generateToken(user._id);

        // Enviar respuesta con los datos del usuario y el token
        res.json({
            success: true,
            data: user,
            token
        });
    } catch (error) {
        // Manejar errores durante el inicio de sesión
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Endpoint para obtener el perfil del usuario
exports.getProfile = async (req, res) => {
    try {
        // Obtener datos del usuario utilizando el ID del usuario autenticado
        const user = await User.findById(req.user.id);

        // Enviar los datos del usuario como respuesta
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        // Manejar errores al obtener el perfil
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
