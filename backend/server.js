const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
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
app.use(cors()); // Permitir solicitudes desde diferentes dominios
app.use(morgan('dev')); // Registro de solicitudes HTTP
app.use(express.json()); // Parsear cuerpos JSON
app.use(express.urlencoded({ extended: true })); // Parsear cuerpos URL-encoded

// Rutas
app.use('/api/users', userRoutes); // Rutas relacionadas con usuarios
app.use('/api/products', productRoutes); // Rutas relacionadas con productos
app.use('/api/categories', categoryRoutes); // Rutas relacionadas con categorías
app.use('/api/cart', cartRoutes); // Rutas relacionadas con el carrito
app.use('/api/orders', orderRoutes); // Rutas relacionadas con órdenes

// Ruta base para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de E-commerce funcionando correctamente'
    });
});

// Middleware para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack); // Registrar el error en la consola

    // Si el error tiene un código de estado, usarlo; si no, usar 500
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // Conectar a la base de datos
        await connectDB();

        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
            console.log(`Ambiente: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Iniciar el servidor
startServer();

// Manejo de errores no capturados
process.on('unhandledRejection', (err, promise) => {
    console.error('Error no manejado:', err.message);
    // Cerrar el servidor y salir del proceso
    server.close(() => process.exit(1));
});