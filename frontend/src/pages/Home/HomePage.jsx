import React, { useState, useEffect } from 'react';
import { ProductList } from '../../components/products/ProductList.jsx';
import { CategoryFilter } from '../../components/common/CategoryFilter.jsx';
import { SearchBar } from '../../components/common/SearchBar.jsx';
import { Navbar } from '../../components/layout/Navbar.jsx';
import { fetchWithErrorHandling } from '../../services/api';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

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

    const toggleFilters = () => {
        setShowFilters(!showFilters);
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-indigo-600">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90" />
                <div className="relative w-full px-4 py-12 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-6 sm:text-5xl">
                            Descubre productos increíbles
                        </h1>
                        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                            Explora nuestra colección exclusiva de productos seleccionados para ti
                        </p>
                        <div className="max-w-xl mx-auto">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Buscar productos..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
                {/* Botón de filtros móvil */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={toggleFilters}
                        className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                        Filtros
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar con filtros */}
                    <div className={`
                        lg:w-64 flex-shrink-0
                        ${showFilters ? 'fixed inset-0 z-40 bg-white lg:relative lg:bg-transparent' : 'hidden lg:block'}
                    `}>
                        <div className="p-4 lg:p-0">
                            <div className="flex justify-between items-center lg:hidden mb-4">
                                <h3 className="text-lg font-medium">Filtros</h3>
                                <button onClick={toggleFilters}>
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="sticky top-4">
                                <CategoryFilter
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    onCategoryChange={(category) => {
                                        setSelectedCategory(category);
                                        setShowFilters(false);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Overlay para móvil */}
                    {showFilters && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                            onClick={toggleFilters}
                        />
                    )}

                    {/* Contenido principal */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {selectedCategory
                                    ? `${categories.find(c => c._id === selectedCategory)?.name || ''}`
                                    : 'Todos los productos'}
                            </h2>
                            <p className="text-gray-600">
                                {products.length} productos encontrados
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        ) : (
                            <ProductList products={products} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}