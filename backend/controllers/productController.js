// controllers/productController.js
const Product = require('../models/Product');
const { validateProduct } = require('../utils/validation');
const { ErrorResponse } = require('../middleware/error');
const { sanitizeInput, paginateResults, buildQueryFilters } = require('../utils/helpers');

// Obtener todos los productos
exports.getProducts = async (req, res, next) => {
    try {
        const { page, limit, sort } = req.query;
        const { skip, limitNum } = paginateResults(page, limit);
        const filters = buildQueryFilters(req.query);

        // Construir query
        const query = Product.find(filters)
            .populate('category', 'name')
            .select('-createdBy')
            .skip(skip)
            .limit(limitNum);

        // Aplicar ordenamiento si existe
        if (sort) {
            const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
            const sortOrder = sort.startsWith('-') ? -1 : 1;
            query.sort({ [sortField]: sortOrder });
        } else {
            query.sort('-createdAt');
        }

        const [products, total] = await Promise.all([
            query.exec(),
            Product.countDocuments(filters)
        ]);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: parseInt(page) || 1,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// Obtener un producto específico
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .select('-createdBy');

        if (!product) {
            throw new ErrorResponse('Producto no encontrado', 404);
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Crear un nuevo producto
exports.createProduct = async (req, res, next) => {
    try {
        const sanitizedData = sanitizeInput(req.body);

        // Validar datos del producto
        const { errors, isValid } = validateProduct(sanitizedData);
        if (!isValid) {
            throw new ErrorResponse('Datos del producto inválidos', 400, errors);
        }

        // Agregar usuario que crea el producto
        sanitizedData.createdBy = req.user.id;

        const product = await Product.create(sanitizedData);

        await product.populate('category', 'name');

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            throw new ErrorResponse('Producto no encontrado', 404);
        }

        // Verificar autorización
        if (product.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new ErrorResponse('No autorizado para actualizar este producto', 403);
        }

        const sanitizedData = sanitizeInput(req.body);

        // Validar datos de actualización
        const { errors, isValid } = validateProduct(sanitizedData);
        if (!isValid) {
            throw new ErrorResponse('Datos de actualización inválidos', 400, errors);
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            sanitizedData,
            {
                new: true,
                runValidators: true
            }
        ).populate('category', 'name');

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            throw new ErrorResponse('Producto no encontrado', 404);
        }

        // Verificar autorización
        if (product.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new ErrorResponse('No autorizado para eliminar este producto', 403);
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

// Buscar productos
exports.searchProducts = async (req, res, next) => {
    try {
        const { query = '', category, minPrice, maxPrice } = req.query;
        const { page, limit } = req.query;
        const { skip, limitNum } = paginateResults(page, limit);

        // Construir filtros de búsqueda
        const searchFilter = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };

        if (category) {
            searchFilter.category = category;
        }

        if (minPrice || maxPrice) {
            searchFilter.price = {};
            if (minPrice) searchFilter.price.$gte = Number(minPrice);
            if (maxPrice) searchFilter.price.$lte = Number(maxPrice);
        }

        const [products, total] = await Promise.all([
            Product.find(searchFilter)
                .populate('category', 'name')
                .select('-createdBy')
                .skip(skip)
                .limit(limitNum)
                .sort('-createdAt'),
            Product.countDocuments(searchFilter)
        ]);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: parseInt(page) || 1,
            data: products
        });
    } catch (error) {
        next(error);
    }
};