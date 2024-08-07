import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "react-oidc-context";
import FilterBar from "../components/FilterBar";
import NotFound from "../components/NotFound";
import Spinner from "../components/Spinner";
import VideoBox from "../components/VideoBox";
import {getRecommendations } from "../http-requests/GetRequests";
import Video from "../model/Video";
import "../styles/Videos.css";
import { checkIsUserAdmin } from "../utils/AuthorityUtils";

const MainPage = () =>{
    const REQ_VIDEOS_SIZE = 30;


    const [videos, setVideos] = useState<Video[] | null | undefined>(undefined);
    const auth = useAuth();
    const isAdmin:boolean = checkIsUserAdmin(auth.user?.profile.authorities);
    const mainPageRef = useRef<HTMLDivElement | null>(null);
    const [page, setPage] = useState<number>(0);



    useEffect(() =>{
        getRecommendations(page, REQ_VIDEOS_SIZE, null).then(setVideos);
    }, [])
    
    if(videos === null) return(
        <NotFound/>
    );

    if(videos === undefined) return(
        <Spinner/>
    );

    function filterBarOnChange(event : any){
        getRecommendations(page, REQ_VIDEOS_SIZE, event.target.value).then(videos =>{
            if(videos !== null){
                setVideos(videos);
            }
        })
    }

    return(
        <InfiniteScroll style={{overflow:"hidden"}}
        dataLength={videos.length}
        next={() => {
            getRecommendations(page + 1, REQ_VIDEOS_SIZE, null).then(vids =>vids && setVideos(videos.concat(vids)));
            setPage(page + 1);
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
                    isRecommendation={true}
                />
                    )
                }
            </div>
        </InfiniteScroll>
    )
}

export default MainPage;
