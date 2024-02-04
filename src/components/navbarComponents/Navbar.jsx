import React, { useEffect, useState } from 'react';
import {Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../../context/userSlice';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';

import { useNotificaciones } from '../../services/useNotificaciones';
import Notificacion from '../postsComponents/Notificacion';

function NavbarStrays (props) {

    const dispatch = useDispatch();
    const isLogged = useSelector(state => state.user.isLogged);
    const usuario = useSelector(state => state.user.user);
    const { notificaciones, error, isLoading, isValidating, refresh } = useNotificaciones(); 

    const [isAdmin, setIsAdmin] = useState(false);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState('center');

    useEffect(()=>{
        setIsAdmin(usuario?.role ? usuario.role === "admin" : false);
    },[usuario])

    const handleLogout = () =>{
        dispatch(logout());
    };

    const show = (position) => {
        setPosition(position);
        setVisible(true);
    };

    const unreadNotificacionesCount = notificaciones?.filter(notificacion => notificacion.leida === false);

    return(
        <nav className={`${isLogged ? 'navbar--logged' : 'navbar'}`}> 
            <Link className="fs--logo" to="/StraysFinal/">STRAYS</Link>
            {isLogged 
                ? 
                <ul className="navbar__items">
                    { !isAdmin && <Link className="navbar__item fs--navitem" to="/StraysFinal/create_post">Publicar</Link>}
                    { !isAdmin && <Link className="navbar__item fs--navitem" to="/StraysFinal/view_posts_page">Publicaciones</Link>}
                    { isAdmin && <Link className="navbar__item fs--navitem" to="/StraysFinal/provincias">Provincias</Link>}
                    { isAdmin && <Link className="navbar__item fs--navitem" to="/StraysFinal/ciudades">Ciudades</Link>}
                    { isAdmin && <Link className="navbar__item fs--navitem" to="/StraysFinal/especies">Especies</Link>}
                    { isAdmin && <Link className="navbar__item fs--navitem" to="/StraysFinal/razas">Razas</Link>}
                    { isAdmin && <Link className="navbar__item fs--navitem" to="/StraysFinal/users">Usuarios</Link>}
                    { isAdmin && <Link className="navbar__item fs--navitem" to="/StraysFinal/reporte">Reporte</Link>}
                    <Button onClick={() => show('right')} style={{height: '25px', marginLeft:'auto', fontSize: '14px', fontWeight: '200', fontFamily: 'Roboto', color: 'white'}} type="button" label="Notificaciones">
                        <Badge value={unreadNotificacionesCount ? unreadNotificacionesCount?.length : 0}></Badge>
                    </Button>
                    <span style={{fontSize: '14px', fontFamily: 'Roboto', color: 'white'}}>{usuario?.name}</span>
                    <button onClick={handleLogout}  className='button--icon-text'>
                        <i className="pi pi-user" style={{fontSize:'12px', color:'white'}}></i>
                        <span className='fs--navitem'>Cerrar sesión</span>
                    </button>
                </ul>
                : 
                <ul className="navbar__items">
                    <Link className="navbar__item fs--navitem" to="/StraysFinal/register">Registrate</Link>
                    <Link className="navbar__item fs--navitem" to="/StraysFinal/login">Comencémos</Link>
                </ul>
            }
            <Dialog style={{height: '100vh', width: '30vw'}} header="Notificaciones" visible={visible} position={position} onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <div style={{height: '75vh', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {
                        notificaciones?.map((notificacion, index) => (
                            <Notificacion key={index} notificacion={notificacion}/>
                        ))
                    }
                </div>
            </Dialog>
        </nav>
    );
}

export default NavbarStrays;
