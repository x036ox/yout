import React, { useEffect, useState } from "react";
import { PARAM_USER_ID } from "../utils/SearchQuerryParamConsts";
import { getUserById } from "../http-requests/GetRequests";
import { User } from "../model/User";
import { useInput } from "../hooks/useInput";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../http-requests/PutRequests";
import Spinner from "../components/Spinner";
import NotFound from "../components/NotFound";


const UserEdit = () =>{
    const urlParam = new URLSearchParams(window.location.search);
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [pictureURL, setPictureUrl]= useState<string | undefined >();
    const fileReader = new FileReader();
    
    const thumbnailInput = useInput("");
    const usernameInput = useInput("");
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
                if(user !== null){
                    setUser(user);
                    usernameInput.setValue(user.username);
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
            {
                <div className={"edit-page"}>
                    <img className = "user-pic" src = {pictureURL ? pictureURL : user.picture}/>
                    <input className="thumbnail-input" type="file" {...thumbnailInput} accept="image/*"/>
                    <div className={"username"}>
                        Username:
                        <input className={"title-input"} {...usernameInput} maxLength={100}/>
                    </div>

                    <div className={"save-link"}>
                        <button className={"save-button"} onClick={() =>{
                            const id:string|null = urlParam.get(PARAM_USER_ID);
                            if(id){
                                updateUser(id, imageFiles ? imageFiles[0] : null, usernameInput.value !== user.username ? usernameInput.value : null).then(updated =>{
                                    if(updated){
                                        navigate("/");
                                    }
                                });
                            }
                        }}>
                            Save
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default UserEdit;