import React from "react";
import video from "../../assets/wlcVideo.mp4";

function LandingPage () {
    return(
        <div className="landingpage">
            <div className="landingpage__overlay"></div>
            <video className="landingpage__video" autoPlay loop muted src={video} type="video/mp4">a</video>
            <div className="landingpage__title">
                <h1 className="fs--logo-landing">STRAYS</h1>
                <p className="fs--slogan-landing">Reencuentra la Felicidad</p>
            </div>
        </div>  
    );
}

export default LandingPage;
