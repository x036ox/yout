import axios, { HttpStatusCode } from "axios";
import Video, { NewVideo } from "../model/Video";
import {
    ApiEndpoints,
    URL_DISLIKE_VIDEO_BY_ID,
    URL_LIKE_VIDEO_BY_ID,
    URL_SUBSCRIBE_CHANNEL_BY_ID, URL_UNSUBSCRIBE_CHANNEL_BY_ID,
    URL_UPDATE_USER_BY_ID,
    URL_UPDATE_VIDEO_BY_ID
} from "../utils/endpoints";
import axiosInstance from "../axiosInstance";
import { AuthServerEndpoints } from "../utils/endpoints";
import { updateToken } from "../keycloak";



export async function sendUpdateVideo(videoId:string, title:string|null, category:string|undefined, description:string|null, thumbnail:File|null, video:File|null){
    const url = URL_UPDATE_VIDEO_BY_ID + videoId;
    const formData = new FormData();
    if(title){
        formData.append("title", title);
    }
    if(description){
        formData.append("description",description);
        }
        
    if(category){
        formData.append("category", category);
        }
        
    if(thumbnail){
        formData.append("thumbnail", thumbnail);
        }
    if(video){
        formData.append("video", video);
    }

    return await axiosInstance.put(url, formData).then(response => response.data)
    .catch(error => {
        console.error( error);
    })

        
}



export async function sendSubscribeChannel(userId:string, channelId:string){
    const url = URL_SUBSCRIBE_CHANNEL_BY_ID + userId + "&channelId=" + channelId;

    await axiosInstance.put(url).catch(console.error);
}

export async function sendUnsubscribeChannel(userId:string, channelId:string){
    const url = URL_UNSUBSCRIBE_CHANNEL_BY_ID + userId + "&channelId=" + channelId;

    await axiosInstance.put(url).catch(console.error);
}

export async function updateUser(id:string, picture:File | null, email:string | undefined){
    const apiUrl = URL_UPDATE_USER_BY_ID + id;
    const authServerUrl = AuthServerEndpoints.USER(id);
    const pictureUploadUrl = ApiEndpoints.UPLOAD_PICTURE;

    const apiBody: { [key: string]: any } = {};
    const authServerBody: { [key: string]: any } = {email: email};
    
    if(email){
        apiBody["email"] = email;
    }

    if(picture){
        const formData = new FormData();
        formData.append("image", picture);
        formData.append("id", id);
        const newPicture = await axiosInstance.post(pictureUploadUrl, formData)
            .then(response => response.data)
            .catch(console.error);
        if(picture !== newPicture){
            apiBody["picture"] = newPicture;
            authServerBody["attributes"] = {picture: newPicture}
        }
    }
    const headers = {
        "Content-Type":"application/json",
    }
    return await Promise.all([
        axiosInstance.put(apiUrl, apiBody, {headers: headers}),
        axiosInstance.put(authServerUrl, authServerBody, {headers: headers})
    ]).then(([response1, response2]) => {
        if(response1.status === HttpStatusCode.Ok && (response2.status >= 200 && response2.status < 300)) {
            return true;
        };
        return false;
    }).catch((error) =>{
        console.error(error);
    })   
}