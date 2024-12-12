import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchWithErrorHandling } from '../../services/api';

export default function CheckoutForm({ cart, onSuccess }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        shippingAddress: {
            street: user?.address?.street || '',
            city: user?.address?.city || '',
            state: user?.address?.state || '',
            zipCode: user?.address?.zipCode || '',
            country: user?.address?.country || ''
        },
        paymentMethod: 'tarjeta'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                shippingAddress: {
                    ...prev.shippingAddress,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            onSuccess();
            navigate('/orders');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Finalizar Compra</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Dirección de Envío</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Calle
                            </label>
                            <input
                                type="text"
                                name="address.street"
                                value={formData.shippingAddress.street}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.shippingAddress.city}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Estado
                                </label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.shippingAddress.state}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Código Postal
                                </label>
                                <input
                                    type="text"
                                    name="address.zipCode"
                                    value={formData.shippingAddress.zipCode}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    País
                                </label>
                                <input
                                    type="text"
                                    name="address.country"
                                    value={formData.shippingAddress.country}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Método de Pago</h3>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="tarjeta"
                                checked={formData.paymentMethod === 'tarjeta'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Tarjeta de Crédito/Débito
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="efectivo"
                                checked={formData.paymentMethod === 'efectivo'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Pago en Efectivo
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="transferencia"
                                checked={formData.paymentMethod === 'transferencia'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Transferencia Bancaria
                        </label>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium">Total a Pagar:</span>
                        <span className="text-2xl font-bold text-indigo-600">
              ${cart.total}
            </span>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>
                </div>
            </form>
        </div>
    );
}