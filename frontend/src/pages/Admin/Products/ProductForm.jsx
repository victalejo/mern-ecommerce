import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithErrorHandling } from '../../../services/api';
import ImageUpload from './ImageUpload';
import { Loader } from 'lucide-react';

export default function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const data = await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/categories`);
            setCategories(data.data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const data = await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/products/${id}`);
            setFormData({
                name: data.data.name,
                description: data.data.description,
                price: data.data.price,
                stock: data.data.stock,
                category: data.data.category._id,
            });
            // Establecer la URL de la imagen existente para preview
            setImageFile(data.data.image);
        } catch (error) {
            setError('Error al cargar el producto');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            if (imageFile instanceof File) {
                formDataToSend.append('image', imageFile);
            }

            const url = id
                ? `${import.meta.env.VITE_API_URL}/products/${id}`
                : `${import.meta.env.VITE_API_URL}/products`;

            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Error al guardar el producto');
            }

            navigate('/admin/products');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                {id ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-lg shadow p-6">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Imagen del Producto
                        </label>
                        <ImageUpload
                            onImageSelect={setImageFile}
                            previewUrl={typeof imageFile === 'string' ? imageFile : null}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Precio
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Categoría
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                    >
                        {loading && <Loader className="animate-spin mr-2 h-4 w-4" />}
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
}