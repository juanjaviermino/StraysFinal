import React, { useEffect, useState } from 'react';

// Servicios
const apiEndpoint = import.meta.env.VITE_APP_API;

function PostComponent (props) {

    // --------------------- Setup ---------------------------
    const [signedImageUrl, setSignedImageUrl] = useState('');

    useEffect(() => {
        if (props.publicacion && props.publicacion.rutaImg) {
            fetchSignedUrl(props.publicacion.rutaImg).then(url => setSignedImageUrl(url));
        }
    }, [props.publicacion]);

    const fetchSignedUrl = async (rutaImg) => {
        // Replace this URL with your backend endpoint that returns the signed URL
        const response = await fetch(`${apiEndpoint}/signedUrl?filePath=${rutaImg}`);
        const data = await response.json();
        return data.signedUrl;
    };

    const handlePostClick = () =>{
        props.onClick(props.publicacion?.publicacionId)
    }

    return(
        <div onClick={handlePostClick} className='postcard' style={{backgroundColor: !props.publicacion && 'grey'}}>
            <div className='postcard__image'>
                {
                    props.publicacion ? 
                    <>
                        <img src={signedImageUrl}></img>
                        <div className='postcard__info--header'>
                            <div className='postcard__info--header__user'>
                                <i className="pi pi-user"></i>
                                <span>{props.publicacion?.usuario?.name}</span>
                            </div>
                            <span>{props.publicacion?.fecha}</span>
                        </div>
                    </> : 
                    <div className='postcard__image--empty'>
                        <i className="pi pi-image"></i>
                    </div>
                }
                
            </div>
            <div className='postcard__info'>
                {
                    props.publicacion ? 
                    <>
                        <div className='postcard__info--body'>
                            <h4>{props.publicacion?.especie} {props.publicacion?.tipo === 'lost' ? 'perdido' : 'encontrado'}</h4>
                            <p>{props.publicacion?.descripcion}</p>
                        </div>
                    </> : 
                    <p style={{color: 'white', margin: '0 auto'}}>No se encontraron publicaciones</p>
                }
                
            </div>
        </div>
    );
}

export default PostComponent;
