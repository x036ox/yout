import { Content } from "antd/es/layout/layout";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "..";
import { observer } from "mobx-react";
import Video from "../model/Video";
import { searchVideos } from "../http-requests/GetRequests";
import { useLocation } from "react-router-dom";
import { Q_PARAM_SEARCH_QUERRY } from "../utils/SearchQuerryParamConsts";
import VideoBox from "../components/VideoBox";
import Spinner from "../components/Spinner";
import NotFound from "../components/NotFound";


const VideoSearch = observer(() =>{
    const [videos, setVideos] = useState<Video[] | null | undefined>(undefined);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("search_query");

    useEffect(() =>{
        if(query !== null && query.length > 0){
            searchVideos(query).then(setVideos);
        }
    },[query])

    if(videos === undefined){
        return( <Spinner/>)
    }

    if(videos === null || videos.length === 0){
        return( <NotFound/>)
    }
    
    return(
        <div className="all-videos-grid">
            {
                videos?.map((video) =>
                <VideoBox video={video} user={null}/>)
            }    
        </div>
    )
})

export default VideoSearch;