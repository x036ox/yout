import Video from "../model/Video";
import {User} from "../model/User";
import {
    URL_CHECK_HAD_USER_LIKED, URL_CHECK_USER_SUBSCRIBED_CHANNEL_BY_ID, URL_CONFIRM_EMAIL, URL_GET_ALL_USERS, URL_GET_ALL_USER_VIDEOS,
    URL_GET_ALL_VIDEOS,
    URL_GET_ALL_VIDEOS_BY_OPTION,
    URL_GET_USER_BY_ID, URL_GET_VIDEO_BY_ID, URL_GET_WATCH_HISTORY, URL_LIKE_VIDEO_BY_ID, URL_SEARCH_VIDEO, URL_USER_LIKES, URL_USER_SUBSCRIBES, URL_VALIDATE_USER_BY_TOKEN, URL_WATCH_VIDEO_BY_ID
} from "../utils/ServerUrlConsts";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../utils/Consts";
import { AxiosError, HttpStatusCode } from "axios";
import axios from "axios";
import qs from "qs";
import { useContext } from "react";
import { axiosInstance } from "../App";


export async function validateUserByToken():Promise<any>{

    const url =  URL_VALIDATE_USER_BY_TOKEN;
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);

    // return axiosInstance.get(url, {
    //     withCredentials:true
    // }).then(response => {
    //     if(response.status === HttpStatusCode.Ok){
    //         const accessToken = response.headers["accesstoken"];
    //         if(accessToken){
    //             localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
    //         }
    //         return response.data;
    //     }
    //     else   {
    //         return null;
    //     }
    // })
    // .then(data => {
    //     if(data === null){
    //         return null;
    //     }
    //     else{
    //         return User.toUser(data);
    //     }
    // })
    //  .catch(error => {
    //      console.error(error);
    //      return null;
    //  })
    
     return await fetch(url,{
        credentials:"include"
     })
        .then(response => {
            if(response.ok){
                const accessToken = response.headers.get("accessToken");
                if(accessToken !== null && accessToken.length > 0){
                    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
                }
                return response.json()
            }
            else   {
                return null;
            }
        })
        .then(data => {
            if(data === null){
                return null;
            }
            else{
                return User.toUser(data);
            }
        })
         .catch(error => {
             console.error(error);
             return null;
         })
}

export async function getWatchHistory(userId:string){
    const url = URL_GET_WATCH_HISTORY + userId;
    
    return await fetch(url, {
        headers:{
            "Authorization":"Bearer " + localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        }
    }).then(response => {
        if(response.ok){
            return response.json();
        }
        return null;
    }).then(data =>{
        if(data === null){
            return null;
        }
        return data.map(Video.toVideo);
    }).catch(er =>{
        console.error(er);
        return null;
    });
}

export async function searchVideos(param:string) : Promise<Video[] | null>{
    const url = URL_SEARCH_VIDEO + param;
    return await fetch(url).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.json();
        } 
        return null;
    }) .then(data => {
        if(data === null){
            return null;
        }
        else{
            return data.map(Video.toVideo);
        }
    })
     .catch(error => {
         console.error(error);
         return null;
     });
}



export async function confirmEmail(param:string){
    return await fetch(URL_CONFIRM_EMAIL + param)
        .then(response => {
            if(response.status === HttpStatusCode.Ok){
                return true;
            }
            return false;
        });
}

export async function getVideos(page: number, size:number):Promise<Video[] | null | undefined> {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    let url = URL_GET_ALL_VIDEOS;
    return await axiosInstance.get(url, {
        params: {
            page: page,
            size: size.toString()
        },
        paramsSerializer: params => qs.stringify(params, {arrayFormat: "repeat"}),
        headers: {
            "User-Languages": navigator.languages.join(","),
            "Authorization": accessToken ? "Bearer " + accessToken : ""
        }
    }).then((response) => {
        if (response === undefined) {
            return undefined;
        }
        return response.data;
    })
    .then((data) => {
        if (data === null) {
            return null;
        }
        if(data === undefined){
            return undefined;
        }
        
        return data.map(Video.toVideo);
    })
    .catch((error: AxiosError) => {
        console.error(error)
        if(error.response?.status === HttpStatusCode.Unauthorized){
            return undefined;
        }
        return null;
    })
        
}

