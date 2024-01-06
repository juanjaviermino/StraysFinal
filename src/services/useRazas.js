import useSWR from 'swr';
const apiEndpoint = import.meta.env.VITE_APP_API;
const API_BASE_URL = `${apiEndpoint}/raza`;

const fetcher = async (url, options) => {
    const res = await fetch(url, options);

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error("Recurso no encontrado");
        }
        throw new Error("Hubo un problema con el servidor, intenta de nuevo");
    }

    return res.json();
};

const useRazas = () => {
    const { data, error, isValidating, isLoading, mutate } = useSWR(API_BASE_URL, fetcher, {
        errorRetryInterval: 10000,
    });

    const createObject = async (obj) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            });

            if (response.status === 201) {
                mutate();
            }

            return response.status;

        } catch (error) {
            throw new Error(error);
        }
    };

    const updateObject = async (id, obj) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            });

            if (response.status === 200) {
                mutate();
            }

            return response.status;

        } catch (error) {
            throw new Error(error);
        }
    };


    const deleteObject = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                mutate();
            }

            return response.status;

        } catch (error) {
            throw new Error(error);
        }
    };

    return {
        razas: data,
        isLoading,
        error,
        isValidating,
        refresh: mutate,
        createObject,
        updateObject,
        deleteObject,
    };
};

export { useRazas };
