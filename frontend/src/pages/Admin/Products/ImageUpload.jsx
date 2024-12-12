import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ onImageSelect, previewUrl = null }) => {
    const [preview, setPreview] = useState(previewUrl);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            onImageSelect(file);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setPreview(null);
        onImageSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
                    ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
                    ${preview ? 'h-64' : 'h-48'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    accept="image/*"
                    className="hidden"
                />

                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage();
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
                        >
                            <X className="w-4 h-4 text-red-600" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-2">
                            Arrastra y suelta una imagen aquí o
                        </p>
                        <span className="text-indigo-600 hover:text-indigo-700">
                            Haz clic para seleccionar
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;