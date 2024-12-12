// src/components/common/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Mostrar un indicador de carga mientras se verifica el estado de autenticación
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Si no hay usuario autenticado, redirigir al login
    // Guardamos la ubicación actual para redirigir después del login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si hay usuario autenticado, renderizar las rutas hijas
    return <Outlet />;
}