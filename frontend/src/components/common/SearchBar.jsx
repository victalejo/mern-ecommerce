// src/components/common/SearchBar.jsx
export function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className="mb-6">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
    );
}