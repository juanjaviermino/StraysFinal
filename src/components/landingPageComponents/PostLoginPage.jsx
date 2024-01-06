import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarStrays from "../navbarComponents/Navbar";
import About from "../About";
import WelcomePage from "./LandingPage";
import Users from "../Users";
import Products from "../Products";
import Sellers from "../Sellers";
import Sales from "../Sales";
import SalesSummary from "../SalesSummary";
import ProvinciasPage from "../adminComponents/Provincia/ProvinciasPage";

function PostLoginPage (props) {

    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        setIsLogged(props.logged);
    }, [props.logged])

    return (
        <Router>
            <div className="app-container">
                <div className="navbar-space">
                    <NavbarStrays logged={isLogged}/>
                </div>
                <div className="pages-space">
                    <Routes>
                        <Route path="/StraysFrontREACT/" element={<WelcomePage />} />
                        <Route path="/StraysFrontREACT/about" element={<About />} />
                        <Route path="/StraysFrontREACT/users" element={<Users />} />
                        <Route path="/StraysFrontREACT/provincias" element={<ProvinciasPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default PostLoginPage;