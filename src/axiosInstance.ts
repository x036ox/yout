import axios from "axios";
import keycloak, { signout, renewTokensInLocalStorage, updateToken } from "./keycloak";
import { LOCAL_STORAGE_KEYCLOAK_TOKENS } from "./utils/Consts";

export const axiosInstance = axios.create();

const MAX_RETRIES = 2;
let numRetries = 0;

axiosInstance.interceptors.request.use(cfg => {
    let accessToken;
    if(keycloak.token){
        accessToken = "Bearer " + keycloak.token
    } else{
        const tokens = localStorage.getItem(LOCAL_STORAGE_KEYCLOAK_TOKENS);
        if(tokens){
            const {token} = accessToken = JSON.parse(tokens);
            accessToken = "Bearer " + token
        }
    }
    cfg.headers.Authorization = accessToken;
    return cfg;
}, error =>{
    console.error(error);
});
axiosInstance.interceptors.response.use(response => response, error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && numRetries < MAX_RETRIES){
        numRetries++;
        return updateToken().then(token => {
            originalRequest.headers.Authorization = "Bearer " + token
            return axiosInstance.request(originalRequest);
        });
    } else if(numRetries >= MAX_RETRIES){
        numRetries = 0;
    }
    return error;
})

export default axiosInstance;