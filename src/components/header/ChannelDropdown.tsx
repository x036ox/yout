import React, {forwardRef, useContext, useEffect} from "react";
import "../../styles/ChannelDropdown.css"
import {useNavigate} from "react-router-dom";
import {CHANNEL_ROUTE, USER_EDIT_ROUTE, USER_HISTORY_ROUTE, VIDEO_UPLOAD_ROUTE} from "../../utils/RoutesConsts";
import {Q_PARAM_USER_ID} from "../../utils/SearchQuerryParamConsts";
import { useKeycloak } from "../../KeycloakPrivoder";
import { signout } from "../../keycloak";

interface ChannelDropdownProps{
    visible:boolean;
    setVisible: any
}

const ChannelDropdown:React.FC<ChannelDropdownProps> = ({visible, setVisible}) =>{
    const keycloak = useKeycloak();
    let rootClasses = "channel-dropdown";

    if(visible)
        rootClasses += " active";

    function buttonOnClick(route:string | null){
        if(route !== null){
            window.location.href = route;
        }
        setVisible(false);
    }

    function authorizationOnClick(){
        signout(keycloak);
        buttonOnClick(null);
    }




    return (
        <div className={rootClasses} onMouseDown={(e) => e.preventDefault()} >
            <div className="channel-header">
                <img className="channel-picture" src={keycloak?.tokenParsed?.picture} />
                <div className = "channel-info">
                    <div className="channel-name">{keycloak.profile?.username}</div>
                    <div className="channel-tag">id: {keycloak.subject}</div>
                    <a className="account-control-link">Google account Control</a>
                </div>
            </div>
            <div className="dropdown-options">
                <div>
                    <button className="my-channel-button" onClick={() => buttonOnClick(CHANNEL_ROUTE + Q_PARAM_USER_ID + keycloak.subject)}>
                        My channel
                    </button>
                    <button className="my-channel-button" onClick={() => buttonOnClick(USER_EDIT_ROUTE + Q_PARAM_USER_ID + keycloak.subject)}>
                        Edit channel
                    </button>
                    <button className="creative-studio" onClick={() => buttonOnClick(VIDEO_UPLOAD_ROUTE)}>
                        Upload video
                    </button>
                    <button className="history-studio" onClick={() => buttonOnClick(USER_HISTORY_ROUTE)}>
                        My history
                    </button>
                    <button className="change-account" onClick={() => {
                        signout(keycloak);
                        authorizationOnClick()
                    }}>
                        Change account
                    </button>
                    <button className="sign-out" onClick={() => {
                        buttonOnClick("");
                        signout(keycloak);
                        // userService.logout();
                    }}>
                        Sign out
                    </button>
                </div>
                <div>
                    <button className="dues">Purchases and paid subscriptions</button>
                    <button className="personal-data">YouTube personal data</button>
                </div>
                <div>
                    <button className="change-theme">Theme:</button>
                    <button className="change-language">Language</button>
                    <button className="safe-mode">Safe mode</button>
                    <button className="Country">Country:</button>
                    <button className="fast-keys">Fast keys</button>
                </div>
                <div>
                    <button className="Settings">Settings</button>
                </div>
                <div>
                    <button className="reference">Reference</button>
                    <button className="leave-feedback">Leeve feedback</button>
                </div>

            </div>
        </div>

    );
}

export default ChannelDropdown;