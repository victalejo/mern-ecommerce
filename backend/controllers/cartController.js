// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Añadir producto al carrito
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Verificar que el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        // Verificar stock disponible
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'No hay suficiente stock disponible'
            });
        }

        // Buscar o crear el carrito del usuario
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }

        // Verificar si el producto ya está en el carrito
        const cartItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (cartItemIndex > -1) {
            // Actualizar cantidad si el producto ya existe
            cart.items[cartItemIndex].quantity = quantity;
        } else {
            // Añadir nuevo producto al carrito
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        // Guardar carrito
        await cart.save();

        // Poblar los datos del producto
        await cart.populate('items.product', 'name image price');

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener carrito del usuario
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name image price');

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                    items: [],
                    total: 0
                }
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Eliminar producto del carrito
exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Carrito no encontrado'
            });
        }

        // Filtrar el producto a eliminar
        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
