// src/components/products/ProductCard.jsx
export function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-600">
                        ${product.price.toFixed(2)}
                    </span>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    );
}