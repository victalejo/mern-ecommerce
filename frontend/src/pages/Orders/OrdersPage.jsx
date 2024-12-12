import React, { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../../services/api';
import { Navbar } from '../../components/layout/Navbar';
import { Package, ChevronDown, ChevronUp, Clock, MapPin, CreditCard } from 'lucide-react';

const OrderStatusBadge = ({ status }) => {
    const statusStyles = {
        pendiente: 'bg-yellow-100 text-yellow-800',
        pagado: 'bg-blue-100 text-blue-800',
        enviado: 'bg-purple-100 text-purple-800',
        entregado: 'bg-green-100 text-green-800',
        cancelado: 'bg-red-100 text-red-800'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('todos');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setOrders(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const filteredOrders = orders
        .filter(order => statusFilter === 'todos' || order.status === statusFilter)
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Mis Pedidos</h1>

                    {/* Filtros y Ordenamiento */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="pagado">Pagados</option>
                            <option value="enviado">Enviados</option>
                            <option value="entregado">Entregados</option>
                            <option value="cancelado">Cancelados</option>
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="desc">Más recientes primero</option>
                            <option value="asc">Más antiguos primero</option>
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No se encontraron pedidos con los filtros seleccionados.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-lg shadow overflow-hidden"
                                >
                                    {/* Cabecera del pedido */}
                                    <div
                                        className="px-6 py-4 cursor-pointer hover:bg-gray-50"
                                        onClick={() => toggleOrderExpansion(order._id)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-4">
                                                <Package className="h-6 w-6 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        Pedido #{order._id.slice(-8)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <OrderStatusBadge status={order.status} />
                                                {expandedOrder === order._id ? (
                                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detalles del pedido */}
                                    {expandedOrder === order._id && (
                                        <div className="px-6 py-4 border-t border-gray-200">
                                            {/* Información de envío y pago */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <h4 className="flex items-center text-sm font-medium text-gray-900 mb-2">
                                                        <MapPin className="h-4 w-4 mr-2" />
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
                                                    <h4 className="flex items-center text-sm font-medium text-gray-900 mb-2">
                                                        <CreditCard className="h-4 w-4 mr-2" />
                                                        Método de pago
                                                    </h4>
                                                    <p className="text-sm text-gray-600 capitalize">
                                                        {order.paymentMethod}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Lista de productos */}
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Producto
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Cantidad
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Precio
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Subtotal
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                    {order.items.map((item) => (
                                                        <tr key={item._id}>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <img
                                                                        src={item.product.image}
                                                                        alt={item.product.name}
                                                                        className="h-10 w-10 rounded-md object-cover"
                                                                    />
                                                                    <span className="ml-4 text-sm text-gray-900">
                                                                            {item.product.name}
                                                                        </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                                {item.quantity}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                                ${item.price.toFixed(2)}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Total */}
                                            <div className="mt-4 flex justify-end">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Total del pedido</p>
                                                    <p className="text-2xl font-bold text-indigo-600">
                                                        ${order.total.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Timeline de estado */}
                                            <div className="mt-6">
                                                <h4 className="flex items-center text-sm font-medium text-gray-900 mb-4">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    Seguimiento del pedido
                                                </h4>
                                                <div className="relative">
                                                    <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>
                                                    {['pendiente', 'pagado', 'enviado', 'entregado'].map((status, index) => (
                                                        <div key={status} className="flex items-center mb-4 relative">
                                                            <div className={`
                                                                w-8 h-8 rounded-full flex items-center justify-center
                                                                ${order.status === status ? 'bg-indigo-600 text-white' :
                                                                index <= ['pendiente', 'pagado', 'enviado', 'entregado'].indexOf(order.status)
                                                                    ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}
                                                            `}>
                                                                <Package className="h-4 w-4" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <p className="text-sm font-medium text-gray-900 capitalize">
                                                                    {status}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}