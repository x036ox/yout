import React, {useContext, useEffect} from 'react';
import {Context} from "./index";
import {validateUserByToken} from "./http-requests/GetRequests";
import {BrowserRouter, useNavigate} from "react-router-dom";
import Header from "./components/header/Header";
import "./styles/Global.css";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import AppRouter from "./AppRouter";
import {type} from "os";
import {LOCAL_STORAGE_ACCESS_TOKEN, LOCAL_STORAGE_USER} from "./utils/Consts";
import axios, { Axios, AxiosError, AxiosHeaders, HttpStatusCode } from 'axios';
import axiosRetry from 'axios-retry';

export const axiosInstance = axios.create();

function App() {
  const userStorage = useContext(Context).userService;
  const cookies = document.cookie;
  axiosInstance.interceptors.request.use(config => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    if(accessToken){
      config.headers.Authorization = "Bearer " + accessToken;
    }
    return config;
  })

  let isRefreshing = false;

  axiosRetry(axiosInstance, {
    retries:1,
    retryDelay: axiosRetry.exponentialDelay,
    shouldResetTimeout: true,
    retryCondition(error) {
      if(error.response?.status === 401){
          return true;
      }
      return false;
      },
      onRetry: async (retryCount, error, requestConfig) =>{
        await validateUserByToken().then(user => {
          if (user !== null) {
            userStorage.login(user);
            if(requestConfig.headers)
                requestConfig.headers.Authorization = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
          } else {
            userStorage.mainUser = null;
            userStorage.isAuth = false;
          }
        })
      }
  });
  


useEffect(() => {
  validateUserByToken().then(user => {
    if (user !== null) {
      userStorage.login(user);
    } else {
      userStorage.mainUser = null;
      userStorage.isAuth = false;
      //window.location.href = '/login';
    }
  })
})

  return (
    <div className="App body">
        <BrowserRouter>
            <Header/>
          <Navbar/>
          <AppRouter/>
        </BrowserRouter>
    </div>
  );
}

export default App;
