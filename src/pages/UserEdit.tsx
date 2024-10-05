import React, { useEffect, useState } from "react";
import { PARAM_USER_ID } from "../utils/SearchQuerryParamConsts";
import { getUserById } from "../http-requests/GetRequests";
import { useInput } from "../hooks/useInput";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../http-requests/PutRequests";
import Spinner from "../components/Spinner";
import NotFound from "../components/NotFound";
import { YoutUserProfile } from "../model/YoutUserProfile";
import "../styles/UserEdit.css"
import axiosInstance from "../axiosInstance";
import { AuthServerEndpoints } from "../utils/endpoints";
import { useKeycloak } from "../KeycloakPrivoder";
import { updateToken } from "../keycloak";


const UserEdit = () =>{
    const urlParam = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    const keycloak = useKeycloak();

    const [user, setUser] = useState<YoutUserProfile | null | undefined>(undefined);
    const [pictureURL, setPictureUrl]= useState<string | undefined >();
    const fileReader = new FileReader();
    
    const thumbnailInput = useInput("");
    const emailInput = useInput("");
    const imageFiles:FileList | null = thumbnailInput.ref.current !== undefined ? thumbnailInput.ref.current.files : null;


    fileReader.onload =(e) => {
        const result = e.target?.result;
        if(typeof result === "string"){
            setPictureUrl(result);
        }
        
    };

    useEffect(() =>{
        if(imageFiles !== null ){
            if(imageFiles[0] !== null && imageFiles[0] != undefined){
                fileReader.readAsDataURL(imageFiles[0]);
            }
        }
    }, [imageFiles])

    useEffect(() => {
        const id:string|null = urlParam.get(PARAM_USER_ID);
        if(id !== null) {
            getUserById(id).then((user) => {
                if(user !== null && user.username){
                    setUser(user);
                }
            });
        }
    }, []);

    

    if(user == null){
        return(
            <NotFound/>
        )
    }
    else if(user === undefined){
        return(
            <Spinner/>
        )
    }

    

    return(
        <div className={"user-edit-page"}>
            <div className={"edit-page"}>
                    <img className = "user-pics" src = {pictureURL ? pictureURL : user.picture}/>
                    <input className="thumbnail-input" type="file" {...thumbnailInput} accept="image/*"/>
                    <a className="link-element" href={AuthServerEndpoints.ACCOUNT_API}>Edit more</a>

                    <div className={"save-link"}>
                        <button className={"save-button"} onClick={() =>{
                            const id:string|null = urlParam.get(PARAM_USER_ID);
                            if(id){
                                updateUser(id, imageFiles ? imageFiles[0] : null, user.email).then(updated =>{
                                    if(updated){
                                        updateToken().then(() => {
                                            window.location.href = "/";
                                        });
                                    }
                                });
                            }
                        }}>
                            Save
                        </button>
                    </div>
                </div>
        </div>
    )
}

export default UserEdit;