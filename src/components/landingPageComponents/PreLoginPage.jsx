import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarStrays from "../navbarComponents/Navbar";
import RegistrationPage from "../accountMgmtComponents/RegistrationPage";
import LoginPage from "../accountMgmtComponents/LoginPage";
import WelcomePage from "./LandingPage";

function PreLoginPage(props) {

    const [isLogged, setIsLogged] = useState(false);
    const {toAppPage} = props;

    function toPreLoginPage(logged){
        toAppPage(logged);
    }

    useEffect(() => {
        setIsLogged(props.logged);
    }, [props.logged])

    return (
        <Router>
            <div className="app-container">
                <div className="navbar-space">
                    <NavbarStrays logged={isLogged}/>
                </div>
                <div className='pages-space'>
                    <Routes>
                        <Route path="/StraysFrontREACT/" element={<WelcomePage />} />
                        <Route path="/StraysFrontREACT/register" element={<RegistrationPage />} />
                        <Route path="/StraysFrontREACT/login" element={<LoginPage toPreLoginPage={toPreLoginPage}/>} />
                        <Route path="/StraysFrontREACT/users" element={<LoginPage toPreLoginPage={toPreLoginPage}/>} />
                        <Route path="/StraysFrontREACT/about" element={<LoginPage toPreLoginPage={toPreLoginPage}/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default PreLoginPage;