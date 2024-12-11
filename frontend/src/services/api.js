// src/service/api.js
export const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error en la solicitud');
        }

        return await response.json();
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.code === 'ECONNREFUSED') {
            throw new Error('ERR_CONNECTION_REFUSED');
        }
        throw error;
    }
};
