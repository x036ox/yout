import axios from "axios";
import Video, { NewVideo } from "../model/Video";
import {
    URL_DISLIKE_VIDEO_BY_ID,
    URL_LIKE_VIDEO_BY_ID,
    URL_SUBSCRIBE_CHANNEL_BY_ID, URL_UNSUBSCRIBE_CHANNEL_BY_ID,
    URL_UPDATE_USER_BY_ID,
    URL_UPDATE_VIDEO_BY_ID
} from "../utils/ServerUrlConsts";
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

    await fetch(url, {
        method:"PUT",
        headers:{
            "Content-type":"application/json"
        },
        body:null
    }).catch(console.error);
}

export async function sendUnsubscribeChannel(userId:string, channelId:string){
    const url = URL_UNSUBSCRIBE_CHANNEL_BY_ID + userId + "&channelId=" + channelId;

    await fetch(url, {
        method:"PUT",
        headers:{
            "Content-type":"application/json"
        },
        body:null
    }).catch(console.error);
}

export async function updateUser(id:string, picture:File | null, username:string | null){
    const url = URL_UPDATE_USER_BY_ID + id;
    const formData = new FormData();
    if(picture){
        formData.append("picture", picture);
    }
    if(username){
        formData.append("username", username);
    }

    return await fetch(url, {
        method: "PUT",
        body:formData
    }).then(response => {
        if(response.ok) return true;
        return false;
    })   
}