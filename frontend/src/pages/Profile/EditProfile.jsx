import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { ArrowLeft, Loader, User, Mail, MapPin, Lock, Check, AlertCircle } from 'lucide-react';

export function EditProfilePage() {
    const { user, loadUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: {
            street: user?.address?.street || '',
            city: user?.address?.city || '',
            state: user?.address?.state || '',
            zipCode: user?.address?.zipCode || '',
            country: user?.address?.country || ''
        }
    });

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
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al actualizar el perfil');
            }

            await loadUser();
            setSuccess(true);
            setTimeout(() => navigate('/profile'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center text-gray-600 hover:text-indigo-600 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Volver al perfil
                </button>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h1 className="text-xl font-semibold text-gray-800">Editar Perfil</h1>
                    </div>

                    {error && (
                        <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
                            <Check className="h-5 w-5 mr-2" />
                            Perfil actualizado exitosamente
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <User className="h-4 w-4 mr-1" />
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Mail className="h-4 w-4 mr-1" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    Dirección
                                </label>
                                <div className="grid grid-cols-1 gap-4">
                                    <input
                                        type="text"
                                        name="address.street"
                                        placeholder="Calle"
                                        value={formData.address.street}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="address.city"
                                            placeholder="Ciudad"
                                            value={formData.address.city}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.state"
                                            placeholder="Estado"
                                            value={formData.address.state}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="address.zipCode"
                                            placeholder="Código Postal"
                                            value={formData.address.zipCode}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            name="address.country"
                                            placeholder="País"
                                            value={formData.address.country}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading && <Loader className="animate-spin h-4 w-4 mr-2" />}
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export function ChangePasswordPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al cambiar la contraseña');
            }

            setSuccess(true);
            setTimeout(() => navigate('/profile'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center text-gray-600 hover:text-indigo-600 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Volver al perfil
                </button>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h1 className="text-xl font-semibold text-gray-800">Cambiar Contraseña</h1>
                    </div>

                    {error && (
                        <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
                            <Check className="h-5 w-5 mr-2" />
                            Contraseña actualizada exitosamente
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Lock className="h-4 w-4 mr-1" />
                                Contraseña Actual
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Lock className="h-4 w-4 mr-1" />
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Lock className="h-4 w-4 mr-1" />
                                Confirmar Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading && <Loader className="animate-spin h-4 w-4 mr-2" />}
                                Cambiar Contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}