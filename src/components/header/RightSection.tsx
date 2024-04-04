import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {User} from "../../model/User";
import ChannelDropdown from "./ChannelDropdown";
import {ADMIN_ROUTE, VIDEO_UPLOAD_ROUTE} from "../../utils/RoutesConsts";
import {useNavigate} from "react-router-dom";
import { Context } from "../..";
import { Authorities } from "../../utils/Authorities";
import Modal from "../Modal";


interface RightSectionProps{
    mainUser:User | null;
}

const RightSection: React.FC<RightSectionProps> = ({mainUser}) =>{
    const navigate = useNavigate();
    const userService = useContext(Context).userService;

    const [uploadIconPath, setUploadIconPath] = useState("tool-icons/upload.svg");
    const [channelDropdownVisible, setChannelDropdownVisible] = useState<boolean>(false);
    const [isInfoVisible, setInfoVisible] = useState<boolean>(false);

    const isAuth :boolean = mainUser !== null;
    const isAdmin = mainUser?.isAdmin;


    const uploadButtonOnclick = (event: any) => {
        if(uploadIconPath === "tool-icons/upload.svg" && isAuth){
            setUploadIconPath("tool-icons/upload.Black.svg");
        }
        else {
            setUploadIconPath("tool-icons/upload.svg")
        }
        window.location.href = VIDEO_UPLOAD_ROUTE;
    }


    return (
        <div className="right-section">
                {isInfoVisible && <Modal setVisible={setInfoVisible} isVisible ={isInfoVisible}/>}
            <button className="info-button" onClick={() => setInfoVisible(true)}>
                <img className={"info-icon"} src={"tool-icons/info.png"}/>
                <div className="tooltip">Info</div>
            </button>
            {
                    isAdmin && 
                    <button className="admin-button" onClick={() => window.location.href = ADMIN_ROUTE}>
                        <img className={"admin-icon"} src={"tool-icons/admin.png"}/>
                        <div className="tooltip">Admin page</div>
                    </button>
            }
            <button className="upload-button" onClick={uploadButtonOnclick}>
                    <img className="upload-icon" src={uploadIconPath} />
                    <div className="tooltip">Create</div>
                </button>
            <button className="notifications-button">
                <img className="notifications-icon" src={"tool-icons/notifications.svg"} />
                <div className="notifications-amount">9+</div>
                <div className="tooltip">Notifications</div>
            </button>
            {
                isAuth ?
                    <div>
                        <button className="channel-button" onMouseDown={(e) => setChannelDropdownVisible(!channelDropdownVisible)} onBlur={() => setChannelDropdownVisible(false)}>
                            <img className="channel-picture" src={mainUser?.picture} alt="Encoded Image"/>
                        </button>
                        <ChannelDropdown visible={channelDropdownVisible} mainUser={mainUser} setVisible={setChannelDropdownVisible}/>
                    </div>
                    :
                    <button className="no-channel-button" onClick={() => navigate("/login")} >
                            Login
                    </button>
            }



        </div>
    );
}

export default RightSection;