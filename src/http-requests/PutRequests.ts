import axios, { HttpStatusCode } from "axios";
import Video, { NewVideo } from "../model/Video";
import {
    ApiEndpoints,
    URL_DISLIKE_VIDEO_BY_ID,
    URL_LIKE_VIDEO_BY_ID,
    URL_SUBSCRIBE_CHANNEL_BY_ID, URL_UNSUBSCRIBE_CHANNEL_BY_ID,
    URL_UPDATE_USER_BY_ID,
    URL_UPDATE_VIDEO_BY_ID
} from "../utils/ApiEndpoints";
import { axiosInstance } from "../App";



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

export async function updateUser(id:string, picture:File | null, username:string | null){
    const apiUrl = URL_UPDATE_USER_BY_ID + id;
    const authServerUrl = ApiEndpoints.AUTH_SERVER_UPDATE_USER + id;
    const pictureUploadUrl = ApiEndpoints.UPLOAD_PICTURE;

    const body: { [key: string]: any } = {};
    
    if(username){
        body["username"] = username;
    }

    if(picture){
        const formData = new FormData();
        formData.append("picture", picture);
        const newPicture = await axios.post(pictureUploadUrl, formData)
            .then(response => response.data())
            .catch(console.error);
        if(picture !== newPicture){
            body["picture"] = newPicture;
        }
    }
    
    return await Promise.all([
        axios.put(apiUrl, body),
        axios.put(authServerUrl, body)
    ]).then(([response1, response2]) => {
        if(response1.status === HttpStatusCode.Ok && response2.status === HttpStatusCode.Ok) return true;
        return false;
    })   
}