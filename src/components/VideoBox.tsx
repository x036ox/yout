import React, {useEffect, useState} from "react";
import "../styles/Videos.css"
import Video from "../model/Video";
import {CHANNEL_ROUTE, VIDEO_EDIT_ROUTE, WATCH_ROUTE} from "../utils/RoutesConsts";
import {deleteVideo} from "../http-requests/DeleteRequests";
import {useNavigate} from "react-router-dom";
import {Q_PARAM_PARAM_VIDEO_ID, Q_PARAM_USER_ID} from "../utils/SearchQuerryParamConsts";
import { sendNotInterested } from "../http-requests/PostRequests";
import { User } from "../model/User";
import { observer } from "mobx-react";

interface VideoBoxProps{
    video:Video,
    user:User|null
}

const VideoBox : React.FC<VideoBoxProps>= observer(({video, user}) =>{

    const [videoEditButtonClassName, setVideoEditButtonClassName] = useState("video-edit-button");
    const [videoDeleteButtonClassName, setVideoDeleteButtonClassName] = useState("video-delete-button");
    const [threeDotsActive, setThreeDotsActive] = useState<boolean>(false);
    const [deleted, setDeleted] = useState(video.deleted);
    const navigate = useNavigate();
    

    function mouseEnter() {
        setVideoEditButtonClassName(videoEditButtonClassName + " active")
        setVideoDeleteButtonClassName(videoDeleteButtonClassName + " active")
    }

    function mouseLeave() {
        setVideoEditButtonClassName("video-edit-button");
        setVideoDeleteButtonClassName("video-delete-button");
    }

    function videoDeleteOnClick(video:Video){
        video.deleted = true;
        deleteVideo(video.id.toString());
    }

    if(video.deleted){
        return (
            <div className={"video-grid deleted-video"}>
                Video deleted
            </div>
        );
    }

    return(
        <div className="video-grid" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
            <a className="video-link" href={WATCH_ROUTE + Q_PARAM_PARAM_VIDEO_ID + video.id.toString()}>
            <div className="preview-box">
                <img className = "preview" src = {video.thumbnail}/>
                {user?.isAdmin && 
                    <div>
                        <button className={videoEditButtonClassName} onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate(VIDEO_EDIT_ROUTE + Q_PARAM_PARAM_VIDEO_ID + video.id)
                }}>
                    <img alt={"VideoEditIcon"} className={"video-edit-icon"} src={"tool-icons/VideoEditIcon-2.png"}/>
                </button>
                <button className={videoDeleteButtonClassName} onMouseDown={e => {e.stopPropagation(); e.preventDefault()}} onClick={e => {e.stopPropagation(); e.preventDefault()}} onMouseUp={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    videoDeleteOnClick(video);
                }}>
                    <img alt={"VideoDeleteIcon"} className={"video-delete-icon"} src={"tool-icons/VideoDeleteIcon.png"}/>
                </button>
                    </div>}
                <div className={"video-time"} >
                    {video.duration}
                </div>
            </div>
            

            <div className="video-info-grid">
                <img className = "video-channel-picture" src = {video.creatorPicture}/>
                <div className="video-info">
                    <div className="video-title">
                        {video.title}
                    </div>
                    <button className={"three-dots-button"} onClick={(e) =>{e.preventDefault(); setThreeDotsActive(!threeDotsActive)}} onBlur={() => setThreeDotsActive(false)}>
                        <img className="three-dots-icon" src="tool-icons/three-dots.png"/>
                    </button>
                    <div className={"three-dots-options" + (threeDotsActive ? " active" : "")} onClick={(e) => {e.stopPropagation(); e.preventDefault()}} /**onMouseUp={(e) => /**sendNotInterested(video.id) }*/ >
                        {user &&
                        <button className="three-dots-options-button" onMouseDown={(e) => {e.stopPropagation(); e.preventDefault()}} onMouseUp={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            user && sendNotInterested(video.id, user.id.toString());
                            video.deleted = true;
                        }}>
                            <img className="not-interested-icon" src="tool-icons/prohibition.png"/>
                            Not interested</button>
                        }
                    </div>
                    <a className="video-channel-link" href={CHANNEL_ROUTE + Q_PARAM_USER_ID + video.channelId.toString()}>
                    <div className="video-author" onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        {video.creatorName}
                    </div>
                    </a>
                    <div className="video-stats">{video.views} • {video.uploadDate}</div>
                </div>
            </div>
            </a>
        </div>
    )
})

export default VideoBox;