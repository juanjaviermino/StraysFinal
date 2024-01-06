import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loggin } from './context/userSlice';

// Components
import Navbar from './components/navbarComponents/Navbar';
import LandingPage from './components/landingPageComponents/LandingPage';
import LoginPage from './components/accountMgmtComponents/LoginPage'; 
import RegisterPage from './components/accountMgmtComponents/RegistrationPage'; 
import ProvinciasPage from './components/adminComponents/Provincia/ProvinciasPage';
import CiudadesPage from './components/adminComponents/Ciudad/CiudadesPage';
import EspeciesPage from './components/adminComponents/Especie/EspeciesPage';
import RazasPage from './components/adminComponents/Raza/RazasPage';
import UsersPage from './components/adminComponents/User/UsersPage';

import { useSelector } from 'react-redux';



const ProtectedRoute = ({ children }) => {
  const isLogged = useSelector(state => state.user.isLogged);

  if (!isLogged) {
    // Usuario no está autenticado, redirigir a la página de inicio de sesión
    return <Navigate to="/StraysFrontREACT/login" />;
  }

  // Usuario autenticado, renderizar el componente solicitado
  return children;
};


function AppAuth() {

  const dispatch = useDispatch();

  dispatch(loggin());

  return (
    <Router>
      <header className='root__header'>
        <Navbar/>
      </header>
      <main className='root__main'>
        <Routes>
          <Route path="/StraysFrontREACT/" element={<LandingPage />} />
          <Route path="/StraysFrontREACT/register" element={<RegisterPage />} />
          <Route path="/StraysFrontREACT/login" element={<LoginPage />} />
          <Route path="/StraysFrontREACT/provincias" element={<ProtectedRoute><ProvinciasPage /></ProtectedRoute>} />
          <Route path="/StraysFrontREACT/ciudades" element={<ProtectedRoute><CiudadesPage /></ProtectedRoute>} />
          <Route path="/StraysFrontREACT/especies" element={<ProtectedRoute><EspeciesPage /></ProtectedRoute>} />
          <Route path="/StraysFrontREACT/razas" element={<ProtectedRoute><RazasPage /></ProtectedRoute>} />
          <Route path="/StraysFrontREACT/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/StraysFrontREACT/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default AppAuth;
