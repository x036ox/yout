import React from 'react';
import {BrowserRouter} from "react-router-dom";
import Header from "./components/header/Header";
import "./styles/Global.css";
import Navbar from "./components/Navbar";
import AppRouter from "./AppRouter";
import axios, { AxiosResponse } from 'axios';
import { updateTokens, useKeycloak } from './KeycloakPrivoder';
import { LOCAL_STORAGE_KEYCLOAK_TOKENS } from './utils/Consts';

export const axiosInstance = axios.create();


function App() {
    const MAX_RETRIES = 2;
    const keycloak = useKeycloak();
    let numRetries = 0;
  
   React.useEffect(() => {
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
        if (error.response?.status === 401 && !originalRequest._retry && numRetries < MAX_RETRIES){
            keycloak.updateToken(30).then(success => {
                if (success) {
                  updateTokens(keycloak.token, keycloak.refreshToken);
                  axiosInstance.request(originalRequest);
                } else {
                  console.log("Token is still valid");
                }
              }).catch(() => {
                console.log('Failed to refresh the token, logging out');
                keycloak.logout({redirectUri:process.env.REACT_APP_OAUTH_REDIRECT_URI});
              });
              
        } else if(numRetries >= MAX_RETRIES){
            numRetries = 0;
        }
    })
  }, [keycloak.authenticated, keycloak]);
  

    return (
        <body className='body'>
            <BrowserRouter>
              <Header/>
              <Navbar/>
              {
                <AppRouter/>
              }
            </BrowserRouter>
        </body>
        );
}

export default App;