export async function getAllVideosSorted(sortOption:number){
    const url = URL_GET_ALL_VIDEOS + "?sortOption=" + sortOption.toString();

    return await fetch(url, {
        headers:{
            "User-Languages": navigator.languages.join(",")
        }
    }).then((response) => {
        if(response.ok){
            return response.json();
        }
        return null;
    })
        .then((data) => {
            if(data === null){
                return null;
            }
            return data.map(Video.toVideo);
        })
        .catch((error) => {
            console.error(error);
            return null;
        })
}


export async function getVideoById(videoId:string){
    const url = URL_GET_VIDEO_BY_ID + videoId;

    return await fetch(url)
        .then((response) => {
            if(response.status === 404){
                return null;
            }
            return response.json();
        })
        .then((data) => {
            if(data === null){
                return null;
            }
            return  Video.toVideo(data);
        })
        .catch((error) => {
            console.error(error);
            return null;
        })
}

export async function watchVideoById(videoId:string){
    const url = URL_WATCH_VIDEO_BY_ID + videoId;
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);

    return await axiosInstance(url).then((response) => {
        if(response.status === 404){
            return null;
        }
        return response.data;
    })
        .then((data) => {
            if(data === null){
                return null;
            }
            return Video.toVideo(data);
        })
        .catch((error) => {
            console.error(error);
            return null;
        })
}

export async function checkUserLikedVideo(userId:string, videoId:string){
    const url = URL_CHECK_HAD_USER_LIKED + userId + "&videoId=" + videoId;
    return await fetch(url).then(response => response.json());
}

export async function checkUserSubscribedChannel(userId:string, channelId:string){
    const url = URL_CHECK_USER_SUBSCRIBED_CHANNEL_BY_ID + userId + "&channelId=" + channelId;
    return await fetch(url).then(response => response.json());
}


export async function getUserById(userId:string){
    const url = URL_GET_USER_BY_ID + userId;

    return await fetch(url)
        .then(response => {
            if(response.status === 404){
                return null;
            }
            return response.json();
        })
        .then(data => {
            if(data === null){
                return null;
            }
            return User.toUser(data);
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });


}

export async function getAllUsers(options:string[], values: string[]){
    const url = URL_GET_ALL_USERS;
    
    return await axiosInstance.get(url, {
        headers:{
            "Authorization":"Bearer " + localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        },
        params:{
            option: options,
            value: values
        },
        paramsSerializer: params => qs.stringify(params, {arrayFormat: "repeat"})
    }).then(response =>{
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
        return null;
    }).then(data => {
        if(data != null){
            return data.map(User.toUser)
        }
    }).catch(error =>{
        console.error(error)
        return null;
    })
}

export async function getUserSubscribes(userId:string){
    const url = URL_USER_SUBSCRIBES;
    return await axiosInstance.get(url, {
        headers:{
            "Authorization":"Bearer " + localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        },
        params:{
            userId: userId
        }
    }).then(response =>{
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
        return null;
    }).then(data => {
        if(data != null){
            return data.map(User.toUser)
        }
    }).catch(error =>{
        console.error(error)
        return null;
    })
}

export async function getUserLikes(userId:string){
    const url = URL_USER_LIKES;
    return await axiosInstance.get(url, {
        headers:{
            "Authorization":"Bearer " + localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        },
        params:{
            userId: userId
        }
    }).then(response =>{
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
        return null;
    }).then(data => {
        if(data != null){
            return data.map(Video.toVideo)
        }
    }).catch(error =>{
        console.error(error)
        return null;
    })
}

export async function getAllVideos(options:string[], values:string[]){
    const url = URL_GET_ALL_VIDEOS_BY_OPTION;
    return await axiosInstance.get(url, {
        headers:{
            "Authorization":"Bearer " + localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
        },
        params:{
            option: options,
            value: values
        },
        paramsSerializer: params => qs.stringify(params, {arrayFormat: "repeat"})
    }).then(response =>{
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
        return null;
    }).then(data => {
        if(data != null){
            return data.map(Video.toVideo)
        }
    }).catch(error =>{
        console.error(error)
        return null;
    })
}

export async function getAllUserVideosSorted(userId:string, sortOption:number){
    const url = URL_GET_ALL_USER_VIDEOS + userId + "&sortOption=" + sortOption;

    return await fetch(url).then((response) => {
        if(response.ok){
            return response.json();
        }
        return null;
    })
        .then((data) => {
            if(data === null){
                return null;
            }
            return data.map(Video.toVideo);
        })
        .catch((error) => {
            console.error(error);
            return null;
        })
}
