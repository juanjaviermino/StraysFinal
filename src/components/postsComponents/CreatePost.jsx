import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from "primereact/checkbox";

// Servicios
import { useEspecies } from '../../services/useEspecies';
import { usePosts } from '../../services/usePosts';
import { useColors } from '../../services/useColors';
import Map from './Map';

const apiEndpoint = import.meta.env.VITE_APP_API;

function CreatePost () {

    // -------------------------- Setup ----------------------------

    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const imgRef = useRef(null);
    const opImagen = useRef(null);
    const usuario = useSelector(state => state.user.user);
    const navigate = useNavigate();
    const { especies, error: errorE, isLoading: isLoadingE, isValidating: isValidatingE, refresh: refreshE  } = useEspecies(); 
    const { createObject } = usePosts();
    const { createObject: createColor } = useColors();

    // ------------------------ Utilidades ----------------------------

    const opcionesTipo = [
        {id: 1, tipo: "lost", displayName: "Mascota perdida"},
        {id: 2, tipo: "found", displayName: "Mascota encontrada"}
    ]

    const defaultNewPost = {
        tipo: '',
        latitud: '',
        longitud: '',
        descripcion: '',
        especieId: '',
        razaId: '',
        file: ''
    }; // usuario y fecha añadir a la hora del post

    const defaultRequiredFields = {
        tipo: false,
        latitud: false,
        longitud: false,
        descripcion: false,
        especieId: false,
        file: false
    };

    const coloresOptions = [
        { id: 1, colorHex: "#000000", displayName: "Negro" },
        { id: 2, colorHex: "#FFFFF0", displayName: "Blanco" },
        { id: 3, colorHex: "#A52A2A", displayName: "Café" },
        { id: 4, colorHex: "#D2B48C", displayName: "Tan" },
        { id: 5, colorHex: "#808080", displayName: "Gris" },
        { id: 6, colorHex: "#FFD700", displayName: "Golden" },
        { id: 7, colorHex: "#FFFDD0", displayName: "Cream" },
        { id: 8, colorHex: "#D2691E", displayName: "Canela" },
        { id: 9, colorHex: "#E5AA70", displayName: "Fawn" },
    ]

    // ------------------------ Estados -------------------------------

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [requiredFields, setRequiredFields] = useState(defaultRequiredFields);

    const [newPost, setNewPost] = useState(defaultNewPost);
    const [selectedEspecie, setSelectedEspecie] = useState(null);
    const [selectedRaza, setSelectedRaza] = useState(null);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentSelectedColor, setCurrentSelectedColor] = useState(null);
    const [colorList, setColorList] = useState([]);
    const [mapVisible, setMapVisible] = useState(false);
    const [coordinatesExist, setCoordinatesExist] = useState(false);

    // Image cropping

    const [crop, setCrop] = useState({ aspect: 1 });
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [aspect, setAspect] = useState(1 / 1);
    
    // ------------------------ Funciones -------------------------------

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (requiredFields.hasOwnProperty(name)) {
            const updatedRequiredFields = { ...requiredFields };
            updatedRequiredFields[name] = false; // Reset to false if the required field has been edited
            setRequiredFields(updatedRequiredFields);
        }
        setNewPost(prev => ({ ...prev, [name]: value }));
    }; 

    const isEmptyValue = value => {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (typeof value === 'number') return isNaN(value) || value === 0;
        if (Array.isArray(value)) return value.length === 0;
        return false;
    }; // Verifica si un valor específico está vacío

    const resetStates = () =>
    {
        setRequiredFields(defaultRequiredFields);
        setNewPost(defaultNewPost);
        setSelectedEspecie(null);
        setSelectedRaza(null);
        setSelectedTipo(null);
        setSelectedFile(null);
        setCurrentSelectedColor(null);
        setCrop({ aspect: 1 });
        setCroppedImageUrl(null);
        setAspect(1 / 1);
    }

    const validateRequiredFields = (obj) => {
        const updatedRequiredFields = { ...defaultRequiredFields };
        Object.keys(updatedRequiredFields).forEach(key => {
            updatedRequiredFields[key] = isEmptyValue(obj[key]);
        });
        setRequiredFields(updatedRequiredFields);
        return Object.values(updatedRequiredFields).some(value => value);
    }; // Valida que los campos en REQUIRED_FIELDS no estén vacíos en el nuevo objeto

    const formatDate = (date) => {
        return date.toISOString().split('T')[0]; // This will format the date as 'YYYY-MM-DD'
    };

    const handleCreate = async (e) =>{
        e.preventDefault();
        
        // Verificar si existe algun campo requerido vacío
        const anyFieldEmpty = validateRequiredFields(newPost);

        if (anyFieldEmpty || !croppedImageUrl) {
            toast.current.show({
                severity: 'info',
                summary: 'Alerta',
                detail: 'Porfavor, llena todos los campos requeridos',
                life: 3000,
            });
            return;
        } 

        let status;
        let data;

        try {
            setIsLoading(true);
            const newPostfinal = {
                ...newPost,
                fecha: formatDate(new Date()),
                usuarioId: usuario.id
            }
            const response = await createObject(newPostfinal);

            status = response.status;

            if (response.status === 201) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Tu publicación se creó con éxito',
                    life: 3000,
                });
                data = await response.json();
                resetStates();
                // Espera 3 segundos y luego debe redirigir a la página de los matches
                setTimeout(() => {
                    navigate('/StraysFinal/post_results', { state: { postId: data.publicacionId } });  
                }, 2000);
            } else{
                throw new Error('Hubo un error al crear la publicación');
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al intentar crear la publicación',
                life: 3000,
            });
            
        } finally{
            if(status === 201 && data){
                if(colorList.length > 0){
                    colorList.forEach(async color => {
                        try {
                            await createColor(color.colorHex, data.publicacionId);
                        } catch (uploadError) {
                            console.error(uploadError);
                        } finally {
                            setColorList([]);
                        }
                    });
                }
            }
            setIsLoading(false);
        }
    };

    // ------------------------ Poblar las razas de acuerdo a la especie ------

    const [razasOptions, setRazasOptions] = useState([]);
    const [razasLoading, setRazasLoading] = useState(false);
    const fetchRazasData = async (especie, e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (especie && especie.id) {
            try {
                setRazasLoading(true);
                const url = `${apiEndpoint}/raza/especie/${especie.id}`;
                const res = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("Recurso no encontrado");
                    }
                    throw new Error("Hubo un problema con el servidor, intenta de nuevo");
                }

                const fetchedData = await res.json();

                if (fetchedData.length > 0) {
                    setRazasOptions(fetchedData);
                } else {
                    setRazasOptions([]);
                }
            } catch (error) {
                setRazasOptions([]);
            } finally {
                setRazasLoading(false);
            }
        }
    }; 
    useEffect(() => {
        if (selectedEspecie) {
            fetchRazasData(selectedEspecie);
        }
    }, [selectedEspecie]) 

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

    const optionTemplateT = (option) => {
        return (
            <div className="dropdown-item-container">
                <span>{option.displayName}</span>
            </div>
        );
    }; // EDITABLE: template para mostrar las opciones de un dropdown
   
    const selectedValueTemplateT = (option, props) => {
        if (option) {
            return (
                <div className="dropdown-item-container">
                    <span>{option.displayName}</span>
                </div>
            );
        }
   
        return <span>{props.placeholder}</span>;
    };

    const optionTemplateC = (option) => {
        return (
            <div className="dropdown-item-container--color">
                <span>{option.displayName}</span>
                <div className='colorBodyTemplate__color' style={{backgroundColor: option.colorHex, maxWidth: '40px'}}></div>
            </div>
        );
    }; // EDITABLE: template para mostrar las opciones de un dropdown
   
    const selectedValueTemplateC = (option, props) => {
        if (option) {
            return (
                <div className="dropdown-item-container--color">
                    <span>{option.displayName}</span>
                </div>
            );
        }
   
        return <span>{props.placeholder}</span>;
    };

    // ------------------------ Dropdown object mapping --------------------------

    useEffect(() => {
        if (selectedEspecie) {
            setNewPost(prev => ({
                ...prev,
                especieId: selectedEspecie.id
            }));
        }
    }, [selectedEspecie]);

    useEffect(() => {
        if (selectedRaza) {
            setNewPost(prev => ({
                ...prev,
                razaId: selectedRaza.id
            }));
        }
    }, [selectedRaza]);

    useEffect(() => {
        if (selectedTipo) {
            setNewPost(prev => ({
                ...prev,
                tipo: selectedTipo.tipo
            }));
        }
    }, [selectedTipo]);

    useEffect(() => {
        if (selectedFile) {
            opImagen.current.toggle(false);
            if(!croppedImageUrl){
                toast.current.show({ severity: 'info', summary: 'Corta la imagen', detail: 'Porfavor corta la imagen haciendo click en ella' });
            }
        }
    }, [selectedFile]);

    useEffect(()=>{
        if(croppedImageUrl){
            setNewPost(prev => ({
                ...prev,
                file: croppedImageUrl
            }));
        }
    },[croppedImageUrl])

    /* ------------------------ Lógica para la carga de la imagen -------------------------------- */

    const onTemplateError = (e) => {
        // Check if the error is due to file size
        if (e.files[0].size > 2097152) { // 2MB in bytes
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'El archivo es demasiado grande. El tamaño máximo es de 2MB.' });
        } else {
            // Handle other errors
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al cargar el archivo.' });
        }
    }

    const onTemplateSelect = (e) => {
        // Original files list
        const originalFiles = e.files;

        // Filter out any 'files' that are actually folders (they have an empty 'type')
        const validFiles = originalFiles.filter(file => file.type !== "");

        // Check if any folders were filtered out
        if (validFiles.length !== originalFiles.length) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pueden cargar carpetas' });
        }

        // Update the file list in the FileUpload component
        if (fileUploadRef && fileUploadRef.current) {
            fileUploadRef.current.setFiles(validFiles);
        }

        if (validFiles[0]) {
            setSelectedFile(validFiles[0].objectURL);
        }
    };

    const onTemplateClear = () => {
        setSelectedFile(null);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, cancelButton } = options;

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    };

    const onTemplateRemove = (file, callback) => {
        setSelectedFile(null);
        callback();
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="logo-picker-container">
                <span className="file-name">
                    {file.name}
                </span>
                <button className="button--rounded-icon" onClick={() => onTemplateRemove(file, props.onRemove)} >
                    <i className="pi pi-delete-left" style={{ color: 'white', fontSize: '16px' }}></i>
                </button>
            </div>
        );
    };
    
    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <span className="dragndrop-msg">
                    Arrastra y suelta la imagen aquí
                </span>
            </div>
        );
    };
    
    const chooseOptions = { icon: 'pi pi-folder-open', iconOnly: true, className: 'custom-choose-btn select-doc-btn' };
    const cancelOptions = { icon: 'pi pi-times', iconOnly: true, className: 'custom-cancel-btn delete-doc-btn' };
    
    // ------------------------- Image related functions ----------------------------------------------------------

    const handleLoaderToggle = (e) =>{
        e.preventDefault();
        opImagen.current.toggle(e);
    }

    // ------------------------- Color related functions ----------------------------------------------------------

    const addColorToList = (e) => {
        e.preventDefault();
    
        if (currentSelectedColor) {
            if (!colorList.some(color => color.id === currentSelectedColor.id)) {
                setColorList([...colorList, { colorHex: currentSelectedColor.colorHex }]);
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Alerta',
                    detail: 'El color ya está en la lista',
                    life: 3000,
                });
            }
        } else {
            toast.current.show({
                severity: 'info',
                summary: 'Alerta',
                detail: 'Primero selecciona un color',
                life: 3000,
            });
        }
    };

    const colorBodyTemplate = (data) => {
        return (
            <div className='colorBodyTemplate' >
                <div className='colorBodyTemplate__color' style={{ backgroundColor: data?.colorHex }}>
                    
                </div>
            </div>
        );
    }; 

    // Function to remove a color from the list
    const removeColorFromList = (colorToRemove) => {
        setColorList(colorList.filter(color => color.colorHex !== colorToRemove.colorHex));
    };

    // Updated actionsBodyTemplate
    const actionsBodyTemplate = (rowData) => {
        return (
            <div className='actionsBodyTemplate'>
                <button 
                    className="button--rounded-icon" 
                    onClick={() => removeColorFromList(rowData)}
                >
                    <i className="pi pi-delete-left" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                </button>
            </div>
        );
    };

    // ------------------------- Image cropping related functions ----------------------------------------------------------
    
    const getCroppedImg = (image, crop) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
     
        ctx.drawImage(
           image,
           crop.x * scaleX,
           crop.y * scaleY,
           crop.width * scaleX,
           crop.height * scaleY,
           0,
           0,
           crop.width,
           crop.height
        );
     
        return new Promise((resolve) => {
           canvas.toBlob(blob => {
              if (!blob) {
                 console.error('Canvas is empty');
                 return;
              }
              blob.name = 'cropped.jpg';
              window.URL.revokeObjectURL(croppedImageUrl);
              const croppedUrl = window.URL.createObjectURL(blob);
              setCroppedImageUrl(croppedUrl);
              resolve(croppedUrl);
           }, 'image/jpeg', 1);
        });
    };

    const removeSelectedImage = (e) =>{
        e.preventDefault();
        setCrop({ aspect: 1 });
        setSelectedFile(null);
        setCroppedImageUrl(null);
        setAspect(1 / 1);
    }

    // ------------------------- Maps related functions ----------------------------------------------------------

    useEffect(()=>{
        if(!isEmptyValue(newPost.latitud) && !isEmptyValue(newPost.longitud)){
            setCoordinatesExist(true);
        } else{
            setCoordinatesExist(false);
        }
        console.log(newPost);
    }, [newPost])

    const setCoordinates = (marker) =>{
        const lat = marker.lat;
        const lng = marker.lng;

        if(lat && lng){
            setNewPost(prev => ({
                ...prev,
                latitud: lat.toFixed(6), 
                longitud: lng.toFixed(6)
            }));
        }
    }

    return(
        <div className="postpage gradient-background2">
            <Toast ref={toast} />
            <div className="postpage__image"> 
                <div className='postpage__imgcontainer' onClick={(e) => { !selectedFile && handleLoaderToggle(e) }}>
                    {selectedFile ? 
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => getCroppedImg(imgRef.current, c)}
                            aspect={aspect}
                            className='postpage__imgcontainer__cropper'
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={selectedFile}
                            />
                        </ReactCrop>
                        :
                        <i className="pi pi-image"></i>
                    }
                    {
                        selectedFile &&
                        <button className="button--rounded-icon postpage__imgcontainer__exit" onClick={(e) => removeSelectedImage(e)}>
                            <i className="pi pi-times" style={{ fontSize: '0.6rem', margin: '0' }}></i>
                        </button>
                    }
                </div>
            </div>
            <div className="postpage__formspace">
                <div className="postpage__formspace__form ">
                    {(isLoading)  &&
                        <div className="spinnercontainer">
                            <div className="spinnercontainer__spinner" />
                        </div>
                    }
                    <h2>Nuevo Post</h2> 
                    <p>Toda esta información nos ayudará a encontrar coincidencias para tu publicación con mayor precisión</p>
                    <form className="form__fields form__fields--createpost">
                        <div className="form__fields--createpostMainInfo">
                            <div className="form__fields--createpostMainInfoItem1">
                                <label>Imagen de la mascota<span>*</span></label>
                                <div className="form__fields--createpostMainInfoItem1-img">
                                    {
                                        croppedImageUrl ? 
                                        <img src={croppedImageUrl}></img>:
                                        <img src={croppedImageUrl}></img>
                                    }
                                </div>
                            </div>
                            <div className="form__fields--createpostMainInfoItem2">
                                <label>Tipo de publicación <span>*</span></label>
                                    <div className="form__fields-dropdown">
                                        <Dropdown
                                            value={selectedTipo}
                                            onChange={(e) => setSelectedTipo(e.value)}
                                            options={opcionesTipo}
                                            optionLabel="displayName"
                                            placeholder="Selecciona un tipo de publicación"
                                            showClear
                                            virtualScrollerOptions={{ itemSize: 38 }}
                                            valueTemplate={selectedValueTemplateT}
                                            itemTemplate={optionTemplateT}
                                            style={{width:'100%'}}
                                        /> 
                                    </div>
                                <label>Descripción <span>*</span></label>
                                    <textarea 
                                        id="descripcion"
                                        type="text" 
                                        onChange={handleInputChange} 
                                        name="descripcion"
                                        value={newPost?.descripcion || ''}
                                        placeholder='Aquí va la descripción de tu publicación. Cuéntanos tu historia'
                                        required
                                        maxLength="1000"/>
                            </div>
                        </div>
                        <hr></hr>
                        <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center'}}>
                            <label>Ubicación <span>*</span></label>
                            <div style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                                <Button style={{borderRadius: '10px', fontSize: '14px', height: '35px', margin: '0'}} label="Ubicación" icon="pi pi-map-marker" onClick={() => setMapVisible(true)} />
                                <span style={{fontFamily: 'roboto', color: 'white', fontSize: '12px', marginLeft: '20px' }}>¿Ubicación ingresada? (requerido)</span>
                                <Checkbox style={{marginLeft: '10px'}} disabled onChange={e => setCoordinatesExist(e.checked)} checked={coordinatesExist}></Checkbox>
                            </div>
                        </div> 
                        <hr></hr>
                        <div className="form__fields--createpostEspecieInfo">
                            <div style={{width: '50%'}}>
                                <label>Especie <span>*</span></label>
                                <div className="form__fields-dropdown">
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
                                                onChange={(e) => setSelectedEspecie(e.value)}
                                                options={especies}
                                                optionLabel="especie"
                                                placeholder="Selecciona una especie"
                                                filter
                                                showClear
                                                virtualScrollerOptions={{ itemSize: 38 }}
                                                valueTemplate={selectedValueTemplateE}
                                                itemTemplate={optionTemplateE}
                                                style={{width:'100%'}}
                                            />
                                        )
                                    }   
                                </div>
                            </div>
                            <div style={{width: '50%'}}>
                                <label>Raza</label>
                                <div className="form__fields-dropdown">
                                {
                                    razasOptions.length === 0 ? (
                                        <div className="dropdown-error">
                                            <div className="dropdown-error-msg">
                                                {razasLoading ?
                                                    <div className="small-spinner" /> :
                                                    <span>No hay razas que mostrar</span>}
                                            </div>
                                            <button className="button--rounded-icon" onClick={(e) => fetchRazasData(selectedEspecie, e)}>
                                                <i className="pi pi-refresh" style={{ fontSize: '0.8rem', margin: '0' }}></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <Dropdown
                                            showClear
                                            style={{ width: '100%' }}
                                            value={selectedRaza}
                                            onChange={(e) => setSelectedRaza(e.value)}
                                            options={razasOptions}
                                            optionLabel="raza"
                                            placeholder="Selecciona una raza"
                                            filter
                                            virtualScrollerOptions={{ itemSize: 38 }}
                                            valueTemplate={selectedValueTemplateR}
                                            itemTemplate={optionTemplateR}
                                        />
                                    )
                                }
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="form__fields--createpostColorInfo">
                            <div className="form__fields--createpostColorInfoItem1">
                                <label>Color (máx. 3)</label>
                                    <div className="form__fields-dropdown">
                                        <Dropdown
                                            value={currentSelectedColor}
                                            onChange={(e) => setCurrentSelectedColor(e.value)}
                                            options={coloresOptions}
                                            optionLabel="displayName"
                                            placeholder="Selecciona un color"
                                            showClear
                                            virtualScrollerOptions={{ itemSize: 38 }}
                                            valueTemplate={selectedValueTemplateC}
                                            itemTemplate={optionTemplateC}
                                            style={{width:'100%'}}
                                        /> 
                                    </div>
                                <button disabled={colorList.length>2} className='button--common' onClick={(e)=>addColorToList(e)}>
                                    <i className="pi pi-image"></i>
                                    <span>Agregar color</span>
                                </button>
                            </div>
                            <div className="form__fields--createpostColorInfoItem2">
                                <label>Colores</label>
                                <div className='table table--colors'> 
                                    <DataTable value={colorList} emptyMessage="Selecciona un color">
                                        <Column body={colorBodyTemplate} field="colorHex" header="Color"></Column>
                                        <Column field="colorHex" header="Valor"></Column>
                                        <Column body={actionsBodyTemplate} style={{maxWidth: '20px'}}></Column>
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleCreate} className="button--action">
                            Publicar
                        </button>
                    </form>
                </div>
            </div>    
            <OverlayPanel ref={opImagen} showCloseIcon>
                <div>
                    <FileUpload ref={fileUploadRef} accept="image/*" maxFileSize={2097152}
                        onError={onTemplateError} onSelect={onTemplateSelect} onClear={onTemplateClear} 
                        headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                        chooseOptions={chooseOptions} cancelOptions={cancelOptions}
                        invalidFileSizeMessageSummary="Tamaño de imagen inválido"
                        invalidFileSizeMessageDetail="La imagen es demasiado grande. El tamaño máximo es de 2MB" />
                </div>
            </OverlayPanel>
            <Dialog header="Ingresa la ubicación de la mascota" visible={mapVisible} style={{ width: '70vw', height: '70vh' }} onHide={() => setMapVisible(false)}>
                <Map setCoordinates={setCoordinates}/>
            </Dialog>
        </div>
    );
}

export default CreatePost;
