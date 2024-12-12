import React, { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../../../services/api';
import {
    Package,
    ChevronDown,
    ChevronUp,
    Search,
    Filter,
    Calendar,
    Download,
    Clock,
    AlertTriangle
} from 'lucide-react';

const orderStatusColors = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    pagado: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800'
};

const orderStatusOptions = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        status: 'todos',
        search: '',
        dateFrom: '',
        dateTo: '',
        minAmount: '',
        maxAmount: ''
    });
    const [sortConfig, setSortConfig] = useState({ field: 'createdAt', direction: 'desc' });
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [dateRange, setDateRange] = useState('todas');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, filters, sortConfig]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            let url = `${import.meta.env.VITE_API_URL}/orders?page=${currentPage}&limit=10`;

            // Añadir filtros a la URL
            if (filters.status !== 'todos') url += `&status=${filters.status}`;
            if (filters.search) url += `&search=${filters.search}`;
            if (filters.dateFrom) url += `&dateFrom=${filters.dateFrom}`;
            if (filters.dateTo) url += `&dateTo=${filters.dateTo}`;
            if (filters.minAmount) url += `&minAmount=${filters.minAmount}`;
            if (filters.maxAmount) url += `&maxAmount=${filters.maxAmount}`;

            // Añadir ordenamiento
            url += `&sort=${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.field}`;

            const data = await fetchWithErrorHandling(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setOrders(data.data);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await fetchWithErrorHandling(
                `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );
            await fetchOrders();
        } catch (err) {
            setError(err.message);
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
        setCurrentPage(1);
    };

    const handleDateRangeChange = (e) => {
        const range = e.target.value;
        setDateRange(range);
        const today = new Date();
        let dateFrom = '';
        let dateTo = today.toISOString().split('T')[0];

        switch (range) {
            case 'hoy':
                dateFrom = dateTo;
                break;
            case 'semana':
                const weekAgo = new Date(today.setDate(today.getDate() - 7));
                dateFrom = weekAgo.toISOString().split('T')[0];
                break;
            case 'mes':
                const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                dateFrom = monthAgo.toISOString().split('T')[0];
                break;
            default:
                dateTo = '';
        }

        setFilters(prev => ({
            ...prev,
            dateFrom,
            dateTo
        }));
    };

    const resetFilters = () => {
        setFilters({
            status: 'todos',
            search: '',
            dateFrom: '',
            dateTo: '',
            minAmount: '',
            maxAmount: ''
        });
        setDateRange('todas');
        setCurrentPage(1);
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Cliente', 'Estado', 'Total', 'Fecha'];
        const csvData = orders.map(order => [
            order._id,
            order.user.name,
            order.status,
            order.total,
            new Date(order.createdAt).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ordenes_${new Date().toISOString()}.csv`;
        link.click();
    };

    const OrderSummaryCard = ({ order }) => (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Pedido #{order._id.slice(-8)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{order.user.name}</p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fecha:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <button
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                className="mt-4 w-full text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
                {expandedOrder === order._id ? 'Ver menos' : 'Ver detalles'}
            </button>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center">
                    <Package className="h-6 w-6 mr-2" />
                    Gestión de Pedidos
                </h1>
                <button
                    onClick={exportToCSV}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                </button>
            </div>

            {/* Panel de filtros */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Filtros</h2>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <Filter className="h-5 w-5" />
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Buscar
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Buscar por cliente o ID..."
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="todos">Todos los estados</option>
                                {orderStatusOptions.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Período
                            </label>
                            <select
                                value={dateRange}
                                onChange={handleDateRangeChange}
                                className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="todas">Todas las fechas</option>
                                <option value="hoy">Hoy</option>
                                <option value="semana">Última semana</option>
                                <option value="mes">Último mes</option>
                                <option value="personalizado">Personalizado</option>
                            </select>
                        </div>

                        {dateRange === 'personalizado' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Desde
                                    </label>
                                    <input
                                        type="date"
                                        name="dateFrom"
                                        value={filters.dateFrom}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hasta
                                    </label>
                                    <input
                                        type="date"
                                        name="dateTo"
                                        value={filters.dateTo}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Monto mínimo
                            </label>
                            <input
                                type="number"
                                name="minAmount"
                                value={filters.minAmount}
                                onChange={handleFilterChange}
                                placeholder="$0"
                                className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Monto máximo
                            </label>
                            <input
                                type="number"
                                name="maxAmount"
                                value={filters.maxAmount}
                                onChange={handleFilterChange}
                                placeholder="$999999"
                                className="w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="col-span-full flex justify-end">
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                </div>
            )}

            {/* Lista de órdenes */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        No se encontraron pedidos con los filtros seleccionados.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('_id')}
                                >
                                    Pedido ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    Fecha
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('total')}
                                >
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <React.Fragment key={order._id}>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order._id.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.user.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.user.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${order.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                                    orderStatusColors[order.status]
                                                }`}
                                            >
                                                {orderStatusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                {expandedOrder === order._id ? 'Ocultar' : 'Ver detalles'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedOrder === order._id && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                                <div className="space-y-4">
                                                    {/* Detalles del pedido */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                                Dirección de envío
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {order.shippingAddress.street}<br />
                                                                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                                                {order.shippingAddress.zipCode}<br />
                                                                {order.shippingAddress.country}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                                Método de pago
                                                            </h4>
                                                            <p className="text-sm text-gray-600 capitalize">
                                                                {order.paymentMethod}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Lista de productos */}
                                                    <div className="mt-4">
                                                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                            Productos
                                                        </h4>
                                                        <div className="bg-white rounded-lg border">
                                                            <div className="divide-y divide-gray-200">
                                                                {order.items.map((item) => (
                                                                    <div key={item._id} className="p-4 flex justify-between items-center">
                                                                        <div className="flex items-center space-x-4">
                                                                            <img
                                                                                src={item.product.image}
                                                                                alt={item.product.name}
                                                                                className="h-10 w-10 rounded-md object-cover"
                                                                            />
                                                                            <div>
                                                                                <p className="text-sm font-medium text-gray-900">
                                                                                    {item.product.name}
                                                                                </p>
                                                                                <p className="text-sm text-gray-500">
                                                                                    Cantidad: {item.quantity}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-sm font-medium text-gray-900">
                                                                                ${(item.price * item.quantity).toFixed(2)}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500">
                                                                                ${item.price.toFixed(2)} c/u
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Primera
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Siguiente
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Última
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}