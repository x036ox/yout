import {SearchOption} from "../model/SearchOption";
import Video, { NewVideo } from "../model/Video";
import {URL_ADD_USERS, URL_ADD_VIDEOS, URL_LIKE_VIDEO_BY_ID, URL_LOGIN_USER, URL_NOT_INTERESTED, URL_SEND_NEW_USER, URL_SEND_NEW_VIDEO, URL_SEND_SEARCH_OPTION, URL_USER_INFO, URL_UPLOAD_VIDEO} from "../utils/ServerUrlConsts";
import {NOT_ACCEPTABLE, StatusCodes} from "http-status-codes";
import {Simulate} from "react-dom/test-utils";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../utils/Consts";
import axios from "axios";
import { axiosInstance } from "../App";
import { IdTokenClaims } from "oidc-client-ts";
import { fetchImageAsFile } from "../utils/ImageUtils";


//TODO: remove all explicit Authorization headers


export async function sendSearchOption(searchOptionValue:string){
    const url = URL_SEND_SEARCH_OPTION;
    const formData = new FormData();
    formData.append("value", searchOptionValue);
    return await axiosInstance.post(url, formData).then(response => response.data)
}

export async function sendUserInfo(userProfile:IdTokenClaims){
    const url = URL_USER_INFO.toString();
    const formData = new FormData();
    formData.append("id", userProfile.sub);
    if(userProfile.nickname){
        formData.append("username", userProfile.nickname);
    }
    if(userProfile.email){
        formData.append("email", userProfile.email);
    }
    if(userProfile.authorities){
        formData.append("authorities", userProfile.authorities as any);
    }
    if(userProfile.picture){
       await fetchImageAsFile(userProfile.picture).then(blob => {
            if(blob){
                formData.append("picture", blob);
            }
        });
    }

    await axiosInstance.post(url, formData)
    .catch(error => {
        console.error(error);
    });
}

export async function uploadImage(file:File){
    const formData = new FormData();
    formData.append("imageFile", file);
    const url = URL_UPLOAD_VIDEO;

     await axiosInstance.post(url, formData)
        .catch(error => {
            console.error(error);
            return null;
        })
}

export async function sendNotInterested(videoId:string, userId:string){
    const url = URL_NOT_INTERESTED + userId + "&videoId=" + videoId;
    await axiosInstance.post(url).catch(console.error);
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
    await axiosInstance.post(url,formData)
}

export async function addUsers(amount:string){
    const url = URL_ADD_USERS + amount;

    await axiosInstance.post(url).catch(console.error);
}

export async function addVideos(amount:string){
    const url = URL_ADD_VIDEOS + amount;

    await axiosInstance.post(url).catch(console.error);

}

export async function sendLikeToVideo( userId:string,videoId:string){
    const url = URL_LIKE_VIDEO_BY_ID + videoId + "&userId=" + userId;

    await axiosInstance.post(url).catch(console.error);

}

