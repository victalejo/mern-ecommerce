// src/pages/Auth/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        }
    });

    const { register, error, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
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
        try {
            await register(formData);
            navigate('/');
        } catch (error) {
            console.error('Error en registro:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
                <div>
                    <h2 className="text-3xl font-bold text-center">Registro</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-medium text-lg">Dirección</h3>
                            <div>
                                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                                    Calle
                                </label>
                                <input
                                    type="text"
                                    name="address.street"
                                    id="address.street"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        id="address.city"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                                        Estado
                                    </label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        id="address.state"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                                        Código Postal
                                    </label>
                                    <input
                                        type="text"
                                        name="address.zipCode"
                                        id="address.zipCode"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={formData.address.zipCode}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                                        País
                                    </label>
                                    <input
                                        type="text"
                                        name="address.country"
                                        id="address.country"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={formData.address.country}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Cargando...' : 'Registrarse'}
                    </button>
                </form>
            </div>
        </div>
    );
}