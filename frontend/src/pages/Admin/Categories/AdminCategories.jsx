import React, { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../../../services/api';
import {
    FolderPlus,
    Search,
    Trash2,
    Edit2,
    X,
    Save,
    AlertCircle,
    CheckCircle2,
    Loader
} from 'lucide-react';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/categories`);
            setCategories(data.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            setSuccess('Categoría creada exitosamente');
            setFormData({ name: '', description: '' });
            setShowForm(false);
            await fetchCategories();
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/categories/${editingCategory._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            setSuccess('Categoría actualizada exitosamente');
            setFormData({ name: '', description: '' });
            setEditingCategory(null);
            await fetchCategories();
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;

        try {
            setLoading(true);
            await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccess('Categoría eliminada exitosamente');
            await fetchCategories();
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setShowForm(true);
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center">
                    <FolderPlus className="h-8 w-8 mr-2 text-indigo-600" />
                    Gestión de Categorías
                </h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingCategory(null);
                        setFormData({ name: '', description: '' });
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                    <FolderPlus className="h-5 w-5 mr-2" />
                    {showForm ? 'Cancelar' : 'Nueva Categoría'}
                </button>
            </div>

            {(error || success) && (
                <div className={`mb-4 p-4 rounded-lg flex items-center ${
                    error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                    {error ?
                        <AlertCircle className="h-5 w-5 mr-2" /> :
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                    }
                    {error || success}
                </div>
            )}

            {/* Formulario */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h2>
                    <form onSubmit={editingCategory ? handleEdit : handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingCategory(null);
                                        setFormData({ name: '', description: '' });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader className="animate-spin h-5 w-5 mr-2" />
                                    ) : (
                                        <Save className="h-5 w-5 mr-2" />
                                    )}
                                    {editingCategory ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Buscador */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar categorías..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>

            {/* Lista de categorías */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading && !categories.length ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader className="animate-spin h-8 w-8 text-indigo-600" />
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No se encontraron categorías</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredCategories.map((category) => (
                            <div key={category._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => startEdit(category)}
                                            className="text-indigo-600 hover:text-indigo-900 p-1"
                                        >
                                            <Edit2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
