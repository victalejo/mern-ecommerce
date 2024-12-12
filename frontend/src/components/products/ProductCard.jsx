import { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../common/Toast';
import { getImageUrl } from "../../utils/imageHelper.js";

export function ProductCard({ product }) {
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Construir la URL completa de la imagen
    const imageUrl = getImageUrl(product.image);

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const success = await addToCart(product._id, 1);
            if (success) {
                setShowToast(true);
            }
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-product.png';
                        }}
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mt-1 text-sm line-clamp-2">{product.description}</p>
                    <div className="mt-2">
                        <span className="text-sm text-gray-500">Disponibles: {product.stock}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-indigo-600">
                            ${product.price.toFixed(2)}
                        </span>
                        <button
                            onClick={handleAddToCart}
                            disabled={loading || product.stock === 0}
                            className={`px-4 py-2 rounded-md text-white ${
                                product.stock === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : loading
                                        ? 'bg-indigo-400 cursor-wait'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {product.stock === 0
                                ? 'Sin stock'
                                : loading
                                    ? 'Agregando...'
                                    : 'Agregar al carrito'}
                        </button>
                    </div>
                </div>
            </div>

            <Toast
                message="¡Producto agregado al carrito!"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </>
    );
}

export default ProductCard;