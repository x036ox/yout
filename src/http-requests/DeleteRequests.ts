import { LOCAL_STORAGE_ACCESS_TOKEN } from "../utils/Consts";
import {URL_DELETE_SEARCH_OPTION, URL_DELETE_USER_BY_ID, URL_DELETE_VIDEO_BY_ID, URL_DISLIKE_VIDEO_BY_ID, URL_LOGOUT} from "../utils/ServerUrlConsts";

export async function deleteSearchOption(searchOptionValue:string){
    const url:string = URL_DELETE_SEARCH_OPTION;

    fetch(url, {
        method: "DELETE",
        headers:{
            "Content-type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        },
        body: JSON.stringify(searchOptionValue)
    }).then(response => response.json())
}

export async function logout(){
    fetch(URL_LOGOUT,{
        method:"DELETE",
        credentials:"include"
    });
}

export async function sendDislikeToVideo( userId:string,videoId:string){
    const url = URL_DISLIKE_VIDEO_BY_ID + videoId + "&userId=" + userId;

    await fetch(url, {
        method:"DELETE",
        headers:{
            "Content-type":"application/json"
        },
        body:null
    }).catch(console.error);

}


export async function deleteVideo(videoId:string){
    const url = URL_DELETE_VIDEO_BY_ID + videoId;

    fetch(url, {
        method: "DELETE",
        headers:{
            "Content-type":"application/json"
        },
        body: null
    })


}

export async function deleteUser(id:string){
    const url = URL_DELETE_USER_BY_ID + id;

    return await fetch(url, {
        method: "DELETE"
    }).then(response => {
        if(response.ok) return true;
        return false;
    })   
}