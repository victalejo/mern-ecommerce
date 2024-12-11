// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB conectado: ${conn.connection.host}`);

        // Manejador para cuando se pierde la conexión
        mongoose.connection.on('error', err => {
            console.error('Error de conexión a MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB desconectado. Intentando reconectar...');
        });

        // Manejador para cuando se recupera la conexión
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconectado');
        });

    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;