import React, { useContext, useEffect, useState } from "react";
import "../styles/UserLikes.css"
import { Context } from "..";
import { User } from "../model/User";
import { getUserLikes, getUserSubscribes } from "../http-requests/GetRequests";
import VideoBox from "../components/VideoBox";
import Spinner from "../components/Spinner";
import NotFound from "../components/NotFound";
import Video from "../model/Video";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";

const UserLikes = observer(() =>{
    const userService = useContext(Context).userService;
    const [videos, setVideos] = useState<Video[] | null | undefined>();

    useEffect(() =>{
        if(userService.isAuth !== undefined && userService.isAuth === false){
            alert("Should be authorized");
            window.location.href = "/";
        } else if(userService.mainUser && userService?.mainUser){
            getUserLikes(userService?.mainUser.id.toString()).then(setVideos);
        }
    },[userService.isAuth])

    
    return(
        <div className="user-likes">
             {
                videos === undefined ?
                <Spinner/> :
                videos === null ?
                <NotFound/> :
                videos.map(video =>
                    <VideoBox video={video} user={null}/> 
                )
            }
        </div>
    );
})

export default UserLikes;