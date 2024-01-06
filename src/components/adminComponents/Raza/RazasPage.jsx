import React, { useEffect, useState, useRef } from 'react';
import RazasTable from './RazasTable'; // EDITABLE
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
const apiEndpoint = import.meta.env.VITE_APP_API;
const API_BASE_URL = `${apiEndpoint}/raza`;

import { useRazas } from '../../../services/useRazas';
import { useEspecies } from '../../../services/useEspecies';

function RazasPage () {

    const toast = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [object, setObject] = useState({});
    const [selectedId, setSelectedId] = useState(null);
    const { createObject, updateObject, deleteObject } = useRazas(); //EDITABLE
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEspecie, setSelectedEspecie] = useState(null);

    const [isRefreshing, setIsRefreshing] = useState(false); // Para los dropdowns
    const { especies, error: errorE, isLoading: isLoadingE, isValidating: isValidatingE, refresh: refreshE  } = useEspecies(); 

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
            setSelectedEspecie(especies?.find(esp => esp.id === data?.especieId)); 
            const dataETL = {
                raza: data?.raza,
                especieId: data?.especieId 
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
        setSelectedEspecie(null);
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
        if(selectedEspecie){
            setObject({ ...object, especieId: selectedEspecie.id });    
        }
    }, [selectedEspecie]);

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

    const optionTemplate = (option) => {
        return (
            <div className="dropdown-item-container">
                <span>{option.especie}</span>
            </div>
        );
    }; // EDITABLE: template para mostrar las opciones de un dropdown
   
    const selectedValueTemplate = (option, props) => {
        if (option) {
            return (
                <div className="dropdown-item-container">
                    <span>{option.especie}</span>
                </div>
            );
        }
   
        return <span>{props.placeholder}</span>;
    }; //EDITABLE: template para mostrar el valor seleccionado de un dropdown

    // ############ Fin Dropdowns #################
    
    const handleCreate = async (e) =>{
        e.preventDefault();
        // Intentar el request usando el servicio

        if(selectedEspecie === null || !object.hasOwnProperty("raza")  || object.raza?.trim() === ''){
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

        if(selectedEspecie === null || !object.hasOwnProperty("raza")  || object.raza?.trim() === ''){
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
                <h3>Razas de mascotas</h3>
            </div>
            <div className="adminpage__form">
                <div className="form">
                    {(isLoading && isEditing)  &&
                        <div className="spinnercontainer">
                            <div className="spinnercontainer__spinner" />
                        </div>
                    }
                    {isEditing ? <h2>{`Editar: ${object?.raza}`}</h2> : <h2>Ingresa una raza de mascota</h2> }
                    <form className="form__fields">
                        <label htmlFor='raza'>Raza <span>*</span></label>
                        <input 
                            id="raza"
                            type="text" 
                            onChange={handleInputChange}
                            name="raza"
                            value={object?.raza || ''}
                            placeholder='Raza de la mascota'
                            required
                            maxLength="50"/>
                        <label htmlFor="especie">Especie <span>*</span></label>
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
                                        value={selectedEspecie}
                                        onChange={e => setSelectedEspecie(e.target.value)}
                                        options={especies}
                                        optionLabel="especie"
                                        placeholder="Selecciona una especie"
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
                <RazasTable onSelect={onSelect} onUnselect={onUnselect} />
            </div>
        </section>
    );
}

export default RazasPage;