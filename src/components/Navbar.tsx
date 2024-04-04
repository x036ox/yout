import React from "react";
import "../styles/Navbar.css"
import { USER_LIKES_ROUTE, USER_SUBSCRIBES_ROUTE } from "../utils/RoutesConsts";

const Navbar = () => {


    return (
        <div className="navbar">
            <button className="home-button">
                <img className="home-icon" src="tool-icons/home.svg"/>
                <p>Home</p>
            </button>
            <button className="shorts-button">
                <img className="shorts-icon" src="/tool-icons/originals.svg"/>
                <p>Shorts</p>
            </button>
            <a href={USER_SUBSCRIBES_ROUTE}>
                <button className="subs-button">
                    <img className="subs-icon" src="/tool-icons/subscriptions.svg" />
                    <p>Subscribtions</p>
                </button>
            </a>
            <a href={USER_LIKES_ROUTE}>
                <button className="subs-button">
                    <img className="subs-icon" src="/tool-icons/like.png" />
                    <p>Likes</p>
                </button>
            </a>
            <button className="yt-music">
                <img className="yt-music-icon" src="tool-icons/youtube-music.svg"/>
                <p>YouTube Music</p>
            </button>
            <button className="library-button">
                <img className="library-button" src ="tool-icons/library.svg" />
                <p>Library</p>
            </button>
        </div>
    );
}

export default Navbar;