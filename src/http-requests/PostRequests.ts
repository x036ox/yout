import {SearchOption} from "../model/SearchOption";
import Video, { NewVideo } from "../model/Video";
import {URL_ADD_USERS, URL_ADD_VIDEOS, URL_LIKE_VIDEO_BY_ID, URL_LOGIN_USER, URL_NOT_INTERESTED, URL_SEND_NEW_USER, URL_SEND_NEW_VIDEO, URL_SEND_SEARCH_OPTION, URL_UPLOAD_VIDEO} from "../utils/ServerUrlConsts";
import {NewUser, User} from "../model/User";
import {NOT_ACCEPTABLE, StatusCodes} from "http-status-codes";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../utils/Consts";
import axios from "axios";



export async function sendSearchOption(searchOptionValue:string){
    const url = URL_SEND_SEARCH_OPTION;
    fetch(url, {
        method:"POST",
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        },
        body:JSON.stringify({searchOption: searchOptionValue})
    }).then(response => response.json())
}

export async function uploadImage(file:File){
    const formData = new FormData();
    formData.append("imageFile", file);
    const url = URL_UPLOAD_VIDEO;

     await fetch(url, {
        method:"POST",
        body:formData
    })
        .catch(error => {
            console.error(error);
            return null;
        })
}

export async function sendNotInterested(videoId:string, userId:string){
    const url = URL_NOT_INTERESTED + userId + "&videoId=" + videoId;
    await fetch(url, {
        method:"POST",
        headers:{
            "Authentication":"Bearer " + localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        }
    }).catch(console.error);
}

export async function sendNewVideo(video:NewVideo){
    const url = URL_SEND_NEW_VIDEO;
    const formData = new FormData();
    formData.append("description", video.description);
    formData.append("title", video.title);
    formData.append("thumbnail", video.thumbnail);
    formData.append("video", video.video);
    if(video.category){
        formData.append("category", video.category);
    }
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    await fetch(url,{
        method:"POST",
        headers:{
            "Authorization": "Bearer " + accessToken
        },
        body:formData
    })
}

export async function addUsers( amount:string){
    const url = URL_ADD_USERS + amount;

    await fetch(url, {
        method:"POST",
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        },
        body:null
    }).catch(console.error);
}

export async function addVideos(amount:string){
    const url = URL_ADD_VIDEOS + amount;

    await fetch(url, {
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:null
    }).catch(console.error);

}

export async function sendLikeToVideo( userId:string,videoId:string){
    const url = URL_LIKE_VIDEO_BY_ID + videoId + "&userId=" + userId;

    await fetch(url, {
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:null
    }).catch(console.error);

}

export async function sendLoginUser(email:string, password:string){
    return await fetch(URL_LOGIN_USER, {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({email:email, password:password})
    })
        .then(response => {
            if(response.status === StatusCodes.NOT_FOUND || response.status === StatusCodes.FORBIDDEN){
                return null;
            } else if(response.status === StatusCodes.OK){
                const accessToken = response.headers.get("accessToken")
                if(accessToken !== null){
                    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
                }
                return response.json();
            }
        })
        .then(data => {
            if(data === null){
                return null;
            } else return User.toUser(data);
        })
        .catch(error => {
            console.error(error);
            return null;
        })
        
    }

export async function sendNewUser(user:NewUser){
    const formData = new FormData();
    formData.append("picture", user.picture);
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("password", user.password);
    
    return await fetch( URL_SEND_NEW_USER, {
        method:"POST",
        credentials:"include",
        body:formData
    })
        .then(response => {
            const accessToken = response.headers.get("accessToken");
            if(accessToken !== null){
                localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
            }
            if(response.status !== StatusCodes.CREATED && response.status !== StatusCodes.OK){
                return null;
            } else{
                return response.json()
            }
        })
        .then(data => {
            if(data === null) {
                return null;
            } else{
                return User.toUser(data);
            }
        })
        .catch(error => {
            console.error(error);
            return null;
        })
}