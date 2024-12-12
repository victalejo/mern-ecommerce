import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithErrorHandling } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import CheckoutForm from './CheckoutForm';
import Toast from '../../components/common/Toast';

export default function CartPage() {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [updating, setUpdating] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCart(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdating(true);
        try {
            await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId,
                    quantity: newQuantity
                })
            });
            await fetchCart();
            setToastMessage('Cantidad actualizada');
            setShowToast(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            await fetchCart();
            setToastMessage('Producto eliminado del carrito');
            setShowToast(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCheckoutSuccess = () => {
        setCart({ items: [], total: 0 });
        setShowCheckout(false);
        setToastMessage('¡Pedido realizado con éxito!');
        setShowToast(true);
    };

    const QuantitySelector = ({ item }) => (
        <div className="flex items-center border rounded-md">
            <button
                onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                disabled={updating || item.quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Minus className="h-4 w-4" />
            </button>
            <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) {
                        handleUpdateQuantity(item.product._id, value);
                    }
                }}
                className="w-16 text-center border-x py-1 focus:outline-none"
            />
            <button
                onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                disabled={updating || item.quantity >= item.product.stock}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Plus className="h-4 w-4" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center mb-6">
                    <Link to="/" className="flex items-center text-gray-600 hover:text-indigo-600 mr-4">
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Seguir comprando
                    </Link>
                    <h1 className="text-2xl font-bold">Mi Carrito</h1>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                    </div>
                ) : cart.items.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow">
                        <div className="flex flex-col items-center">
                            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-xl text-gray-600 mb-4">Tu carrito está vacío</p>
                            <Link
                                to="/"
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Ver productos
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <table className="min-w-full">
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Acciones
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {cart.items.map((item) => (
                                        <tr key={item.product._id}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="h-16 w-16 rounded-md object-cover"
                                                    />
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">
                                                            {item.product.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Stock disponible: {item.product.stock}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <QuantitySelector item={item} />
                                            </td>
                                            <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                                            <td className="px-6 py-4">${(item.price * item.quantity).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleRemoveItem(item.product._id)}
                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div className="px-6 py-4 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600">Subtotal: ${cart.total.toFixed(2)}</p>
                                            <p className="text-xl font-bold text-gray-800">Total: ${cart.total.toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => setShowCheckout(true)}
                                            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                                        >
                                            Proceder al Pago
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {showCheckout && (
                            <div className="lg:col-span-1">
                                <CheckoutForm
                                    cart={cart}
                                    onSuccess={handleCheckoutSuccess}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}