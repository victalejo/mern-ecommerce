import { createContext, useContext, useState, useCallback } from 'react';
import { fetchWithErrorHandling } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            const data = await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCart(data.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addToCart = useCallback(async (productId, quantity = 1) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Debes iniciar sesión para agregar productos al carrito');
            }

            await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId, quantity })
            });

            await fetchCart();
            setError(null);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchCart]);

    const removeFromCart = useCallback(async (productId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            await fetchWithErrorHandling(`${import.meta.env.VITE_API_URL}/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            await fetchCart();
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [fetchCart]);

    const value = {
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        fetchCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};