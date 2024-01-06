import useSWR from 'swr';
const apiEndpoint = import.meta.env.VITE_APP_API;
const API_BASE_URL = `${apiEndpoint}/provincia`;

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

const useProvincias = () => {
    const { data, error, isValidating, isLoading, mutate } = useSWR(API_BASE_URL, fetcher, {
        errorRetryInterval: 10000,
    });

    const createProvincia = async (provincia) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(provincia),
            });

            if (response.status === 201) {
                mutate();
            }

            return response.status;

        } catch (error) {
            throw new Error("Hubo un error al ingresar la provincia");
        }
    };

    const updateProvincia = async (id, provincia) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(provincia),
            });

            if (response.status === 200) {
                mutate();
            }

            return response.status;

        } catch (error) {
            throw new Error("Hubo un error al editar la provincia");
        }
    };


    const deleteProvincia = async (provinciaId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${provinciaId}`, {
                method: 'DELETE',
            });

            if (response.status === 200) {
                mutate();
            }

            return response.status;

        } catch (error) {
            throw new Error("Hubo un error al eliminar la provincia");
        }
    };

    return {
        provincias: data,
        isLoading,
        error,
        isValidating,
        refresh: mutate,
        createProvincia,
        updateProvincia,
        deleteProvincia,
    };
};

export { useProvincias };
