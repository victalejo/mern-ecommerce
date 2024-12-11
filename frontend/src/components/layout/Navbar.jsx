// src/components/layout/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-indigo-600">
                        E-commerce
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-indigo-600">
                            Inicio
                        </Link>
                        {user ? (
                            <>
                                <Link to="/cart" className="text-gray-700 hover:text-indigo-600">
                                    Carrito
                                </Link>
                                <Link to="/orders" className="text-gray-700 hover:text-indigo-600">
                                    Mis Pedidos
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-indigo-600"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}