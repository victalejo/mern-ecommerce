// src/pages/Home/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {ProductList} from '../../components/products/ProductList.jsx';
import {CategoryFilter} from '../../components/common/CategoryFilter.jsx';
import {SearchBar} from '../../components/common/SearchBar.jsx';
import {Navbar} from '../../components/layout/Navbar.jsx';
import { fetchWithErrorHandling } from '../../services/api';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [selectedCategory, searchQuery]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let url = `${import.meta.env.VITE_API_URL}/products?`;
            if (selectedCategory) url += `category=${selectedCategory}&`;
            if (searchQuery) url += `query=${searchQuery}`;

            const data = await fetchWithErrorHandling(url);
            setProducts(data.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Error al cargar los productos');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/categories`);
            setCategories(data.data);
        } catch (err) {
            console.error('Error al cargar categorías:', err);
            setCategories([]);
        }
    };

    if (error && error.includes('CONNECTION_REFUSED')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error de Conexión</h2>
                    <p className="text-gray-600 mb-4">
                        No se pudo conectar con el servidor. Por favor, verifica que:
                    </p>
                    <ul className="list-disc pl-5 mb-4 text-gray-600">
                        <li>El servidor backend está en ejecución</li>
                        <li>El puerto 5000 está disponible</li>
                        <li>La URL del API es correcta en el archivo .env</li>
                    </ul>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
                        {user?.role === 'admin' && (
                            <Link
                                to="/products/new"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Añadir Producto
                            </Link>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="w-full md:w-64">
                            <CategoryFilter
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                            />
                        </div>

                        <div className="flex-1">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Buscar productos..."
                            />

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : error ? (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            ) : (
                                <ProductList products={products} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}