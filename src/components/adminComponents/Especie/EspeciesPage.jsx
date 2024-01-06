import React, { useEffect, useState, useRef } from 'react';
import EspeciesTable from './EspeciesTable';
import { Toast } from 'primereact/toast';
const apiEndpoint = import.meta.env.VITE_APP_API;
const API_BASE_URL = `${apiEndpoint}/especie`;

import { useEspecies } from '../../../services/useEspecies';

function EspeciesPage () {

    const toast = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [object, setObject] = useState({});
    const [selectedId, setSelectedId] = useState(null);
    const { createObject, updateObject, deleteObject } = useEspecies();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            console.error("Fetching data failed", error);
            setIsEditing(false);
            setData(null); // Reset the data on error
        } finally {
            setIsLoading(false); // Set loading to false after the request finishes
        }
    };

    useEffect(()=>{
        if(selectedId){
            getData();
        }
    }, [selectedId])

    useEffect(()=>{
        if(isEditing){
            setObject(data);
        }else{
            setObject({});
        }
    }, [isEditing, data]);

    const resetStates = () => {
        setObject({});
        setIsEditing(false);
        setSelectedId(null);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setObject({ ...object, [name]: value }); // EDITABLE
    };

    const onSelect = (obj) => {
        setSelectedId(obj);
        setIsEditing(true);
    };

    const onUnselect = (e) => {
        setIsEditing(false);
    };

    const handleCreate = async (e) =>{
        e.preventDefault();
        // Intentar el request usando el servicio
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
                <h3>Especies de mascotas</h3>
            </div>
            <div className="adminpage__form">
                <div className="form">
                    {(isLoading && isEditing)  &&
                        <div className="spinnercontainer">
                            <div className="spinnercontainer__spinner" />
                        </div>
                    }
                    {isEditing ? <h2>{`Editar: ${object?.especie}`}</h2> : <h2>Ingresa una especie de mascota</h2> }
                    <form className="form__fields">
                        <label htmlFor='especie'>Especie <span>*</span></label>
                        <input 
                            id="especie"
                            type="text" 
                            onChange={handleInputChange}
                            name="especie"
                            value={object?.especie || ''}
                            placeholder='Especie de mascota'
                            required
                            maxLength="30"/>
                        
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
                <EspeciesTable onSelect={onSelect} onUnselect={onUnselect} />
            </div>
        </section>
    );
}

export default EspeciesPage;