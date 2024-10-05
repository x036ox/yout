import React, { useContext, useEffect, useState } from "react";
import { getWatchHistory } from "../http-requests/GetRequests";
import { PARAM_USER_ID } from "../utils/SearchQuerryParamConsts";
import Video from "../model/Video";
import VideoBox from "../components/VideoBox";
import { observer } from "mobx-react";
import "../styles/History.css"
import NotFound from "../components/NotFound";
import Spinner from "../components/Spinner";
import { useKeycloak } from "../KeycloakPrivoder";

const History = observer(() =>{
    const urlParam = new URLSearchParams(window.location.search);
    const keycloak = useKeycloak();
    const [videos, setVideos] = useState<Video[] | null | undefined>();

    useEffect(() =>{
        const userId = urlParam.get(PARAM_USER_ID);
        if(userId){
            getWatchHistory(userId).then(setVideos);
        }else if(keycloak.subject){
            getWatchHistory(keycloak.subject).then(setVideos);
        }
    },[keycloak.subject])

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