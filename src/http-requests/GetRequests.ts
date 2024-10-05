import Video from "../model/Video";
import {
    ApiEndpoints,
    URL_CHECK_HAD_USER_LIKED, URL_CHECK_USER_SUBSCRIBED_CHANNEL_BY_ID, URL_CONFIRM_EMAIL, URL_GET_ALL_USERS, URL_GET_ALL_USER_VIDEOS,
    URL_GET_ALL_VIDEOS,
    URL_GET_ALL_VIDEOS_BY_OPTION, URL_GET_VIDEO_BY_ID, URL_GET_WATCH_HISTORY, URL_LIKE_VIDEO_BY_ID, URL_SEARCH_VIDEO, URL_USER_LIKES, URL_USER_SUBSCRIBES, URL_VALIDATE_USER_BY_TOKEN, URL_WATCH_VIDEO_BY_ID,
    buildUrl
} from "../utils/endpoints";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../utils/Consts";
import { AxiosError, HttpStatusCode } from "axios";
import axios from "axios";
import qs from "qs";
import { useContext } from "react";
import axiosInstance from "../axiosInstance";
import { YoutUserProfile } from "../model/YoutUserProfile";
import { SearchOption } from "../model/SearchOption";
import { error } from "console";


export async function getWatchHistory(userId:string){
    const url = URL_GET_WATCH_HISTORY + userId;

    return await axiosInstance.get(url).then(response => {
        if(response.status == HttpStatusCode.Ok){
            return response.data;
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
    return await axiosInstance.get(url).then(response => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
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
    return await axios.get(URL_CONFIRM_EMAIL + param)
        .then(response => {
            if(response.status === HttpStatusCode.Ok){
                return true;
            }
            return false;
        });
}

export async function getRecommendations(page: number, size:number, sortOption: number | null | undefined):Promise<Video[] | null | undefined> {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    const params = {page: page.toString(), size: size.toString()};
    if(sortOption){
        Object.assign(params, {sortOption:sortOption.toString()})
    }
    const url = buildUrl(ApiEndpoints.GET_RECOMMENDATIONS, params);
    return await axiosInstance.get(url.toString(), {
        headers: {
            "User-Languages": navigator.languages.join(",")
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


export async function getVideoById(videoId:string){
    const url = URL_GET_VIDEO_BY_ID + videoId;

    return await axiosInstance.get(url)
        .then((response) => {
            if(response.status === 404){
                return null;
            }
            return response.data;
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

    return await axiosInstance.get(url).then((response) => {
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
    return await axiosInstance.get(url).then(response => response.data).catch(console.error);
}

export async function checkUserSubscribedChannel(userId:string, channelId:string){
    const url = URL_CHECK_USER_SUBSCRIBED_CHANNEL_BY_ID + userId + "&channelId=" + channelId;
    return await axiosInstance.get(url).then(response => response.data);
}


export async function getUserById(userId:string){
    const url = buildUrl(ApiEndpoints.USER_INFO,{id: userId});

    return await axiosInstance.get(url.toString())
        .then(response => {
            if(response.status === 404){
                return null;
            }
            return response.data;
        })
        .then(data => {
            if(data === null){
                return null;
            }
            return new YoutUserProfile(data);
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });


}

export async function getAllUsers(options:string[], values: string[]){
    const url = URL_GET_ALL_USERS;
    
    return await axiosInstance.get(url, {
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
            return data.map((data:any) => new YoutUserProfile(data))
        }
    }).catch(error =>{
        console.error(error)
        return null;
    })
}

export async function getUserSubscribes(userId:string){
    const url = URL_USER_SUBSCRIBES;
    return await axiosInstance.get(url, {
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
            return data.map((data:any) => new YoutUserProfile(data))
        }
    }).catch(error =>{
        console.error(error)
        return null;
    })
}

export async function getUserLikes(userId:string){
    const url = URL_USER_LIKES;
    return await axiosInstance.get(url, {
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

    return await axiosInstance.get(url).then((response) => {
        if(response.status === HttpStatusCode.Ok){
            return response.data;
        }
        return null;
    })
        .then((data) => {
            if(data === null){
                return null;
            }
            return data.map(Video.toVideo);
        })
}

export async function getUserSearchHistory(userId:string){
    const url = buildUrl(ApiEndpoints.GET_USER_SEARCH_HISTORY, {userId:userId});
    return await axiosInstance.get(url.toString())
    .then(response => {
        if(response.status === HttpStatusCode.Unauthorized){
            return null;
        }
        
        return response.data.map((query:string) => new SearchOption(query));
    }).catch(error =>{
        console.error(error);
        return null;
    })
    ;
}
