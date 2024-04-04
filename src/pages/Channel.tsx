import React, {useEffect, useState} from "react";
import {User} from "../model/User";
import {getAllUserVideosSorted, getAllVideosSorted, getUserById} from "../http-requests/GetRequests";
import FilterBar, {Sort} from "../components/FilterBar";
import "../styles/Videos.css"
import VideoBox from "../components/VideoBox";
import {PARAM_USER_ID} from "../utils/SearchQuerryParamConsts";
import filterBar from "../components/FilterBar";
import Video from "../model/Video";
import NotFound from "../components/NotFound";
import Spinner from "../components/Spinner";

const Channel = ()=> {
    const userId: string | null = new URLSearchParams(window.location.search).get(PARAM_USER_ID);
    const [videos, setVideos] = useState<Video[] | null | undefined>(undefined);

    useEffect(() => {
        if(userId !== null){
            getAllUserVideosSorted(userId, Sort.BY_UPLOAD_DATE_FROM_OLDEST).then(videos =>{
                setVideos(videos);
            });
        }
    }, []);

    if(videos === undefined){
        return (
            <Spinner/>
        )
    }


    if(videos === null || videos.length === 0){
        return (
            <NotFound/>
        )
    }

    function filterBarOnChange(event : any){
        if(userId !== null){
            getAllUserVideosSorted(userId, event.target.value).then(videos =>{
                if(videos !== null){
                    setVideos(videos);
                }
        })}
    }


    return(
        <div className={"channel-page"}>
            <FilterBar onChange={filterBarOnChange}/>
            <div className={"all-videos-grid"}>
                {
                    videos.map((video) =>
                        <VideoBox video={video} user ={null}/>
                    )
                }
            </div>
        </div>
    )
}

export default Channel;