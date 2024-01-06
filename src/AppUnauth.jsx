import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

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
import CreatePost from './components/postsComponents/createPost';

import { useSelector } from 'react-redux';
import ResultsPage from './components/postsComponents/ResultsPage';
import PostsPage from './components/postsComponents/PostsPage';
import Reporte from './components/postsComponents/Reporte';

const ProtectedRoute = ({ children }) => {
  const isLogged = useSelector(state => state.user.isLogged);

  if (!isLogged) {
    // Usuario no está autenticado, redirigir a la página de inicio de sesión
    return <Navigate to="/StraysFinal/login" />;
  }

  // Usuario autenticado, renderizar el componente solicitado
  return children;
};


function AppUnauth() {

  return (
    <Router>
      <header className='root__header'>
        <Navbar/>
      </header>
      <main className='root__main'>
        <Routes>
          <Route path="/StraysFinal/" element={<LandingPage />} />
          <Route path="/StraysFinal/register" element={<RegisterPage />} />
          <Route path="/StraysFinal/login" element={<LoginPage />} />
          <Route path="/StraysFinal/provincias" element={<ProtectedRoute><ProvinciasPage /></ProtectedRoute>} />
          <Route path="/StraysFinal/ciudades" element={<ProtectedRoute><CiudadesPage /></ProtectedRoute>} />
          <Route path="/StraysFinal/especies" element={<ProtectedRoute><EspeciesPage /></ProtectedRoute>} />
          <Route path="/StraysFinal/razas" element={<ProtectedRoute><RazasPage /></ProtectedRoute>} />
          <Route path="/StraysFinal/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/StraysFinal/create_post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/StraysFinal/post_results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/StraysFinal/view_posts_page" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
          <Route path="/StraysFinal/reporte" element={<ProtectedRoute><Reporte /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/StraysFinal/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default AppUnauth;
