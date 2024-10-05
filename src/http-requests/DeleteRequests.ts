import { HttpStatusCode } from "axios";
import axiosInstance from "../axiosInstance";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../utils/Consts";
import {ApiEndpoints, buildUrl, URL_DELETE_USER_BY_ID, URL_DELETE_VIDEO_BY_ID, URL_DISLIKE_VIDEO_BY_ID, URL_LOGOUT} from "../utils/endpoints";

export async function deleteSearchOption(searchOptionValue:string){
    const url = buildUrl(ApiEndpoints.DELETE_SEARCH_OPTION,{searchOptionValue: searchOptionValue});
    axiosInstance.delete(url.toString()).then(response => response.data)
}

export async function logout(){
    // fetch(URL_LOGOUT,{
    //     method:"DELETE",
    //     credentials:"include"
    // });
    //TODO: consider logout request
}

export async function sendDislikeToVideo( userId:string,videoId:string){
    const url = URL_DISLIKE_VIDEO_BY_ID + videoId + "&userId=" + userId;

    await axiosInstance.delete(url).catch(console.error);

}


export async function deleteVideo(videoId:string){
    const url = URL_DELETE_VIDEO_BY_ID + videoId;

    axiosInstance.delete(url).catch(console.error);


}

export async function deleteUser(id:string){
    const url = URL_DELETE_USER_BY_ID + id;

    return await axiosInstance.delete(url).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return true;
        }
        return false;
    });
}