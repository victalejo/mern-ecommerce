// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { ErrorResponse } = require('../middleware/error');
const {
    generateOrderCode,
    validateRequiredFields,
    sanitizeInput
} = require('../utils/helpers');

// Crear una nueva orden
exports.createOrder = async (req, res, next) => {
    try {
        // Validar campos requeridos
        validateRequiredFields(req.body, ['shippingAddress', 'paymentMethod']);

        // Sanitizar datos de entrada
        const sanitizedData = sanitizeInput(req.body);

        // Obtener el carrito del usuario
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            throw new ErrorResponse('No hay items en el carrito', 400);
        }

        // Verificar stock disponible
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                throw new ErrorResponse(`Producto ${item.product._id} no encontrado`, 404);
            }
            if (product.stock < item.quantity) {
                throw new ErrorResponse(`Stock insuficiente para el producto ${product.name}`, 400);
            }
        }

        // Crear la orden
        const order = await Order.create({
            orderCode: generateOrderCode(),
            user: req.user.id,
            items: cart.items,
            total: cart.total,
            shippingAddress: sanitizedData.shippingAddress,
            paymentMethod: sanitizedData.paymentMethod
        });

        // Actualizar el stock de los productos usando Promise.all para mejor rendimiento
        await Promise.all(cart.items.map(item =>
            Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } },
                { new: true, runValidators: true }
            )
        ));

        // Limpiar el carrito
        await Cart.findByIdAndDelete(cart._id);

        // Poblar los datos de la orden
        await order.populate([
            { path: 'items.product', select: 'name image price' },
            { path: 'user', select: 'name email' }
        ]);

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// Obtener todas las órdenes del usuario
exports.getOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name image price')
            .populate('user', 'name email')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// Obtener una orden específica
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name image price')
            .populate('user', 'name email');

        if (!order) {
            throw new ErrorResponse('Orden no encontrada', 404);
        }

        // Verificar que la orden pertenece al usuario
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new ErrorResponse('No autorizado para ver esta orden', 403);
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar estado de la orden (solo admin)
exports.updateOrderStatus = async (req, res, next) => {
    try {
        validateRequiredFields(req.body, ['status']);

        const order = await Order.findById(req.params.id);

        if (!order) {
            throw new ErrorResponse('Orden no encontrada', 404);
        }

        order.status = req.body.status;
        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};