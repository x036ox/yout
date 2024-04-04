import React from "react";
import { useNavigate } from "react-router-dom";

const LeftSection = () =>{
    const navigate = useNavigate();
    return (
        <div className={"left-section"}>
            <button className={"hamburger-button"}>
                <img className={"hamburger-icon"} src={"tool-icons/hamburger-menu.svg"}/>
            </button>
            <a className={"youtube-logo"} href="/">
                <img className={"youtube-logo-icon"} src={"tool-icons/youtube-logo.svg"}/>
            </a>
        </div>
    )
}

export default LeftSection;