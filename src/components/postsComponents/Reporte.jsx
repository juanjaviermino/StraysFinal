import React, { useEffect, useState, useRef, PureComponent} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { useSelector } from 'react-redux';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Text } from 'recharts';


// Servicios
const apiEndpoint = import.meta.env.VITE_APP_API;
import { useEspecies } from '../../services/useEspecies';
import { useRazas } from '../../services/useRazas';
import { useCiudades } from '../../services/useCiudades';

function Reporte (props) {

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
            fetchPosts(`${apiEndpoint}/publicaciones/count_by_raza?publicacionId=${publicacionId}`);
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
        let url = `${apiEndpoint}/publicaciones/count_by_raza?`;
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
            console.log(url);
        }
    }, [searchParameters]);

    useEffect(()=>{
        console.log(searchParameters);
    },[searchParameters])

    const CustomXAxisTick = ({ x, y, payload }) => {
        const style = {
            fontSize: 8,
            fill: 'white', // Text color
            fontWeight: 'bold', 
        };
    
        // Assuming payload.value is a date string
        const value = payload.value; 
    
        return (
            <g>
                <Text x={x} y={y + 8} textAnchor="middle" verticalAnchor="start" style={style}>
                    {value}
                </Text>
            </g>
        );
    };

    const CustomYAxisTick = ({ x, y, payload }) => {
        const style = {
            fontSize: 12,
            fill: 'white', // Text color
            fontWeight: 'bold', 
        };
    
        // Assuming payload.value is a date string
        const value = payload.value; 
    
        return (
            <g>
                <Text x={x-10} y={y} textAnchor="middle" verticalAnchor="middle" style={style}>
                    {value}
                </Text>
            </g>
        );
    };

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
                    <button className="button--rounded-icon" onClick={()=> setSearchParameters({})}>
                        <i className="pi pi-filter-slash" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                    </button>
                    <button className="button--rounded-icon" onClick={()=> setSearchParameters({})}>
                        <i className="pi pi-filter-slash" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                    </button>
                    
            </section>
            <section className='chart'>
                <div className='chart__title'>
                    <p>Reporte de razas perdidas</p>
                    <small>{searchParameters.fecha_start && `Desde: ${searchParameters.fecha_start} `}{searchParameters.fecha_end && `Hasta: ${searchParameters.fecha_end}`}</small>
                </div>
                
                <div className='chartcontainer'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={posts}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="raza" tick={<CustomXAxisTick />} interval={0}/>
                        <YAxis dataKey="count" tick={<CustomYAxisTick />}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" activeBar={<Rectangle fill="purple" stroke="purple" />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
            
        </div>
    );
}

export default Reporte;
