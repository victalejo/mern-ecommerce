// controllers/statsController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { ErrorResponse } = require('../middleware/error');

exports.getAdminStats = async (req, res, next) => {
    try {
        // Obtener estadísticas básicas
        const [
            totalProducts,
            totalCategories,
            totalOrders,
            recentOrders,
            lowStockProducts,
            salesByStatus,
            productStats
        ] = await Promise.all([
            Product.countDocuments(),
            Category.countDocuments(),
            Order.countDocuments(),
            Order.find()
                .sort('-createdAt')
                .limit(5)
                .populate('user', 'name email')
                .populate('items.product', 'name price'),
            Product.find({ stock: { $lt: 10 }})
                .select('name stock price')
                .limit(5),
            Order.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        total: { $sum: '$total' }
                    }
                }
            ]),
            Product.aggregate([
                {
                    $lookup: {
                        from: 'orders',
                        localField: '_id',
                        foreignField: 'items.product',
                        as: 'orders'
                    }
                },
                {
                    $project: {
                        name: 1,
                        totalSold: { $size: '$orders' },
                        revenue: {
                            $reduce: {
                                input: '$orders',
                                initialValue: 0,
                                in: { $add: ['$$value', '$$this.total'] }
                            }
                        }
                    }
                },
                { $sort: { totalSold: -1 } },
                { $limit: 5 }
            ])
        ]);

        // Calcular totales de ventas
        const totalSales = salesByStatus.reduce((acc, curr) => acc + curr.total, 0);
        const ordersByStatus = salesByStatus.reduce((acc, curr) => {
            acc[curr._id] = {
                count: curr.count,
                total: curr.total
            };
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    products: totalProducts,
                    categories: totalCategories,
                    orders: totalOrders
                },
                recentOrders,
                lowStockProducts,
                ordersByStatus,
                totalSales,
                topProducts: productStats
            }
        });
    } catch (error) {
        next(new ErrorResponse('Error al obtener estadísticas', 500));
    }
};