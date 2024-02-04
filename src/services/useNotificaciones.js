import useSWR from 'swr';
const apiEndpoint = import.meta.env.VITE_APP_API;
import { useSelector } from 'react-redux';

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

const useNotificaciones = () => {

    const usuario = useSelector(state => state.user.user);
    const getAPI = `${apiEndpoint}/notificaciones/usuario/${usuario && usuario?.id}`;

    const { data, error, isValidating, isLoading, mutate } = useSWR(getAPI, fetcher, {
        errorRetryInterval: 10000,
    });

    const postAPI = `${apiEndpoint}/notificacion`;
    const createNotificacion = async (notificacion) => {
        try {
            const response = await fetch(postAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notificacion),
            });

            if (response.status === 201) {
                mutate();
            }

            return response.status;

        } catch (error) {
            throw new Error("Hubo un error al ingresar la provincia");
        }
    };

    

    return {
        notificaciones: data,
        isLoading,
        error,
        isValidating,
        refresh: mutate,
        createNotificacion
    };
};

export { useNotificaciones };
