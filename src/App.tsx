import React, {useContext, useEffect} from 'react';
import {Context} from "./index";
import {BrowserRouter, useNavigate} from "react-router-dom";
import Header from "./components/header/Header";
import "./styles/Global.css";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import AppRouter from "./AppRouter";
import {type} from "os";
import {LOCAL_STORAGE_ACCESS_TOKEN, LOCAL_STORAGE_USER} from "./utils/Consts";
import axios, { Axios, AxiosError, AxiosHeaders, AxiosResponse, HttpStatusCode } from 'axios';
import axiosRetry from 'axios-retry';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { error } from 'console';
import Spinner from './components/Spinner';
import { sendUserInfo } from './http-requests/PostRequests';

export const axiosInstance = axios.create();


function App() {
const auth = useAuth();
const [hasTriedSignin, setHasTriedSignin] = React.useState(false);
  
   React.useEffect(() => {
    if(!auth.user && !hasTriedSignin){
        auth.startSilentRenew()
        setHasTriedSignin(true);
    }
    if(auth.user){
        axiosInstance.interceptors.request.use(cfg => {
            const accessToken = auth.user ? "Bearer " + auth.user.access_token : "";
            cfg.headers.Authorization = accessToken;
            return cfg;
        }, error =>{
            console.error(error);
        });
        axiosInstance.interceptors.response.use(response => response, error => {
            const response:AxiosResponse = error.response;
            if(response.status === HttpStatusCode.Forbidden && auth.user){
                sendUserInfo(auth.user.profile);
            }
        })
    }
  }, [auth, hasTriedSignin]);

  if(auth.activeNavigator){
        return (<div>
            <Spinner/>
        </div>);
  }
  //TODO: consider user picture usage
  //TODO: adapt yout back to new conditions(user id with string, persistance user profile, search-history endpoint, user-videos endpoint)
    

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>;
    }

    return (
        <body className='body'>
            <BrowserRouter>
              <Header/>
              <Navbar/>
              {
                auth.isLoading ?
                <Spinner/>
                :
                <AppRouter/>
              }
            </BrowserRouter>
        </body>
        );
}

export default App;
