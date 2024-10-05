import React, {useContext, useEffect, useRef, useState} from "react";
import {useInput} from "../hooks/useInput";
import {useNavigate} from "react-router-dom";
import {sendNewVideo} from "../http-requests/PostRequests";
import "../styles/VideoUpload.css"
import {observer} from "mobx-react";
import { Form } from "react-bootstrap";
import Spinner from "../components/Spinner";
import { useKeycloak } from "../KeycloakPrivoder";



const VideoUpload = observer(() =>{

    const keycloak = useKeycloak();

    const titleInput = useInput("");
    const descriptionInput = useInput("")
    const thumbnailInput = useInput("");
    const videoInput = useInput("");
    const categorySelect = useRef<HTMLSelectElement | null>(null);
    const navigate = useNavigate();
    const imageFiles:FileList | null = thumbnailInput.ref.current !== undefined ? thumbnailInput.ref.current.files : null;
    const videoFiles:FileList | null = videoInput.ref.current !== undefined ? videoInput.ref.current.files : null;
    const fileReader = new FileReader();
    const [imageURL, setImageUrl]= useState<string | null >(null);
    const [isSpinnerVisible, setIsSpinnerVisible] = useState<boolean>(false);

    fileReader.onload =(e) => {
        const result = e.target?.result;
        if(typeof result === "string"){
            setImageUrl(result);
        }
        
    };
    

    useEffect(() => {
        if(!keycloak.authenticated){
            alert("Should be authorized to upload video");
           window.location.href = "/";
        }
    }, [keycloak]);

    useEffect(() =>{
        if(imageFiles !== null ){
            if(imageFiles[0] !== null && imageFiles[0] != undefined){
                fileReader.readAsDataURL(imageFiles[0]);
            }
            
        }
    }, [imageFiles])


    async function createOnClick(isAuthenticated:boolean | undefined){
        if(isAuthenticated){
            if(titleInput.value.length > 0 && descriptionInput.value.length > 0 && imageFiles !== null && videoFiles !== null && categorySelect.current !== null){
                if(!imageFiles[0] && !videoFiles[0]){
                    alert("You have to upload video and thumbnail");
                } else{
                    setIsSpinnerVisible(true);
                await sendNewVideo({
                    title:titleInput.value,
                    description:descriptionInput.value,
                    thumbnail:imageFiles[0],
                    category:categorySelect.current.value,
                    video:videoFiles[0]
                }).then(() => {
                    setIsSpinnerVisible(false);
                    navigate("/")});
                }
            }
            else{
                alert("Fields must not be empty");
            }
        } else{
            alert("Should be authenticated");
        }
    }

    return(
        <div className={"video-upload-page"}>
            <div className={"video"}>
                <div className={"image-box"}>
                    <img className = {imageURL === null || imageURL === undefined ? "thumbnail-image" : "thumbnail-image thumbnail-active"} src = {imageURL === null || imageURL === undefined ? "tool-icons/image.png" : imageURL}/>
                </div>
                <input className="thumbnail-input" {...thumbnailInput} type="file" accept="image/*"/>
                <input className="video-input" {...videoInput} type="file" accept="video/*"/>
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
                <div className={"title"}>
                    Title:
                    <input className={"title-input"} {...titleInput} maxLength={150} placeholder={"Title..."}/>
                </div>

                <div className={"description"}>
                    Description:
                    <textarea className={"description-input"} {...descriptionInput} maxLength={255} placeholder={"Description...."}/>
                </div>


                <button className={"save-button"} onClick={() => createOnClick(keycloak.authenticated)}>
                    Create
                </button>

                {isSpinnerVisible &&
                <Spinner/>
                }
            </div>
        </div>
    );
})

export default VideoUpload;