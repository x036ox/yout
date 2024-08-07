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
import { useAuth } from "react-oidc-context";

const History = observer(() =>{
    const urlParam = new URLSearchParams(window.location.search);
    const auth = useAuth();
    const [videos, setVideos] = useState<Video[] | null | undefined>();

    useEffect(() =>{
        const userId = urlParam.get(PARAM_USER_ID);
        if(userId){
            getWatchHistory(userId).then(setVideos);
        }else if(auth.user){
            getWatchHistory(auth.user.profile.sub).then(setVideos);
        }
    },[auth.user])

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
        <div className="all-videos-grid">
            {
                videos?.map(video =>
                    <VideoBox video={video}/>
                    )
            }
        </div>
    )
})

export default History;