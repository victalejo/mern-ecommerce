// controllers/categoryController.js
const Category = require('../models/Category');

// Obtener todas las categorías
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().select('-createdBy');

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las categorías'
        });
    }
};

// Crear una nueva categoría
exports.createCategory = async (req, res) => {
    try {
        // Agregar el ID del usuario que crea la categoría
        req.body.createdBy = req.user.id;

        const category = await Category.create(req.body);

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        // Manejar el error de categoría duplicada
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Eliminar una categoría
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        // Verificar si el usuario que elimina es quien creó la categoría
        if (category.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No autorizado para eliminar esta categoría'
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Categoría eliminada exitosamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};