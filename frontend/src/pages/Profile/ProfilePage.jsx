import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { User, Mail, MapPin, Shield } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/profile/edit');
    };

    const handleChangePassword = () => {
        navigate('/profile/change-password');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                    <p className="mt-2 text-gray-600">Gestiona tu información personal y preferencias</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tarjeta de información principal */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-xl font-semibold text-gray-800">Información Personal</h2>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <div className="flex items-center mb-2 sm:mb-0 sm:w-1/3">
                                        <User className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-gray-600">Nombre</span>
                                    </div>
                                    <div className="sm:w-2/3">
                                        <p className="text-gray-900 font-medium">{user?.name}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <div className="flex items-center mb-2 sm:mb-0 sm:w-1/3">
                                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-gray-600">Email</span>
                                    </div>
                                    <div className="sm:w-2/3">
                                        <p className="text-gray-900 font-medium">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <div className="flex items-center mb-2 sm:mb-0 sm:w-1/3">
                                        <Shield className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-gray-600">Rol</span>
                                    </div>
                                    <div className="sm:w-2/3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user?.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de dirección */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                    <h2 className="text-xl font-semibold text-gray-800">Dirección</h2>
                                </div>
                            </div>

                            <div className="p-6">
                                {user?.address ? (
                                    <div className="space-y-2">
                                        <p className="text-gray-900">{user.address.street}</p>
                                        <p className="text-gray-600">
                                            {user.address.city}, {user.address.state} {user.address.zipCode}
                                        </p>
                                        <p className="text-gray-600">{user.address.country}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No hay dirección registrada</p>
                                )}
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="mt-6 space-y-3">
                            <button
                                onClick={handleEditProfile}
                                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                                <User className="h-4 w-4 mr-2" />
                                Editar Perfil
                            </button>
                            <button
                                onClick={handleChangePassword}
                                className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                            >
                                <Shield className="h-4 w-4 mr-2" />
                                Cambiar Contraseña
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}