import React, { useContext, useEffect, useState } from "react";
import "../styles/UserLikes.css"
import { Context } from "..";
import { getUserLikes, getUserSubscribes } from "../http-requests/GetRequests";
import VideoBox from "../components/VideoBox";
import Spinner from "../components/Spinner";
import NotFound from "../components/NotFound";
import Video from "../model/Video";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

const UserLikes = observer(() =>{
    const auth = useAuth();
    const [videos, setVideos] = useState<Video[] | null | undefined>();

    useEffect(() =>{
        if(!auth.isAuthenticated){
            alert("Should be authorized");
            window.location.href = "/";
        } else if(auth.user){
            getUserLikes(auth.user.profile.sub).then(setVideos);
        }
    },[auth])

    
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