import React, {useEffect, useRef, useState} from "react";
import {getVideoById} from "../http-requests/GetRequests";
import {useInput} from "../hooks/useInput";
import Video from "../model/Video";
import {sendUpdateVideo} from "../http-requests/PutRequests";
import "../styles/VideoEdit.css"
import {PARAM_VIDEO_ID} from "../utils/SearchQuerryParamConsts";
import dayjs, {Dayjs} from "dayjs";
import {TimePicker} from "antd";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Form } from "react-bootstrap";

const VideoEdit = () => {
    const urlParam = new URLSearchParams(window.location.search);
    const [video, setVideo] = useState<Video>();

    const titleInput = useInput("");
    const descriptionInput = useInput("")
    const [duration, setDuration] = useState<string>("");
    const thumbnailInput = useInput("");
    const videoInput = useInput("");
    const imageFiles:FileList | null = thumbnailInput.ref.current !== undefined ? thumbnailInput.ref.current.files : null;
    const fileReader = new FileReader();
    const categorySelect = useRef<HTMLSelectElement | null>(null);
    const [imageURL, setImageUrl]= useState<string | null >(null);
    const navigate = useNavigate();
    const [isSpinnerVisible, setIsSpinnerVisible] = useState<boolean>(false);


    fileReader.onload =(e) => {
        const result = e.target?.result;
        if(typeof result === "string"){
            setImageUrl(result);
        }
        
    };


    const onChange = (time: Dayjs | null, timeString: string) => {
        if(time !== null){
            setDuration(timeString)
        }
    };

    useEffect(() => {
        const id:string|null = urlParam.get(PARAM_VIDEO_ID);
        if(id !== null) {
            getVideoById(id).then((video) => {
                if(video !== null){
                    setVideo(Video.toVideo(video));
                    titleInput.setValue(video.title)
                    setDuration(video.duration)
                    descriptionInput.setValue(video.description)
                }
            });
        }
    }, []);

    useEffect(() =>{
        if(imageFiles !== null ){
            if(imageFiles[0] !== null && imageFiles[0] != undefined){
                fileReader.readAsDataURL(imageFiles[0]);
            }
        }
    }, [imageFiles])

    useEffect(() =>{
        if(categorySelect.current && video){
            categorySelect.current.value = video.category;
        }
    }, [categorySelect.current])

    async function saveOnClick(video:Video){
        setIsSpinnerVisible(true);
        await sendUpdateVideo(
            video.id.toString(),
            titleInput.value === video.title ? null : titleInput.value,
            categorySelect.current?.value,
            descriptionInput.value === video.description ? null : descriptionInput.value,
            imageFiles === null || imageURL === undefined ? null : imageFiles[0],
            videoInput.ref.current !== undefined ? videoInput.ref.current.files[0] : null
        ).then(() => {
            navigate("/");
            setIsSpinnerVisible(false);
        });
    }

    if( video === undefined){
        return (
            <Spinner/>
        )
    }

    return(
        <div className={"video-edit-page"}>
            {
                <div className={"video"}>
                    <img className = "video-thumbnail" src = {imageURL === null || imageURL === undefined ? video.thumbnail : imageURL}/>
                    <input className="thumbnail-input" type="file" {...thumbnailInput} accept="image/*"/>
                    <input className="video-input" {...videoInput} type="file" accept="video/*"/>

                    <div className={"title"}>
                        Title:
                        <input className={"title-input"} {...titleInput} maxLength={100}/>
                    </div>

                    <div>
                        Category:
                        <Form.Select ref={categorySelect}>
                        <option value={"Music"}>Music</option>
                        <option value={"Education"}>Education</option>
                        <option value={"Sport"}>Sport</option>
                        <option value={"Games"}>Games</option>
                        <option value={"Movies"}>Movies</option>
                        <option value={undefined}>Other</option>
                        </Form.Select>
                    </div>

                    <div className={"description"}>
                        Description:
                        <textarea className={"description-input"} {...descriptionInput} maxLength={255}/>
                    </div>

                    <div className={"save-link"}>
                        <button className={"save-button"} onClick={() => saveOnClick(video)}>
                            Save
                        </button>
                    </div>
                    {isSpinnerVisible &&
                <Spinner/>
                }
                </div>
            }
        </div>
    )
}

export default VideoEdit;