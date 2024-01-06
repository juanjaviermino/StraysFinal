import useSWR from 'swr';
const apiEndpoint = import.meta.env.VITE_APP_API;
const API_BASE_URL = `${apiEndpoint}/publicaciones`;

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

const usePosts = () => {
    // const { data, error, isValidating, isLoading, mutate } = useSWR(API_BASE_URL, fetcher, {
    //     errorRetryInterval: 10000,
    // });

    const createObject = async (obj) => {
        const formData = new FormData();
        
        // Add other properties from obj to formData
        for (const key in obj) {
            if (key !== 'file') {
                formData.append(key, obj[key]);
            }
        }
    
        // Handle the file represented as a blob URL
        if (obj.file) {
            const response = await fetch(obj.file);
            const blob = await response.blob();
            formData.append('file', blob, 'upload.jpg'); // The filename 'upload.jpg' can be dynamically set if needed
        }
    
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                body: formData, // send formData
            });
    
            if (response.status === 201) {
                // Update your local data if needed
            }
    
            return response;
    
        } catch (error) {
            throw new Error(error);
        }
    };
    

    // const deleteObject = async (id) => {
    //     try {
    //         const response = await fetch(`${API_BASE_URL}/${id}`, {
    //             method: 'DELETE',
    //         });

    //         if (response.status === 200) {
    //             mutate();
    //         }

    //         return response.status;

    //     } catch (error) {
    //         throw new Error(error);
    //     }
    // };

    return {
        // posts: data,
        // isLoading,
        // error,
        // isValidating,
        // refresh: mutate,
        createObject,
        // deleteObject,
    };
};

export { usePosts };
