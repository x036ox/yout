import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";
import {getAllVideosSorted, getVideos} from "../http-requests/GetRequests";
import "../styles/Videos.css"
import VideoBox from "../components/VideoBox";
import FilterBar from "../components/FilterBar";
import Video from "../model/Video";
import { Context } from "..";
import { User } from "../model/User";
import { Authorities } from "../utils/Authorities";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../utils/Consts";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../components/Spinner";
import NotFound from "../components/NotFound";
import Modal from "../components/Modal";

const MainPage = () =>{
    const REQ_VIDEOS_SIZE = 30;


    const [videos, setVideos] = useState<Video[] | null | undefined>(undefined);
    const mainUser : User | null = useContext(Context).userService.mainUser;
    const isAdmin:boolean = mainUser?.authorities.find(value => value === Authorities.ADMIN) !== undefined;
    const mainPageRef = useRef<HTMLDivElement | null>(null);
    const [page, setPage] = useState<number>(0);



    useEffect(() =>{
        if(!mainUser && !videos){
            getVideos(page, REQ_VIDEOS_SIZE).then(setVideos);
        } else if(mainUser && !videos){
            getVideos(page, REQ_VIDEOS_SIZE).then(setVideos);
        }
    }, [mainUser])
    
    if(videos === null) return(
        <NotFound/>
    );

    if(videos === undefined) return(
        <Spinner/>
    );

    function filterBarOnChange(event : any){
        getAllVideosSorted(event.target.value).then(videos =>{
            if(videos !== null){
                setVideos(videos);
            }
        })
    }

    return(
        <InfiniteScroll style={{overflow:"hidden"}}
        dataLength={videos.length}
        next={() => {
            setPage(page + 1);
            getVideos(page + 1, REQ_VIDEOS_SIZE).then(vids =>vids && setVideos(videos.concat(vids)));
        }}
        loader={<Spinner/>}
        hasMore={true}
        >
            <FilterBar onChange={filterBarOnChange}/>
            <div className={"all-videos-grid"}>
                {
                    videos.map((video)=>
                    <VideoBox key={video.id}
                    video={video}
                    user={mainUser}
                />
                    )
                }
            </div>
        </InfiniteScroll>
    )
}

export default MainPage;