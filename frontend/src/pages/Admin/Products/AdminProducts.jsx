import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithErrorHandling } from '../../../services/api';
import {
    Package, Search, Filter, Plus, Trash2, Edit2,
    ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        stock: 'all'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [sortConfig, setSortConfig] = useState({
        field: 'createdAt',
        direction: 'desc'
    });

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [pagination.page, sortConfig, filters]);

    const fetchCategories = async () => {
        try {
            const data = await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/categories`);
            setCategories(data.data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let url = `${import.meta.env.VITE_API_URL}/products?page=${pagination.page}&limit=${pagination.limit}`;

            if (filters.search) url += `&search=${filters.search}`;
            if (filters.category) url += `&category=${filters.category}`;
            if (filters.minPrice) url += `&minPrice=${filters.minPrice}`;
            if (filters.maxPrice) url += `&maxPrice=${filters.maxPrice}`;
            if (filters.stock !== 'all') url += `&stock=${filters.stock}`;

            url += `&sort=${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.field}`;

            const data = await fetchWithErrorHandling(url);
            setProducts(data.data);
            setPagination(prev => ({
                ...prev,
                total: data.total,
                totalPages: data.totalPages
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                await fetchProducts();
            } catch (error) {
                setError('Error al eliminar el producto');
            }
        }
    };

    const handleSort = (field) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            stock: 'all'
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    return (
        <div className="p-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center">
                    <Package className="h-6 w-6 mr-2" />
                    Gestión de Productos
                </h1>
                <Link
                    to="/admin/products/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Producto
                </Link>
            </div>

            {/* Panel de filtros */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Buscar productos..."
                                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <select
                            name="stock"
                            value={filters.stock}
                            onChange={handleFilterChange}
                            className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all">Todos</option>
                            <option value="low">Stock bajo (&lt; 10)</option>
                            <option value="out">Sin stock</option>
                            <option value="available">Disponible</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={resetFilters}
                            className="w-full p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center"
                        >
                            <Filter className="h-5 w-5 mr-2" />
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Mensajes de error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {/* Tabla de productos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('price')}
                            >
                                Precio
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('stock')}
                            >
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No se encontraron productos
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                className="h-10 w-10 rounded-lg object-cover"
                                                src={product.image}
                                                alt={product.name}
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {product.description.substring(0, 50)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            ${product.price.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                product.stock === 0
                                                    ? 'bg-red-100 text-red-800'
                                                    : product.stock < 10
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                            }`}>
                                                {product.stock} unidades
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {product.category.name}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            to={`/admin/products/edit/${product._id}`}
                                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center mr-4"
                                        >
                                            <Edit2 className="h-4 w-4 mr-1" />
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando{' '}
                                    <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                                    {' '}-{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                                    </span>
                                    {' '}de{' '}
                                    <span className="font-medium">{pagination.total}</span>
                                    {' '}productos
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-700">Productos por página</span>
                                    <select
                                        value={pagination.limit}
                                        onChange={(e) => setPagination(prev => ({
                                            ...prev,
                                            limit: Number(e.target.value),
                                            page: 1
                                        }))}
                                        className="border rounded-md text-sm p-1"
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px ml-4">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    {[...Array(pagination.totalPages)].map((_, idx) => (
                                        <button
                                            key={idx + 1}
                                            onClick={() => setPagination(prev => ({ ...prev, page: idx + 1 }))}
                                            className={`relative inline-flex items-center px-4 py-2 border ${
                                                pagination.page === idx + 1
                                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                            } text-sm font-medium`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}