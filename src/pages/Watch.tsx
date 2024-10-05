import React, {useContext, useEffect, useRef, useState} from "react";
import {
    checkUserLikedVideo,
    checkUserSubscribedChannel,
    getUserById,
    getVideoById,
    getRecommendations,
    watchVideoById
} from "../http-requests/GetRequests";
import Video from "../model/Video";
import VideoBox from "../components/VideoBox";
import "../styles/Watch.css"
import {
    sendSubscribeChannel,
    sendUnsubscribeChannel
} from "../http-requests/PutRequests";
import {observer} from "mobx-react";
import {useNavigate, useParams} from "react-router-dom";
import {CHANNEL_ROUTE} from "../utils/RoutesConsts";
import {Q_PARAM_PARAM_VIDEO_ID, Q_PARAM_USER_ID} from "../utils/SearchQuerryParamConsts";
import { API_URL, URL_M3U8INDEX } from "../utils/endpoints";
import { useInput } from "../hooks/useInput";
import { sendLikeToVideo } from "../http-requests/PostRequests";
import { sendDislikeToVideo } from "../http-requests/DeleteRequests";
import Hls from "hls.js";
import { UserProfile } from "oidc-client-ts";
import { YoutUserProfile } from "../model/YoutUserProfile";
import { KeycloakProfile } from "keycloak-js";
import { useKeycloak } from "../KeycloakPrivoder";

const Watch = observer(() =>{
    const REQ_VIDEOS_SIZE = 30;
    const keycloak = useKeycloak();
    const mainUser: KeycloakProfile | undefined = keycloak.profile;
    const navigate = useNavigate();
    const hls = new Hls();

    const videoId: string | null = new URLSearchParams(window.location.search).get("videoId");
    const [video, setVideo] = useState<Video | null | undefined>(undefined);
    const [recommendations, setRecommendations] = useState<Video[] | null | undefined>(undefined);
    const [channel, setChannel] = useState<YoutUserProfile | null | undefined>(undefined)
    const [hasUserLikedVideo, setHasUserLikedVideo] = useState<boolean | undefined>(undefined);
    const [hasUserSubscribed, setHasUserSubscribed] = useState<boolean | undefined>(undefined);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isSameChannel, setSameChannel] = useState<boolean>(false);


    
    let likeButtonClassName:string = "watch-like-button";
    let subscribeButtonClassName:string = "watch-subscribe-button";

    useEffect(() =>{
        if(videoRef.current && videoId){
            hls.loadSource(URL_M3U8INDEX(videoId));
            hls.attachMedia(videoRef.current);
        }
    },[videoRef]);
    
    useEffect(() => {
        if(videoId !== null){
            watchVideoById(videoId).then((vid) =>{
                if(vid !== null){
                    getUserById(vid.channelId).then((user) =>{
                        setChannel(user)
                        setVideo(vid);
                    })
                } else setVideo(null);
            });
            getRecommendations(0, 10, null).then(setRecommendations);
        
        }
    }, []);

    useEffect(() => {
        if(keycloak.subject && videoId){
            checkUserLikedVideo(keycloak.subject, videoId).then(setHasUserLikedVideo);
        } else {
            setHasUserLikedVideo(false);
        }
    }, [keycloak.authenticated]);



    useEffect(() => {
        if(keycloak.subject && channel){
            checkUserSubscribedChannel(keycloak.subject, channel.id).then(setHasUserSubscribed);
            if(channel.id === keycloak.subject){
                setSameChannel(true);
            }
        } else {
            setHasUserSubscribed(false);
        }
    }, [channel]);



    if(hasUserLikedVideo){
        likeButtonClassName += " watch-like-button-active";
    }
    if(hasUserSubscribed){
        subscribeButtonClassName += " watch-subscribe-button-active";
    }

    // if(video === undefined || channel === undefined || recommendations === undefined || hasUserLikedVideo === undefined || hasUserSubscribed === undefined){
    //     return(
    //         <Spinner/>
    //     )
    // }

    // if(video === null || channel === null){
    //     return (
    //         <NotFound/>
    //     )
    // }

    function likeVideo(video: Video, userId:string | undefined){
        if(userId){
            sendLikeToVideo(userId, video.id.toString());
        }
        if(hasUserLikedVideo){
            //if user already liked this video, we`re removing his like
            video.likes = video.likes - 1;
            setHasUserLikedVideo(false);
        } else {
            //otherwise adding
            video.likes = video.likes + 1;
            setHasUserLikedVideo(true);
        }
    }

    function dislikeVideo(video: Video, userId:string|undefined){
        if(userId){
            sendDislikeToVideo(userId, video.id.toString());
            setHasUserLikedVideo(false)
            video.likes -= 1;
        }
    }

    function subscribeOnClick(userId:string | undefined, channel: YoutUserProfile|undefined){
        if(userId && channel){
            if(hasUserSubscribed){
                //unsubscribing
                sendUnsubscribeChannel(userId, channel.id);
                setHasUserSubscribed(false);
            }
            else {
                sendSubscribeChannel(userId, channel.id);
                setHasUserSubscribed(true);
            }
        }
    }




    return (
        <div className={"watch-page"}>
            <div className={"watch-video-part"}>
                <div className={"watch-video-thumbnail"}>
                    {/* <img className={"watch-thumbnail"} src={video.thumbnail}/> */}
                    <video ref={videoRef} className={"watch-thumbnail"} controls/>
                </div>
                
                <div className={"watch-video-title"}>
                    {video?.title}
                </div>
                <div className={"watch-video-channel-box"}>
                    <div className={"watch-video-channel"}>
                        <img className={"watch-channel-picture"} src={channel?.picture}/>
                        <div className={"watch-channel-name-box"}>
                            <div className={"watch-channel-name"} onClick={() => navigate(CHANNEL_ROUTE + Q_PARAM_USER_ID + channel?.id)}>
                                {channel?.username}
                            </div>
                            <div className={"watch-channel-subscribers"}>
                                {channel?.subscribers}
                            </div>
                        </div>
                        {
                            !isSameChannel && hasUserSubscribed != undefined &&
                            <button className={subscribeButtonClassName} onClick={() => channel && subscribeOnClick(keycloak.subject, channel)}>
                                {hasUserSubscribed ? "You subscribed" : "Subscribe"}
                            </button>
                        }
                    </div>
                    <div className={"watch-reactions"}>
                        <button className={likeButtonClassName} onClick={() => video && likeVideo(video, keycloak.subject)}>
                            <img className={"watch-like-icon"} src={"/tool-icons/like.png"}/>
                            <div className={"watch-likes-amount"}>{video?.likes}</div>
                        </button>
                        <button className={"watch-dislike-button"} onClick={() => video && dislikeVideo(video, keycloak.subject)}>
                            <img className={"watch-dislike-icon"} src={"/tool-icons/dislike.png"}/>
                        </button>
                    </div>
                </div>
                <div className={"watch-video-details"}>
                    <div className={"watch-video-stats"}>
                        <div className={"watch-views"}>
                            {video?.views}
                        </div>
                        <div className={"watch-upload-date"}>
                            Date upload:
                            {" " + video?.uploadDate}
                        </div>
                    </div>
                    <div className={"watch-description"}>
                        {video?.description}
                    </div>
                </div>
            </div>
            <div className={"watch-recs-part"}>
                {recommendations?.map((rec,i) =>
                    {
                        if(rec.id !== video?.id)
                            return <VideoBox video={rec} isRecommendation={true} key={video?.id}/>
                    }
                )}
            </div>
        </div>
    )
})

export default Watch;