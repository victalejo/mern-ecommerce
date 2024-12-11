// src/components/common/CategoryFilter.jsx
export function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-gray-800 mb-4">Categorías</h2>
            <div className="space-y-2">
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="category"
                        value=""
                        checked={selectedCategory === ''}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="form-radio text-indigo-600"
                    />
                    <span className="ml-2">Todas</span>
                </label>
                {categories.map((category) => (
                    <label key={category._id} className="flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={category._id}
                            checked={selectedCategory === category._id}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="form-radio text-indigo-600"
                        />
                        <span className="ml-2">{category.name}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}