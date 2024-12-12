const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error');
require('dotenv').config();

// Importar rutas
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const statsRoutes = require('./routes/stats.routes');

// Inicializar express
const app = express();

// Asegurar que el directorio de uploads existe
const uploadDir = path.join(__dirname, 'uploads/products');
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://tudominio.com']
        : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Headers de seguridad adicionales
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    }
    next();
});

// Configurar middleware para archivos estáticos
// Importante: esto debe ir ANTES de las rutas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// Ruta base para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de E-commerce funcionando correctamente'
    });
});

// Middleware para manejar errores de multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'El archivo es demasiado grande. Máximo 5MB permitidos.'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Error al subir el archivo: ' + err.message
        });
    } else if (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
    next();
});

// Middleware para rutas no encontradas
app.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.statusCode = 404;
    next(error);
});

// Middleware de manejo de errores personalizado
app.use(errorHandler);

// Configuración del servidor
const PORT = process.env.PORT || 5000;
let server;

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Conectar a la base de datos
        await connectDB();

        // Iniciar el servidor
        server = app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
            console.log(`Ambiente: ${process.env.NODE_ENV}`);
            console.log(`Directorio de uploads: ${uploadDir}`);
        });

        // Manejar errores del servidor
        server.on('error', (error) => {
            console.error('Error en el servidor:', error);
            process.exit(1);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Iniciar el servidor
startServer();

// Manejo de señales y errores
const gracefulShutdown = async () => {
    console.log('Iniciando apagado graceful...');
    if (server) {
        await server.close();
        console.log('Servidor cerrado');
        await mongoose.connection.close(false);
        console.log('Conexión a MongoDB cerrada');
    }
};

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
    console.log('Señal SIGTERM recibida');
    await gracefulShutdown();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Señal SIGINT recibida');
    await gracefulShutdown();
    process.exit(0);
});

// Manejo de errores no capturados
process.on('unhandledRejection', async (err) => {
    console.error('Error no manejado:', err.message);
    await gracefulShutdown();
    process.exit(1);
});

// Manejo de excepciones no capturadas
process.on('uncaughtException', async (err) => {
    console.error('Excepción no capturada:', err.message);
    await gracefulShutdown();
    process.exit(1);
});

module.exports = app;