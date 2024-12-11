const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Importar rutas
const userRoutes = require('./routes/user.routes');

// Inicializar express
const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde diferentes dominios
app.use(morgan('dev')); // Registro de solicitudes HTTP
app.use(express.json()); // Parsear cuerpos JSON
app.use(express.urlencoded({ extended: true })); // Parsear cuerpos URL-encoded

// Rutas
app.use('/api/users', userRoutes); // Rutas relacionadas con usuarios

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack); // Registrar el error en la consola
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    }); // Enviar respuesta de error al cliente
});

// Conexión a la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Conexión a MongoDB usando la URI de entorno
        console.log('MongoDB conectado exitosamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message); // Registrar errores de conexión
        process.exit(1); // Finalizar el proceso si no se puede conectar
    }
};

// Inicializar el servidor
const PORT = process.env.PORT || 5000; // Puerto del servidor desde variable de entorno o por defecto 5000
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`); // Confirmar que el servidor está activo
    });
});
