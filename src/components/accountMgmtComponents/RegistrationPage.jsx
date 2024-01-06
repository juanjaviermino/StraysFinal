import React, {useState, useRef, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUsers } from '../../services/useUsers';
import { useCiudades } from '../../services/useCiudades';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

function RegistrationPage () {

    //----------------- Servicios ----------------------
    const { createObject } = useUsers(); //EDITABLE
    const { ciudades, error: errorC, isLoading: isLoadingC, isValidating: isValidatingC, refresh: refreshC  } = useCiudades();

    //----------------- Setup ---------------------------
    const toast = useRef(null);
    const navigate = useNavigate();

    //----------------- Estados --------------------------
    const [isLoading, setIsLoading] = useState(false); 
    const [isRefreshing, setIsRefreshing] = useState(false); // Para los dropdowns
    const defaultNewUser = {
        name: '',
        lastname: '',
        email: '',
        password: '',
        cellphone: '',
        role: 'user',
        ciudadId: '',
    };
    const defaultRequiredFields = {
        name: false,
        lastname: false,
        email: false,
        password: false,
        cellphone: false,
        ciudadId: false
    };
    const [isAnyEmpty, setisAnyEmpty] = useState(false);
    const [newUser, setNewUser] = useState(defaultNewUser);
    const [requiredFields, setRequiredFields] = useState(defaultRequiredFields);
    const [selectedCiudad, setSelectedCiudad] = useState(null);

    //------------------------- Funciones del componente ---------------------

    // ############ Dropdowns #################
    
    useEffect(() => {
        if (selectedCiudad) {
            setNewUser(prev => ({
                ...prev,
                ciudadId: selectedCiudad.id
            }));
        }
    }, [selectedCiudad]);

    const refreshData = (e) => {
        e.preventDefault();
        setIsRefreshing(true);
        refreshC();
    }; // Refresca los datos del los dropdowns: GENERAL

    useEffect(() => {
        if (isRefreshing) {
            setIsRefreshing(false);
        }
    }, [isValidatingC]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Check if the input name is a key in the requiredFields
        if (requiredFields.hasOwnProperty(name)) {
            const updatedRequiredFields = { ...requiredFields };
            updatedRequiredFields[name] = false; // Reset to false if the required field has been edited
            setRequiredFields(updatedRequiredFields);
        }
    
        // Update the newCliente state with the new value
        setNewUser(prev => ({ ...prev, [name]: value }));
    }; // Maneja el cambio en un input

    const isEmptyValue = value => {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (typeof value === 'number') return isNaN(value) || value === 0;
        if (Array.isArray(value)) return value.length === 0;
        return false;
    }; // Verifica si un valor específico está vacío

    const validateRequiredFields = (obj) => {
        const updatedRequiredFields = { ...defaultRequiredFields };
    
        // Iterate over the required field keys
        Object.keys(updatedRequiredFields).forEach(key => {
            updatedRequiredFields[key] = isEmptyValue(obj[key]);
        });
    
        setRequiredFields(updatedRequiredFields);
    
        // Return true if any of the required fields is empty
        return Object.values(updatedRequiredFields).some(value => value);
    }; // Valida que los campos en REQUIRED_FIELDS no estén vacíos en el nuevo objeto

    const handleCreate = async (e) =>{
        e.preventDefault();
        
        // Verificar si existe algun campo requerido vacío
        const anyFieldEmpty = validateRequiredFields(newUser);

        if (anyFieldEmpty) {
            setisAnyEmpty(true);
            return;
        } else {
            setisAnyEmpty(false);
        }

        try {
            setIsLoading(true);
            const response = await createObject(newUser);
            if (response === 201) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: '¡Bienvenido!',
                    life: 3000,
                });
                // Espera 3 segundos y luego redirige
                setTimeout(() => {
                    // Asumiendo que estás utilizando un Hook de React Router para la navegación
                    navigate('/StraysFinal/login');
                }, 2000);
            }
            if (response === 409) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Error',
                    detail: 'El email que ingresaste, ya existe',
                    life: 3000,
                });
            }
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al intentar el registro',
                life: 3000,
            });
        } finally{
            setIsLoading(false);
        }
    };


    return(
        <div className="loginpage gradient-background">
            <Toast ref={toast} />
            <div className="loginpage__message"> 
                <h2>Gracias por ayudar</h2>
                <p>Nos encanta que formes parte de esta iniciativa, regístrate aquí:</p>
            </div>
            <div className="loginpage__form">
                <div className="form">
                    {(isLoading)  &&
                        <div className="spinnercontainer">
                            <div className="spinnercontainer__spinner" />
                        </div>
                    }
                    <h2>Ingresa tus datos</h2>
                    <form className="form__fields">
                        <label>Nombre y apellido <span>*</span></label>
                        <div className="form__fields--many">
                            <input 
                                className={`${requiredFields.name && 'form__fields--empty'}`}
                                id="name"
                                type="text" 
                                onChange={handleInputChange} 
                                name="name"
                                value={newUser?.name || ''}
                                placeholder='Nombres'
                                required
                                maxLength="20"/>
                            <input 
                                className={`${requiredFields.lastname && 'form__fields--empty'}`}
                                id="lastname"
                                type="text" 
                                onChange={handleInputChange} 
                                name="lastname"
                                value={newUser?.lastname || ''}
                                placeholder='Apellidos'
                                required
                                maxLength="20"/>
                        </div>
                        <hr></hr>
                        <label>Datos de ingreso <span>*</span></label>
                        <div className="form__fields--many">
                            <input 
                                className={`${requiredFields.email && 'form__fields--empty'}`}
                                id="mail"
                                type="email" 
                                onChange={handleInputChange} 
                                name="email"
                                value={newUser?.email || ''}
                                placeholder='Email'
                                required
                                maxLength="30"/>
                            <input 
                                className={`${requiredFields.password && 'form__fields--empty'}`}
                                id="password"
                                type="password" 
                                onChange={handleInputChange} 
                                name="password"
                                value={newUser?.password || ''}
                                placeholder='Contraseña'
                                required
                                maxLength="20"/>
                        </div>
                        <hr></hr>
                        <label>Teléfono <span>*</span></label>
                        <input 
                                className={`${requiredFields.cellphone && 'form__fields--empty'}`}
                                id="cellphone"
                                type="tel" 
                                onChange={handleInputChange} 
                                name="cellphone"
                                value={newUser?.cellphone || ''}
                                placeholder='Teléfono'
                                required
                                maxLength="10"/>
                        <label>Ciudad <span>*</span></label>
                        <div className="form__fields-dropdown">
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
                                        className={`${requiredFields.ciudadId && 'form__fields--empty'}`}
                                        value={selectedCiudad}
                                        onChange={(e) => setSelectedCiudad(e.value)}
                                        options={ciudades}
                                        optionLabel="nombre"
                                        placeholder="Selecciona una ciudad"
                                        filter
                                        virtualScrollerOptions={{ itemSize: 38 }}
                                        valueTemplate={selectedValueTemplate}
                                        itemTemplate={optionTemplate}
                                        style={{width:'100%'}}
                                    />
                                )
                            }   
                        </div>
                        {isAnyEmpty &&
                            <div className="emptyfields-msg">
                                <i className="pi pi-exclamation-circle"></i>
                                <span>Por favor, llena todos los datos <strong>requeridos</strong></span>
                            </div>
                        }
                        <button onClick={handleCreate} className="button--action">
                            Registrarse
                        </button>
                        <Link className="form__fields-link" to="/StraysFinal/login">¿Ya tienes una cuenta? Ingresa aquí</Link>
                    </form>
                </div>
            </div>    
        </div>
    );
}

export default RegistrationPage;