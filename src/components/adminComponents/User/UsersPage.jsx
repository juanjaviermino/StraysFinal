import React, { useEffect, useState, useRef } from 'react';
import UsersTable from './UsersTable'; // EDITABLE
// import { Toast } from 'primereact/toast';
// const apiEndpoint = import.meta.env.VITE_APP_API;
// const API_BASE_URL = `${apiEndpoint}/ciudad`;

// import { useCiudades } from '../../../services/useCiudades';
// import { useProvincias } from '../../../services/useProvincias';

function UsersPage () {

    // const toast = useRef(null);
    // const [isEditing, setIsEditing] = useState(false);
    // const [object, setObject] = useState({});
    // const [selectedId, setSelectedId] = useState(null);
    // const { createObject, updateObject, deleteObject } = useCiudades(); //EDITABLE
    // const { provincias } = useProvincias(); //EDITABLE
    // const [data, setData] = useState(null);
    // const [isLoading, setIsLoading] = useState(false);
    // const [selectedProvinciaId, setSelectedProvinciaId] = useState('9999');

    // useEffect(()=>{
    //     setObject({ ...object, ['id_provincia']: selectedProvinciaId }); // EDITABLE
    // }, [selectedProvinciaId]);

    // useEffect(() => {
    //     console.log(object);
    // }, [object])

    // const getData = async () => {
    //     setIsLoading(true); // Set loading to true before the request starts
    //     try {
    //         const response = await fetch(`${API_BASE_URL}/${selectedId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             // Remove the body from GET request as it's not needed
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         setData(data); // Set the data from the response
    //     } catch (error) {
    //         console.error("Fetching data failed", error);
    //         setIsEditing(false);
    //         setData(null); // Reset the data on error
    //     } finally {
    //         setIsLoading(false); // Set loading to false after the request finishes
    //     }
    // };

    // useEffect(()=>{
    //     if(isEditing){
    //         setSelectedProvinciaId(data?.id_provincia);
    //         const dataETL = {
    //             nombre: data?.nombre,
    //             id_provincia: data?.id_provincia  
    //         };
    //         setObject(dataETL);
    //     }else{
    //         setObject({});
    //     }
    // }, [isEditing, data]);

    // const resetStates = () => {
    //     setObject({});
    //     setIsEditing(false);
    //     setSelectedId(null);
    //     setSelectedProvinciaId('9999');
    // }

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setObject({ ...object, [name]: value }); // EDITABLE
    // };

    // useEffect(()=>{
    //     if(selectedId){
    //         getData();
    //     }
    // }, [selectedId])

    // const onSelect = (obj) => {
    //     setSelectedId(obj);
    //     setIsEditing(true);
    // };

    // const onUnselect = (e) => {
    //     setIsEditing(false);
    // };

    // const handleCreate = async (e) =>{
    //     e.preventDefault();
    //     // Intentar el request usando el servicio
    //     try {
    //         const response = await createObject(object);
    //         if (response === 201) {
    //             toast.current.show({
    //                 severity: 'success',
    //                 summary: 'Éxito',
    //                 detail: 'Se añadió el registro con éxito',
    //                 life: 3000,
    //             });
    //             resetStates();
    //         }
    //     } catch (error) {
    //         toast.current.show({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Ocurrió un error',
    //             life: 3000,
    //         });
    //     }
    // };

    // const handleEdit = async (e) => {
    //     e.preventDefault();
    //     // Intentar el request usando el servicio
    //     try {
    //         const response = await updateObject(selectedId, object);
    //         if (response === 200) {
    //             toast.current.show({
    //                 severity: 'success',
    //                 summary: 'Éxito',
    //                 detail: 'Se editó el registro con éxito',
    //                 life: 3000,
    //             });
    //             resetStates();
    //         }
    //     } catch (error) {
    //         toast.current.show({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Ocurrió un error',
    //             life: 3000,
    //         });
    //     }
    // }; 

    // const handleDelete = async (e) =>{
    //     e.preventDefault();
    //     // Intentar el request usando el servicio
    //     try {
    //         const response = await deleteObject(selectedId);
    //         if (response === 200) {
    //             toast.current.show({
    //                 severity: 'success',
    //                 summary: 'Éxito',
    //                 detail: 'Se eliminó el registro con éxito',
    //                 life: 3000,
    //             });
    //             resetStates();
    //         }
    //     } catch (error) {
    //         toast.current.show({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Ocurrió un error',
    //             life: 3000,
    //         });
    //     }
    // };

    return(
        <section className="adminpage gradient-background">
            {/* <Toast ref={toast} /> */}
            <div className="adminpage__header"> 
                <h3>Usuarios</h3>
            </div>
            <div className="adminpage__table--users">
                <UsersTable />
            </div>
            
            {/* <div className="adminpage__form">
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
                        <select
                                id="provincia"
                                className="dropdown"
                                value={selectedProvinciaId}
                                onChange={e => setSelectedProvinciaId(e.target.value)}>
                                <option value="9999">Selecciona una opción</option>
                                {provincias?.map(option => (
                                <option key={option.id} value={option.id}>
                                    {option.nombre}
                                </option>
                                ))}
                        </select>
                        
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
            </div> */}
        </section>
    );
}

export default UsersPage;