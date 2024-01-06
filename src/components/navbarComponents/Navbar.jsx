import React, { useEffect, useState } from 'react';
import {Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../../context/userSlice';

function NavbarStrays (props) {

    const dispatch = useDispatch();
    const isLogged = useSelector(state => state.user.isLogged);
    const usuario = useSelector(state => state.user.user);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(()=>{
        setIsAdmin(usuario?.role ? usuario.role === "admin" : false);
    },[usuario])

    const handleLogout = () =>{
        dispatch(logout());
    };

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
                    <button onClick={handleLogout} style={{marginLeft:'auto'}} className='button--icon-text'>
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
        </nav>
    );
}

export default NavbarStrays;
