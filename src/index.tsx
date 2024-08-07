import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import VideoService from "./service/VideoService";
import axios, { AxiosInstance, HttpStatusCode } from 'axios';
import { LOCAL_STORAGE_ACCESS_TOKEN } from './utils/Consts';
import { AuthProvider } from 'react-oidc-context';
import { User, UserManager, UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';
import { sendUserInfo } from './http-requests/PostRequests';

interface contextInterface{
    videoService:VideoService
}

const videoService = new VideoService();

export const Context = createContext<contextInterface>({
    videoService: videoService
});

const oidcConfig :UserManagerSettings = {
    authority: "http://localhost:8090",
    client_id: "QNzx4MtHUTdqHa3ntsbvlHe9HLGb9h8DTUKubgdF2lQ",
    client_secret: "H6XTvTeKN3Lx7nPrtg_PCrF5c50B5JVfrWqBPZCB1ZG0o0ZtZqgToIASfdGfl-he",
    redirect_uri: "https://localhost:8080",
    scope: "openid read create edit delete",
    stateStore: new WebStorageStateStore({store: window.localStorage}),
    userStore: new WebStorageStateStore({store: window.localStorage}),
    client_authentication: "client_secret_basic",
    loadUserInfo: false
}

const onSigninCallback = (_user: User | void): void => {
    if(_user){
        sendUserInfo(_user.profile);
    }
    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    )
    }

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Context.Provider value={{
      videoService: videoService
  }}>
      <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
      </AuthProvider>
  </Context.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
