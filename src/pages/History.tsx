import React, { useContext, useEffect, useState } from "react";
import { getWatchHistory } from "../http-requests/GetRequests";
import { PARAM_USER_ID } from "../utils/SearchQuerryParamConsts";
import Video from "../model/Video";
import VideoBox from "../components/VideoBox";
import { Context } from "..";
import { observer } from "mobx-react";
import "../styles/History.css"
import NotFound from "../components/NotFound";
import Spinner from "../components/Spinner";

const History = observer(() =>{
    const urlParam = new URLSearchParams(window.location.search);
    const user = useContext(Context).userService.mainUser;
    const [videos, setVideos] = useState<Video[] | null | undefined>();

    useEffect(() =>{
        const userId = urlParam.get(PARAM_USER_ID);
        if(userId){
            getWatchHistory(userId).then(setVideos);
        }else if(user){
            getWatchHistory(user.id.toString()).then(setVideos);
        }
    },[user])

    if(videos === undefined){
        return(
            <Spinner/>
        )
    } if(videos === null){
        return(
            <NotFound/>
        )
    }

    return(
        <div className="history-page">
            {
                videos?.map(video =>
                    <VideoBox video={video} user={user}/>
                    )
            }
        </div>
    )
})

export default History;