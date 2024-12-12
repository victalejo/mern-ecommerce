import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithErrorHandling } from '../../services/api';
import {
    Package,
    ShoppingBag,
    FolderTree,
    AlertTriangle,
    TrendingUp,
    Clock
} from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await fetchWithErrorHandling(
                `${import.meta.env.VITE_API_URL}/stats`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setStats(data.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

            {/* Resumen general */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <Package className="h-10 w-10 text-indigo-500" />
                        <div className="ml-4">
                            <p className="text-gray-500">Productos</p>
                            <h3 className="text-2xl font-bold">{stats.counts.products}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <FolderTree className="h-10 w-10 text-green-500" />
                        <div className="ml-4">
                            <p className="text-gray-500">Categorías</p>
                            <h3 className="text-2xl font-bold">{stats.counts.categories}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <ShoppingBag className="h-10 w-10 text-purple-500" />
                        <div className="ml-4">
                            <p className="text-gray-500">Pedidos</p>
                            <h3 className="text-2xl font-bold">{stats.counts.orders}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <TrendingUp className="h-10 w-10 text-blue-500" />
                        <div className="ml-4">
                            <p className="text-gray-500">Ventas Totales</p>
                            <h3 className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Productos con poco stock */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                            <h2 className="text-lg font-semibold">Productos con Poco Stock</h2>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="divide-y">
                            {stats.lowStockProducts.map((product) => (
                                <div key={product._id} className="py-3 flex justify-between items-center">
                                    <span className="font-medium">{product.name}</span>
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        product.stock < 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {product.stock} en stock
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Órdenes recientes */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 text-blue-500 mr-2" />
                            <h2 className="text-lg font-semibold">Pedidos Recientes</h2>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="divide-y">
                            {stats.recentOrders.map((order) => (
                                <div key={order._id} className="py-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{order.user.name}</p>
                                            <p className="text-sm text-gray-500">{order.user.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${order.total.toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enlaces rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Link to="/admin/products" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Gestionar Productos</h3>
                    <p className="text-gray-600">Añadir, editar y eliminar productos</p>
                </Link>

                <Link to="/admin/categories" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Gestionar Categorías</h3>
                    <p className="text-gray-600">Administrar categorías de productos</p>
                </Link>

                <Link to="/admin/orders" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">Gestionar Pedidos</h3>
                    <p className="text-gray-600">Ver y actualizar estado de pedidos</p>
                </Link>
            </div>
        </div>
    );
}