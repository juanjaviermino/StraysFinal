import React, { useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from 'primereact/toast';
import PostComponent from './PostComponent';
import { Avatar } from 'primereact/avatar';
import { useSelector } from 'react-redux';

// Servicios
const apiEndpoint = import.meta.env.VITE_APP_API;

function PostViewer (props) {

    // --------------------- Setup ---------------------------

    // toasts:
    const toast = useRef(null);
    const usuario = useSelector(state => state.user.user);
    const navigate = useNavigate();

    // --------------------- Estados ---------------------------

    const [post, setPost] = useState(null);
    const [signedImageUrl, setSignedImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ---------------------- Mostrar resultados cuando llegue a la página --------

    useEffect(()=>{
        if(props.publicacionId){
            fetchPost();
        }
    },[props.publicacionId])

    useEffect(() => {
        if (post && post.rutaImg) {
            fetchSignedUrl(post.rutaImg).then(url => setSignedImageUrl(url));
        }
    }, [post]);

    const fetchSignedUrl = async (rutaImg) => {
        // Replace this URL with your backend endpoint that returns the signed URL
        const response = await fetch(`${apiEndpoint}/signedUrl?filePath=${rutaImg}`);
        const data = await response.json();
        return data.signedUrl;
    };

    const handleCloseViewer = () =>{
        setPost(null);
        props.closeViewer();
    }

    // ------------------------- Funciones de datos ---------------------------------

    const fetchPost = async () =>{
        try {
            setIsLoading(true);
            const response = await fetch(`${apiEndpoint}/publicaciones/${props.publicacionId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setPost(data);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un error al intentar obtener la publicación',
                life: 3000,
            });
            setPost(null);
        } finally{
            setIsLoading(false);
        }
    };

    const handleSearchPost = () =>{
        navigate('/StraysFinal/post_results', { state: { postId: post.publicacionId } });  
    }

    return(
        <div className='postviewer'>
            <Toast ref={toast} />
            {
                post ? 
                <>
                    <div className='postviewer__container'>
                        
                        <button className="button--rounded-icon postviewer__container-close" onClick={(e) => handleCloseViewer()}>
                            <i className="pi pi-times" style={{ fontSize: '0.6rem', margin: '0' }}></i>
                        </button>
                        <div className='postviewer__container__userinfo'>
                            <div className='postviewer__container__userinfo-item'>
                                <Avatar icon="pi pi-user" size="medium" style={{ backgroundColor: '#604bdc', color: '#ffffff' }} shape="circle" />
                                <p>{`${post.usuario.name} ${post.usuario.lastname}`}</p>
                            </div>
                            <div className='postviewer__container__userinfo-item'>
                                <p>{post.usuario.ciudad}, {post.fecha}</p>
                            </div>
                        </div>
                        <div className='postviewer__container__header'>
                            <div className='postviewer__container__header-img'>
                                {(isLoading)  ?
                                    <div className="spinnercontainer">
                                        <div className="spinnercontainer__spinner" />
                                    </div> :
                                    <img src={signedImageUrl}></img>
                                }
                                
                            </div>
                            <div className='postviewer__container__header-info'>
                                <p><strong>Estado: </strong>{post.tipo === 'lost' ? 'Perdido' : 'Encontrado'}</p>
                                <p><strong>Especie: </strong>{post.especie}</p>
                                <p><strong>Raza: </strong>{post.raza ? post.raza : 'no tiene'}</p>
                                <p>{post.descripcion}</p>
                                {
                                    post.usuario.id === usuario.id &&
                                    <button className='button--common' style={{width: '180px'}} onClick={handleSearchPost}>
                                        <i className="pi pi-search"></i>
                                        <span>Buscar coincidencias</span>
                                    </button>
                                }
                                
                            </div>
                        </div>
                    </div>
                </> :
                <>
                
                </>
            }
            
        </div>
    );
}

export default PostViewer;
