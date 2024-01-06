const apiEndpoint = import.meta.env.VITE_APP_API;
const API_BASE_URL = `${apiEndpoint}/color_publicacion`;

const useColors = () => {

    const createObject = async (obj, publicacionId) => {
        try {
            const objetoNuevo = {
                color: obj,
                publicacionId: publicacionId
            }
            console.log('Guardando: ', objetoNuevo);
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objetoNuevo),
            });

            return response;

        } catch (error) {
            throw new Error(error);
        }
    };

    return {
        createObject,
    };
};

export { useColors };
