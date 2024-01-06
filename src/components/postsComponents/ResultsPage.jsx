import React, { useEffect, useState, useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from 'primereact/toast';
import PostComponent from './PostComponent';

// Servicios
const apiEndpoint = import.meta.env.VITE_APP_API;
const microservice = import.meta.env.VITE_MICROSERVICE_API;

function ResultsPage (props) {

    // --------------------- Setup ---------------------------

    // toasts:
    const toast = useRef(null);
    const toastColores = useRef(null);
    const toastImagenes = useRef(null);
    const toastMicroservicio = useRef(null);
    const toastInformacion = useRef(null);

    const location = useLocation();
    const { postId } = location.state || {};
    const navigate = useNavigate();

    // --------------------- Estados ---------------------------
    const [filtrarColoresChecked, setFiltrarColoresChecked] = useState(false);
    const [publicaciones, setPublicaciones] = useState([]);

    // ---------------------- Mostrar resultados cuando llegue a la página --------

    useEffect(()=>{
        handlePublicacionesFetch(postId);
    },[])

    // ------------------------- Funciones del core ---------------------------------

    // 1. Traer los ids de los colores que tienen coincidencia:

    const handleFetchColores = async (publicacionId) =>{
        toastColores.current.show({
            severity: 'info',
            summary: 'Filtrando colores',
            sticky: true,
            content: (props) => (
                <div className="flex flex-column align-items-left" style={{ flex: '1' }}>
                    <div className="font-medium text-lg my-3 text-900">{props.message.summary}</div>
                </div>
            )
        });
        try {
            const response = await fetch(`${apiEndpoint}/color_publicacion/comparar/${publicacionId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return(data);
        } catch (error) {
            toastColores.current.clear();
            toast.current.show({
                severity: 'error',
                summary: 'Filtrando colores',
                detail: 'Hubo un error al intentar obtener los colores',
                life: 3000,
            });
        } finally{
            toastColores.current.clear();
        }
    };

    // 2. Traer las imagenes que se compararán

    const handleFetchImages = async (publicacionId, publicacionesIds) =>{
        toastImagenes.current.show({
            severity: 'info',
            summary: 'Obteniendo imagenes',
            sticky: true,
            content: (props) => (
                <div className="flex flex-column align-items-left" style={{ flex: '1' }}>
                    <div className="font-medium text-lg my-3 text-900">{props.message.summary}</div>
                </div>
            )
        });
        try {
            const postData = {
                publicacionId: publicacionId,
                publicacionesIds: publicacionesIds
            }
            const response = await fetch(`${apiEndpoint}/publicaciones/compare`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return(data);
        } catch (error) {
            toastImagenes.current.clear();
            toast.current.show({
                severity: 'error',
                summary: 'Obteniendo imagenes',
                detail: 'Hubo un error al intentar obtener las imagenes',
                life: 3000,
            });
        } finally{
            toastImagenes.current.clear();
        }
    };

    // 3. Usar el microservicio de comparación de imagenes

    const handleUseMicroservice = async (imageUrlsToCompare) =>{
        toastMicroservicio.current.show({
            severity: 'info',
            summary: 'Comparando imagenes',
            sticky: true,
            content: (props) => (
                <div className="flex flex-column align-items-left" style={{ flex: '1' }}>
                    <div className="font-medium text-lg my-3 text-900">{props.message.summary}</div>
                </div>
            )
        });
        try {
            const response = await fetch(`${microservice}/compare`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(imageUrlsToCompare),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return(data);
        } catch (error) {
            toastMicroservicio.current.clear();
            toast.current.show({
                severity: 'error',
                summary: 'Comparando imagenes',
                detail: 'Hubo un error al intentar comparar las imagenes',
                life: 3000,
            });
        } finally{
            toastMicroservicio.current.clear();
        }
    };

    // 4. Obtener las publicaciones ligadas a las imagenes obtenidas

    const handleFetchInformation = async (imgRoutes) =>{
        toastInformacion.current.show({
            severity: 'info',
            summary: 'Obteniendo información',
            sticky: true,
            content: (props) => (
                <div className="flex flex-column align-items-left" style={{ flex: '1' }}>
                    <div className="font-medium text-lg my-3 text-900">{props.message.summary}</div>
                </div>
            )
        });
        try {
            const response = await fetch(`${apiEndpoint}/publicaciones/by-images`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(imgRoutes),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return(data);
        } catch (error) {
            toastInformacion.current.clear();
            toast.current.show({
                severity: 'error',
                summary: 'Obteniendo información',
                detail: 'Hubo un error al obtener la información',
                life: 3000,
            });
        } finally{
            toastInformacion.current.clear();
        }
    };
    
    const attachSimilarity = (publicacionesInfo, microserviceResult) => {

        const publicacionesWithSimilarity = publicacionesInfo.map(publicacion => {
            const match = microserviceResult.Matches.find(match => match.imageURL === publicacion.rutaImg);
            const similarityPercentage = match ? (match.similitud * 100).toFixed(2) : '0.00';
    
            // Return the updated publicacion object with similarity
            return {
                ...publicacion,
                similitud: parseFloat(similarityPercentage) // Use float for sorting
            };
        });
    
        // Sort the publicaciones by similarity in descending order
        return publicacionesWithSimilarity.sort((a, b) => b.similitud - a.similitud);
    };

    const handlePublicacionesFetch = async (publicacionId) =>{
        const selectedPublicacionesIds = filtrarColoresChecked ? await handleFetchColores(publicacionId) : [];
        console.log(selectedPublicacionesIds);
        const imageUrlsToCompare = await handleFetchImages(publicacionId, selectedPublicacionesIds)
        console.log(imageUrlsToCompare);
        const microserviceResult = await handleUseMicroservice(imageUrlsToCompare);
        console.log(microserviceResult);
        if(microserviceResult?.Matches && microserviceResult?.Matches.length > 0){
            const imgRoutes = {imgRoutes: microserviceResult.Matches.map(obj => obj.imageURL)};
            const publicacionesInfo = await handleFetchInformation(imgRoutes);
            console.log(publicacionesInfo);
            const updatedPublicaciones = attachSimilarity(publicacionesInfo, microserviceResult);
            setPublicaciones(updatedPublicaciones);
        } else{
            setPublicaciones([])
        }
    }

    // -------------------- Open publicación ---------------

    const redirectWithPublicacion = (publicacionId) =>{
        navigate('/StraysFinal/view_posts_page', { state: { publicacionId: publicacionId } });  
    }

    return(
        <div className='resultspage gradient-background2'>
            <Toast ref={toastColores} />
            <Toast ref={toastImagenes} />
            <Toast ref={toastMicroservicio} />
            <Toast ref={toastInformacion} />
            <Toast ref={toast} />
            <section className='resultspage__actions'>
                <small>Post Id: { postId }</small>
                <div className='resultspage__actions--item'>
                    <p>Filtrar colores:</p>
                    <InputSwitch checked={filtrarColoresChecked} onChange={(e) => setFiltrarColoresChecked(e.value)} />
                </div>
                <div className='resultspage__actions--item'>
                    <p>Volver a buscar:</p>
                    <button className='button--common' onClick={() => handlePublicacionesFetch(postId)}>
                        <i className="pi pi-refresh"></i>
                        <span>Refrescar</span>
                    </button>
                </div>
            </section>
            <section className='resultspage__posts'>
                <div className='resultspage__posts--second'>
                    <div className='resultspage__posts__header'>
                        <h3>{(publicaciones[1] === null || publicaciones[1] === undefined) ? '0.00%' : publicaciones[1]?.similitud + '%'}</h3>
                        <small>de coincidencia</small>
                    </div>
                    <div className='resultspage__posts__post'>
                        <PostComponent publicacion={publicaciones[1] || null} onClick={(publicacionId) => redirectWithPublicacion(publicacionId)}/>
                    </div>
                </div>
                <div className='resultspage__posts--first'>
                    <div className='resultspage__posts__header'>
                        <h3>{(publicaciones[0] === null || publicaciones[0] === undefined) ? '0.00%' : publicaciones[0]?.similitud + '%'}</h3>
                        <small>de coincidencia</small>
                    </div>
                    <div className='resultspage__posts__post'>
                    <PostComponent publicacion={publicaciones[0] || null} onClick={(publicacionId) => redirectWithPublicacion(publicacionId)}/>
                    </div>
                </div>
                <div className='resultspage__posts--third'> 
                    <div className='resultspage__posts__header'>
                        <h3>{(publicaciones[2] === null || publicaciones[2] === undefined) ? '0.00%' : publicaciones[2]?.similitud + '%'}</h3>
                        <small>de coincidencia</small>
                    </div>
                    <div className='resultspage__posts__post'>
                    <PostComponent publicacion={publicaciones[2] || null} onClick={(publicacionId) => redirectWithPublicacion(publicacionId)}/>
                    </div>
                </div>
            </section>
        </div>
        
    );
}

export default ResultsPage;
