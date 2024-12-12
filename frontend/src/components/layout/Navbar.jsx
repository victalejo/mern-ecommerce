import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShoppingCart, Menu, X, User, Package, LogOut } from 'lucide-react';

export function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo y nombre */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                                <Package className="h-8 w-8 text-indigo-600" />
                                <span className="text-xl font-bold text-indigo-600">E-commerce</span>
                            </Link>
                        </div>

                        {/* Enlaces de navegación - Desktop */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                Inicio
                            </Link>

                            {user ? (
                                <>
                                    <Link to="/cart" className="relative group">
                                        <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                                    </Link>

                                    <div className="relative group">
                                        <button className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors">
                                            <User className="h-5 w-5" />
                                            <span>{user.name}</span>
                                        </button>

                                        <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                                                Mis Pedidos
                                            </Link>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                                                Mi Perfil
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                                                    Panel Admin
                                                </Link>
                                            )}
                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Cerrar Sesión</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Botón menú móvil */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-600 hover:text-indigo-600 focus:outline-none"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú móvil */}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
                        <Link
                            to="/"
                            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                            onClick={closeMenu}
                        >
                            Inicio
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/cart"
                                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                                    onClick={closeMenu}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    <span>Carrito</span>
                                </Link>

                                <Link
                                    to="/orders"
                                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                                    onClick={closeMenu}
                                >
                                    Mis Pedidos
                                </Link>

                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                                    onClick={closeMenu}
                                >
                                    Mi Perfil
                                </Link>

                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                                        onClick={closeMenu}
                                    >
                                        Panel Admin
                                    </Link>
                                )}

                                <button
                                    onClick={() => {
                                        logout();
                                        closeMenu();
                                    }}
                                    className="w-full flex items-center space-x-2 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                                    onClick={closeMenu}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                    onClick={closeMenu}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            {/* Espaciador para compensar el navbar fijo */}
            <div className="h-16"></div>
        </>
    );
}

export default Navbar;