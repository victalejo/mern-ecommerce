// src/components/common/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}