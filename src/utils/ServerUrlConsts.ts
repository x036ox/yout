import config from '../config.json';

const PORT = "8080";
const HOST = "localhost:";                  //192.168.15.118
const PROTOCOL = "https://";
const API = "/api"
export const ADRESS = PROTOCOL + HOST + PORT + API;

export const URL_GET_USER_BY_ID:string = ADRESS + "/user?id=";
export const URL_SEND_SEARCH_OPTION:string = ADRESS + "/user/search-history";
export const URL_GET_ALL_USERS:string = ADRESS + "/user/admin";
export const URL_GET_ALL_VIDEOS_BY_OPTION:string = ADRESS + "/admin";
export const URL_VALIDATE_USER_BY_TOKEN:string = ADRESS + "/user/refresh"
export const URL_DELETE_SEARCH_OPTION:string = ADRESS + "/user/search-history"
export const URL_GET_ALL_VIDEOS:string = ADRESS + "/"
export const URL_DELETE_VIDEO_BY_ID:string = ADRESS + "/?videoId="
export const URL_UPDATE_VIDEO_BY_ID:string = ADRESS + "/?videoId="
export const URL_GET_VIDEO_BY_ID:string = ADRESS + "/?videoId="
export const URL_SEND_NEW_VIDEO:string = ADRESS + "/"
export const URL_LOGIN_USER:string = ADRESS + "/user/login";
export const URL_SEND_NEW_USER:string = ADRESS + "/user/registration";
export const URL_WATCH_VIDEO_BY_ID:string = ADRESS+ "/watch?videoId="
export const URL_LIKE_VIDEO_BY_ID:string = ADRESS + "/user/like?videoId="
export const URL_CHECK_HAD_USER_LIKED:string = ADRESS + "/user/liked?userId="
export const URL_DISLIKE_VIDEO_BY_ID:string = ADRESS + "/user/dislike?videoId="
export const URL_SUBSCRIBE_CHANNEL_BY_ID:string = ADRESS + "/user/subscribe?userId="
export const URL_UNSUBSCRIBE_CHANNEL_BY_ID:string = ADRESS + "/user/unsubscribe?userId="
export const URL_CHECK_USER_SUBSCRIBED_CHANNEL_BY_ID:string = ADRESS + "/user/subscribed?userId="
export const URL_GET_ALL_USER_VIDEOS:string = ADRESS + "/user/videos?userId="
export const URL_UPLOAD_VIDEO:string = ADRESS + "/user/upload";
export const URL_LOGOUT:string = ADRESS + "/user/logout";
export const URL_CONFIRM_EMAIL:string = ADRESS + "/user/confirm-email?u=";
export const URL_SEARCH_VIDEO:string = ADRESS + "/search?search_query="
export const URL_M3U8INDEX = (id : number | string) => ADRESS + "/" + id + "/index.m3u8";
export const URL_DELETE_USER_BY_ID:string = ADRESS + "/user?userId=";
export const URL_UPDATE_USER_BY_ID:string = ADRESS + "/user?userId=";
export const URL_GET_WATCH_HISTORY:string = ADRESS + "/user/watch-history?userId=";
export const URL_ADD_USERS:string = ADRESS + "/user/admin/add?a=";
export const URL_ADD_VIDEOS:string = ADRESS + "/admin/add?a=";
export const URL_NOT_INTERESTED:string = ADRESS + "/user/not-interested?userId=";
export const URL_USER_SUBSCRIBES:string = ADRESS + "/user/subscribes";
export const URL_USER_LIKES:string = ADRESS + "/user/likes";


async function loadConfig() {
    console.log("loadingasdasdd")
    const resp = await fetch('/config.json').then(data => data.json()).then(url => url.apiURL);
    console.log("response " +  resp);
    return resp;
  }



