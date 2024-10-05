import React, { useContext, useEffect, useState } from "react";
import "../styles/UserLikes.css"
import { getUserLikes, getUserSubscribes } from "../http-requests/GetRequests";
import VideoBox from "../components/VideoBox";
import Spinner from "../components/Spinner";
import NotFound from "../components/NotFound";
import Video from "../model/Video";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "../KeycloakPrivoder";

const UserLikes = observer(() =>{
    const keycloak = useKeycloak();
    const [videos, setVideos] = useState<Video[] | null | undefined>();

    useEffect(() =>{
        if(!keycloak.authenticated){
            alert("Should be authorized");
            window.location.href = "/";
        } else if(keycloak.subject){
            getUserLikes(keycloak.subject).then(setVideos);
        }
    },[keycloak])

    
    return(
        <div className="user-likes">
             {
                videos === undefined ?
                <Spinner/> :
                videos === null ?
                <NotFound/> :
                videos.map(video =>
                    <VideoBox video={video}/> 
                )
            }
        </div>
    );
})

export default UserLikes;