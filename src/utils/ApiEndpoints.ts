

//TODO: move all urls into ApiEndpoints object
const API = "/api";


export function buildUrl(url:string, queryParams:Record<string, string> = {}){
  const queryString = new URLSearchParams(queryParams).toString();
  return queryString ? `${url}?${queryString}` : url;
}

const PORT = "";
const HOST = "";                  //192.168.15.118
const PROTOCOL = "";
export const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "";
export const ApiEndpoints = {
  // required params: userId
  GET_USER_SEARCH_HISTORY: API_URL + "/user/search-history",
  // POST: no params, GET: id
  USER_INFO: API_URL + "/user/user-info",
  // DELETE: search option value
  DELETE_SEARCH_OPTION: API_URL + "/user/search-history",
  // GET: get recommendations
  GET_RECOMMENDATIONS: API_URL + "/recs",
  //PUT: required id to be added at the end
  AUTH_SERVER_UPDATE_USER: process.env.REACT_APP_OAUTH_AUTHORITY_URL + "/users/",
  UPLOAD_PICTURE: API_URL + "/user/picture/upload"
}

export const URL_SEND_SEARCH_OPTION:string = API_URL + "/user/search-history";
export const URL_GET_ALL_USERS:string = API_URL + "/user/admin";
export const URL_GET_ALL_VIDEOS_BY_OPTION:string = API_URL + "/admin";
export const URL_VALIDATE_USER_BY_TOKEN:string = API_URL + "/user/refresh"
export const URL_GET_ALL_VIDEOS:string = API_URL + "/"
export const URL_DELETE_VIDEO_BY_ID:string = API_URL + "/?videoId="
export const URL_UPDATE_VIDEO_BY_ID:string = API_URL + "/?videoId="
export const URL_GET_VIDEO_BY_ID:string = API_URL + "/?videoId="
export const URL_SEND_NEW_VIDEO:string = API_URL + "/"
export const URL_LOGIN_USER:string = API_URL + "/user/login";
export const URL_SEND_NEW_USER:string = API_URL + "/user/registration";
export const URL_WATCH_VIDEO_BY_ID:string = API_URL+ "/watch?videoId="
export const URL_LIKE_VIDEO_BY_ID:string = API_URL + "/user/like?videoId="
export const URL_CHECK_HAD_USER_LIKED:string = API_URL + "/user/liked?userId="
export const URL_DISLIKE_VIDEO_BY_ID:string = API_URL + "/user/dislike?videoId="
export const URL_SUBSCRIBE_CHANNEL_BY_ID:string = API_URL + "/user/subscribe?userId="
export const URL_UNSUBSCRIBE_CHANNEL_BY_ID:string = API_URL + "/user/unsubscribe?userId="
export const URL_CHECK_USER_SUBSCRIBED_CHANNEL_BY_ID:string = API_URL + "/user/subscribed?userId="
export const URL_GET_ALL_USER_VIDEOS:string = API_URL + "/user/videos?userId="
export const URL_UPLOAD_VIDEO:string = API_URL + "/user/upload";
export const URL_LOGOUT:string = API_URL + "/user/logout";
export const URL_CONFIRM_EMAIL:string = API_URL + "/user/confirm-email?u=";
export const URL_SEARCH_VIDEO:string = API_URL + "/search?search_query="
export const URL_M3U8INDEX = (id : number | string) => API_URL + "/" + id + "/index.m3u8";
export const URL_DELETE_USER_BY_ID:string = API_URL + "/user?userId=";
export const URL_UPDATE_USER_BY_ID:string = API_URL + "/user?userId=";
export const URL_GET_WATCH_HISTORY:string = API_URL + "/user/watch-history?userId=";
export const URL_ADD_USERS:string = API_URL + "/user/admin/add?a=";
export const URL_ADD_VIDEOS:string = API_URL + "/admin/add?a=";
export const URL_NOT_INTERESTED:string = API_URL + "/user/not-interested?userId=";
export const URL_USER_SUBSCRIBES:string = API_URL + "/user/subscribes";
export const URL_USER_LIKES:string = API_URL + "/user/likes";


async function loadConfig() {
    const resp = await fetch('/config.json').then(data => data.json()).then(url => url.apiURL);
    return resp;
  }



