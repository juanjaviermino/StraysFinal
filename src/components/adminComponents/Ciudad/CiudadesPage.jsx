import React, { useEffect, useState, useRef } from 'react';
import CiudadesTable from './CiudadesTable'; // EDITABLE
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
const apiEndpoint = import.meta.env.VITE_APP_API;
const API_BASE_URL = `${apiEndpoint}/ciudad`;

import { useCiudades } from '../../../services/useCiudades';
import { useProvincias } from '../../../services/useProvincias';

function CiudadesPage () {

    const toast = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [object, setObject] = useState({});
    const [selectedId, setSelectedId] = useState(null);
    const { createObject, updateObject, deleteObject } = useCiudades(); //EDITABLE
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProvincia, setSelectedProvincia] = useState(null);

    const [isRefreshing, setIsRefreshing] = useState(false); // Para los dropdowns
    const { provincias, error: errorP, isLoading: isLoadingP, isValidating: isValidatingP, refresh: refreshP  } = useProvincias(); 

    const getData = async () => {
        setIsLoading(true); // Set loading to true before the request starts
        try {
            const response = await fetch(`${API_BASE_URL}/${selectedId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Remove the body from GET request as it's not needed
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setData(data); // Set the data from the response
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un problema al recuperar los datos',
                life: 3000,
            });
            setIsEditing(false);
            setData(null); // Reset the data on error
        } finally {
            setIsLoading(false); // Set loading to false after the request finishes
        }
    };

    useEffect(()=>{
        if(isEditing){
            setSelectedProvincia(provincias?.find(prov => prov.id === data?.provinciaId));
            const dataETL = {
                nombre: data?.nombre,
                provinciaId: data?.provinciaId  
            };
            setObject(dataETL);
        }else{
            setObject({});
        }
    }, [isEditing, data]);

    const resetStates = () => {
        setObject({});
        setIsEditing(false);
        setSelectedId(null);
        setSelectedProvincia(null);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setObject({ ...object, [name]: value }); // EDITABLE
    };

    useEffect(()=>{
        if(selectedId){
            getData();
        }
    }, [selectedId])

    const onSelect = (obj) => {
        setSelectedId(obj);
        setIsEditing(true);
    };

    const onUnselect = (e) => {
        setIsEditing(false);
    };

    // ############ Dropdowns #################
    
    useEffect(()=>{
        if(selectedProvincia){
            setObject({ ...object, provinciaId: selectedProvincia.id });    
        }
    }, [selectedProvincia]);

    const refreshData = (e) => {
        e.preventDefault();
        setIsRefreshing(true);
        refreshP();
    }; // Refresca los datos del los dropdowns: GENERAL

    useEffect(() => {
        if (isRefreshing) {
            setIsRefreshing(false);
        }
    }, [isValidatingP]);

    const optionTemplate = (option) => {
        return (
            <div className="dropdown-item-container">
                <span>{option.nombre}</span>
            </div>
        );
    }; // EDITABLE: template para mostrar las opciones de un dropdown
   
    const selectedValueTemplate = (option, props) => {
        if (option) {
            return (
                <div className="dropdown-item-container">
                    <span>{option.nombre}</span>
                </div>
            );
        }
   
        return <span>{props.placeholder}</span>;
    }; //EDITABLE: template para mostrar el valor seleccionado de un dropdown

    // ############ Fin Dropdowns #################

    const handleCreate = async (e) =>{
        e.preventDefault();
        // Intentar el request usando el servicio

        if(selectedProvincia === null || !object.hasOwnProperty("nombre")  || object.nombre?.trim() === ''){
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Porfavor, llena todos los campos',
                life: 3000,
            });
            return;
        }

        try {
            const response = await createObject(object);
            if (response === 201) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Se añadió el registro con éxito',
                    life: 3000,
                });
                resetStates();
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error',
                life: 3000,
            });
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        // Intentar el request usando el servicio

        if(selectedProvincia === null || !object.hasOwnProperty("nombre")  || object.nombre?.trim() === ''){
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Porfavor, llena todos los campos',
                life: 3000,
            });
            return;
        }
        
        try {
            const response = await updateObject(selectedId, object);
            if (response === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Se editó el registro con éxito',
                    life: 3000,
                });
                resetStates();
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error',
                life: 3000,
            });
        }
    }; 

    const handleDelete = async (e) =>{
        e.preventDefault();
        // Intentar el request usando el servicio
        try {
            const response = await deleteObject(selectedId);
            if (response === 200) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Se eliminó el registro con éxito',
                    life: 3000,
                });
                resetStates();
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error',
                life: 3000,
            });
        }
    };

    return(
        <section className="adminpage gradient-background">
            <Toast ref={toast} />
            <div className="adminpage__header"> 
                <h3>Ciudades</h3>
            </div>
            <div className="adminpage__form">
                <div className="form">
                    {(isLoading && isEditing)  &&
                        <div className="spinnercontainer">
                            <div className="spinnercontainer__spinner" />
                        </div>
                    }
                    {isEditing ? <h2>{`Editar: ${object?.nombre}`}</h2> : <h2>Ingresa una ciudad del Ecuador</h2> }
                    <form className="form__fields">
                        <label htmlFor='nombre'>Nombre <span>*</span></label>
                        <input 
                            id="nombre"
                            type="text" 
                            onChange={handleInputChange}
                            name="nombre"
                            value={object?.nombre || ''}
                            placeholder='Nombre de la ciudad'
                            required
                            maxLength="100"/>
                        <label htmlFor="provincia">Provincia <span>*</span></label>
                        {
                                errorP || !provincias ? (
                                    <div className="dropdown__error">
                                        <div className="dropdown__error-msg">
                                            {isLoadingP || (isRefreshing && isValidatingP) ?
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
                                        value={selectedProvincia}
                                        onChange={e => setSelectedProvincia(e.target.value)}
                                        options={provincias}
                                        optionLabel="nombre"
                                        placeholder="Selecciona una provincia"
                                        filter
                                        virtualScrollerOptions={{ itemSize: 38 }}
                                        valueTemplate={selectedValueTemplate}
                                        itemTemplate={optionTemplate}
                                        style={{width:'100%'}}
                                    />
                                )
                        }   
                        {
                            isEditing ? (
                                <div className="form__udbuttons">
                                    <button onClick={handleDelete} className="button--action alert">
                                        Eliminar
                                    </button>
                                    <button onClick={handleEdit} className="button--action secondary">
                                        Editar
                                    </button>
                                </div>
                            ) : (
                                <button onClick={handleCreate} className="button--action">
                                    Ingresar
                                </button>
                            )

                        }
                        
                    </form>
                </div>
            </div>
            <div className="adminpage__table">
                <CiudadesTable onSelect={onSelect} onUnselect={onUnselect} />
            </div>
        </section>
    );
}

export default CiudadesPage;