// src/components/products/ProductList.jsx
export function ProductList({ products }) {
    if (!products.length) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron productos</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}