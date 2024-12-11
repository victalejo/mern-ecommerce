// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();

// Importar rutas
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

// Inicializar express
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Ruta base para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de E-commerce funcionando correctamente'
    });
});

// Middleware para archivos estáticos
app.use('/uploads', express.static('uploads'));

// Middleware para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

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