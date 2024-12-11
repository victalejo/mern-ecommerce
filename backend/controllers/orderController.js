const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Crear una nueva orden
exports.createOrder = async (req, res) => {
    try {
        // Obtener el carrito del usuario
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No hay items en el carrito'
            });
        }

        // Verificar stock disponible
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para el producto ${product.name}`
                });
            }
        }

        // Crear la orden
        const order = await Order.create({
            user: req.user.id,
            items: cart.items,
            total: cart.total,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod
        });

        // Actualizar el stock de los productos
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Limpiar el carrito
        await Cart.findByIdAndDelete(cart._id);

        // Poblar los datos de la orden
        await order.populate('items.product', 'name image');

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener todas las órdenes del usuario
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name image')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener una orden específica
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name image');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Orden no encontrada'
            });
        }

        // Verificar que la orden pertenece al usuario
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No autorizado para ver esta orden'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};