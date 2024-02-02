import React, { useEffect, useState, useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import PostComponent from './PostComponent';
import PostViewer from './PostViewer';
import { Dropdown } from 'primereact/dropdown';
import { useSelector } from 'react-redux';

// Servicios
const apiEndpoint = import.meta.env.VITE_APP_API;
import { useEspecies } from '../../services/useEspecies';
import { useRazas } from '../../services/useRazas';
import { useCiudades } from '../../services/useCiudades';

function PostsPage (props) {

    // --------------------- Setup ---------------------------

    // toasts:
    const toast = useRef(null);
    const usuario = useSelector(state => state.user.user);

    // dropdowns:
    const { especies, error: errorE, isLoading: isLoadingE, isValidating: isValidatingE, refresh: refreshE  } = useEspecies(); 
    const { razas, error: errorR, isLoading: isLoadingR, isValidating: isValidatingR, refresh: refreshR  } = useRazas(); 
    const { ciudades, error: errorC, isLoading: isLoadingC, isValidating: isValidatingC, refresh: refreshC  } = useCiudades(); 
    const opcionesTipo = [
        {id: 1, tipo: "lost", nombre: "Mascota perdida"},
        {id: 2, tipo: "found", nombre: "Mascota encontrada"}
    ]

    const location = useLocation();
    const navigate = useNavigate();
    const { publicacionId } = location.state || {};

    // --------------------- Estados ---------------------------

    const [posts, setPosts] = useState([]);
    const [searchParameters, setSearchParameters] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentPublicacionId, setCurrentPublicacionId] = useState(null);

    // ---------------------- Mostrar resultados cuando llegue a la página --------

    useEffect(()=>{
        const url = makeUrl();
        if(!publicacionId){
            fetchPosts(url);
        }
    },[])

    useEffect(()=>{
        if(publicacionId){
            fetchPosts(`${apiEndpoint}/publicaciones/filter?publicacionId=${publicacionId}`);
            setCurrentPublicacionId(publicacionId);
        }
    },[publicacionId])

    // ------------------------- Funciones de datos ---------------------------------

    const fetchPosts = async (url) =>{
        try {
            setIsLoading(true);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un error al intentar obtener las publicaciones',
                life: 3000,
            });
            console.log(error);
            setPosts([]);
        } finally{
            setIsLoading(false);
        }
    };

    // ------------------------ Dropdown setup --------------------------

    const refreshData = (e) => {
        e.preventDefault();
        setIsRefreshing(true);
        refreshE();
    }; // Refresca los datos del los dropdowns: GENERAL

    useEffect(() => {
        if (isRefreshing) {
            setIsRefreshing(false);
        }
    }, [isValidatingE]);

    const optionTemplateE = (option) => {
        return (
            <div className="dropdown-item-container">
                <span>{option.especie}</span>
            </div>
        );
    }; // EDITABLE: template para mostrar las opciones de un dropdown
   
    const selectedValueTemplateE = (option, props) => {
        if (option) {
            return (
                <div className="dropdown-item-container">
                    <span>{option.especie}</span>
                </div>
            );
        }
   
        return <span>{props.placeholder}</span>;
    };

    const optionTemplateR = (option) => {
        return (
            <div className="dropdown-item-container">
                <span>{option.raza}</span>
            </div>
        );
    }; // EDITABLE: template para mostrar las opciones de un dropdown
   
    const selectedValueTemplateR = (option, props) => {
        if (option) {
            return (
                <div className="dropdown-item-container">
                    <span>{option.raza}</span>
                </div>
            );
        }
   
        return <span>{props.placeholder}</span>;
    };

    const selectedValueTemplateC = (option, props) => {
        if (option) {
            return (
                <div className="dropdown-item-container">
                    <span>{option.nombre}</span>
                </div>
            );
        }
   
        return <span>{props.placeholder}</span>;
    };

    const optionTemplateC = (option) => {
        return (
            <div className="dropdown-item-container">
                <span>{option.nombre}</span>
            </div>
        );
    };

    // -------------- make url ----------------

    const makeUrl = () => {
        let url = `${apiEndpoint}/publicaciones/filter?`;
        const params = [];

        if (searchParameters.selectedCiudad?.id) {
            params.push(`ciudadId=${searchParameters.selectedCiudad.id}`);
        }
        if (searchParameters.selectedEspecie?.id) {
            params.push(`especieId=${searchParameters.selectedEspecie.id}`);
        }
        if (searchParameters.selectedRaza?.id) {
            params.push(`razaId=${searchParameters.selectedRaza.id}`);
        }
        if (searchParameters.fecha_start) {
            params.push(`fechaStart=${searchParameters.fecha_start}`);
        }
        if (searchParameters.fecha_end) {
            params.push(`fechaEnd=${searchParameters.fecha_end}`);
        }
        if (searchParameters.usuarioId) {
            params.push(`usuarioId=${searchParameters.usuarioId}`);
        }
        if (searchParameters.selectedTipo) {
            params.push(`tipo=${searchParameters.selectedTipo.tipo}`);
        }

        return url + params.join('&');
    };

    // useEffect hook to trigger URL update when searchParameters change
    useEffect(() => {
        const url = makeUrl();
        if(!publicacionId){
            fetchPosts(url);
        }
    }, [searchParameters]);

    useEffect(()=>{
        console.log(searchParameters);
        const url = makeUrl();
        console.log('URL: ', url);
    },[searchParameters])

    return(
        <div className='postspage gradient-background2'>
            <Toast ref={toast} />
            {(isLoading)  &&
                <div className="spinnercontainer">
                    <div className="spinnercontainer__spinner" />
                </div>
            }
            <section className='postspage__actions'>
                {
                    publicacionId && 
                    <div className='postspage__actions--overlay'>
                        <button className='button--common' style={{width: '180px'}} onClick={(e) => {navigate('/StraysFinal/view_posts_page'); setSearchParameters({}); setCurrentPublicacionId(null)}}>
                            <i className="pi pi-images"></i>
                            <span>Todos los posts</span>
                        </button>
                    </div>
                }
                <div className='postspage__actions-item'>
                    <Avatar icon="pi pi-user" size="medium" style={{ backgroundColor: '#604bdc', color: '#ffffff' }} shape="circle" />
                    <p>{`${usuario.name} ${usuario.lastname}`}</p>
                </div>
                <div className="form__fields-dropdown" style={{width:'auto'}}>
                        <Dropdown
                            value={searchParameters.selectedTipo}
                            onChange={(e) => setSearchParameters({...searchParameters, selectedTipo: e.value ? e.value : null})}
                            options={opcionesTipo}
                            optionLabel="nombre"
                            placeholder="Tipo"
                            filter
                            showClear
                            virtualScrollerOptions={{ itemSize: 38 }}
                            valueTemplate={selectedValueTemplateC}
                            itemTemplate={optionTemplateC}
                            style={{maxHeight:'100%', maxWidth: '150px'}}
                        /> 
                    </div>
                <div className="form__fields-dropdown" style={{width:'auto'}}>
                        {
                            errorC || !ciudades ? (
                                <div className="dropdown__error">
                                    <div className="dropdown__error-msg">
                                        {isLoadingC || (isRefreshing && isValidatingC) ?
                                            <div className="spinnercontainer__spinner--small" />
                                            :
                                        <span>Ocurrió un error</span>}
                                    </div>
                                    <button className="button--rounded-icon" onClick={refreshData}>
                                        <i className="pi pi-refresh" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                                    </button>
                                </div>
                            ) : (
                                <Dropdown
                                    value={searchParameters.selectedCiudad}
                                    onChange={(e) => setSearchParameters({...searchParameters, selectedCiudad: e.value ? e.value : null})}
                                    options={ciudades}
                                    optionLabel="nombre"
                                    placeholder="Ciudad"
                                    filter
                                    showClear
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    valueTemplate={selectedValueTemplateC}
                                    itemTemplate={optionTemplateC}
                                    style={{maxHeight:'100%', maxWidth: '150px'}}
                                />
                            )
                        }   
                    </div>
                <div className="form__fields-dropdown" style={{width:'auto'}}>
                        {
                            errorE || !especies ? (
                                <div className="dropdown__error">
                                    <div className="dropdown__error-msg">
                                        {isLoadingE || (isRefreshing && isValidatingE) ?
                                            <div className="spinnercontainer__spinner--small" />
                                            :
                                        <span>Ocurrió un error</span>}
                                    </div>
                                    <button className="button--rounded-icon" onClick={refreshData}>
                                        <i className="pi pi-refresh" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                                    </button>
                                </div>
                            ) : (
                                <Dropdown
                                    value={searchParameters.selectedEspecie}
                                    onChange={(e) => setSearchParameters({...searchParameters, selectedEspecie: e.value ? e.value : null})}
                                    options={especies}
                                    optionLabel="especie"
                                    placeholder="Especie"
                                    filter
                                    showClear
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    valueTemplate={selectedValueTemplateE}
                                    itemTemplate={optionTemplateE}
                                    style={{maxHeight:'100%', maxWidth: '150px'}}
                                />
                            )
                        }   
                    </div>
                    <div className="form__fields-dropdown" style={{width:'auto'}}>
                        {
                            errorR || !razas ? (
                                <div className="dropdown__error">
                                    <div className="dropdown__error-msg">
                                        {isLoadingR || (isRefreshing && isValidatingR) ?
                                            <div className="spinnercontainer__spinner--small" />
                                            :
                                        <span>Ocurrió un error</span>}
                                    </div>
                                    <button className="button--rounded-icon" onClick={refreshData}>
                                        <i className="pi pi-refresh" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                                    </button>
                                </div>
                            ) : (
                                <Dropdown
                                    value={searchParameters.selectedRaza}
                                    onChange={(e) => setSearchParameters({...searchParameters, selectedRaza: e.value ? e.value : null})}
                                    options={razas}
                                    optionLabel="raza"
                                    placeholder="Raza"
                                    filter
                                    showClear
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    valueTemplate={selectedValueTemplateR}
                                    itemTemplate={optionTemplateR}
                                    style={{maxHeight:'100%', maxWidth: '150px'}}
                                />
                            )
                        }   
                    </div>
                    <p>Desde: </p>
                    <input 
                        type="date" 
                        value={searchParameters.fecha_start || ''}
                        onChange={(e) => setSearchParameters({...searchParameters, fecha_start: e.target.value ? e.target.value : null})} 
                    />
                    <p>Hasta: </p>
                    <input 
                        type="date" 
                        value={searchParameters.fecha_end || ''}
                        onChange={(e) => setSearchParameters({...searchParameters, fecha_end: e.target.value ? e.target.value : null})} 
                    />
                    {
                        searchParameters.usuarioId ?
                        <button className='button--common' style={{width: '180px'}} onClick={(e) => setSearchParameters({...searchParameters, usuarioId: null})}>
                            <i className="pi pi-images"></i>
                            <span>Todos los posts</span>
                        </button> :
                        <button className='button--common' style={{width: '180px'}} onClick={(e) => setSearchParameters({...searchParameters, usuarioId: usuario.id})}>
                            <i className="pi pi-images"></i>
                            <span>Mis posts</span>
                        </button>
                    }
                    <button className="button--rounded-icon" onClick={()=> setSearchParameters({})}>
                        <i className="pi pi-filter-slash" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                    </button>
                    
            </section>
            <section className='postspage__posts-space' style={{gridTemplateColumns: !currentPublicacionId && '100% 0%'}}>
                <div className='postspage__posts' style={{justifyContent: publicacionId && 'center'}}>
                    {posts.map((post, index) => (
                        <div className='postspage__post'>
                            <PostComponent key={index} publicacion={post} onClick={(publicacionId) => setCurrentPublicacionId(publicacionId)}/>
                        </div>
                    ))}
                </div>
                <div className='postspage__info' style={{display: !currentPublicacionId && 'none'}}>
                        <PostViewer publicacionId={currentPublicacionId} closeViewer={()=>setCurrentPublicacionId(null)}/>
                </div>
            </section>
            
        </div>
    );
}

export default PostsPage;
