import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';

export default function Toast({ message, isVisible, onClose, hasAction = true }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-5 w-5 text-green-500" />
                        <p className="text-gray-800">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {hasAction && (
                    <div className="mt-3 flex justify-end">
                        <Link
                            to="/cart"
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Ver carrito
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}