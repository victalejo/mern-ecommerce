// src/routes.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import HomePage from './pages/Home/HomePage.jsx';
import CartPage from './pages/Cart/CartPage.jsx';
import OrdersPage from './pages/Orders/OrdersPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import { EditProfilePage, ChangePasswordPage } from './pages/Profile/EditProfile.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AdminProducts from './pages/Admin/Products/AdminProducts.jsx';
import ProductForm from './pages/Admin/Products/ProductForm.jsx';
import AdminCategories from './pages/Admin/Categories/AdminCategories.jsx';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import AdminOrders from './pages/Admin/Orders/AdminOrders.jsx';


export default function AppRoutes() {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas protegidas que requieren autenticación */}
            <Route element={<PrivateRoute />}>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
                <Route path="/profile/change-password" element={<ChangePasswordPage />} />
            </Route>

            {/* Rutas de administración */}
            <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />

            </Route>
        </Routes>
    );
}