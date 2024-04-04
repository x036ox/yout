import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import VideoService from "./context-classes/VideoService";
import UserService from './context-classes/UserService';
import axios, { AxiosInstance, HttpStatusCode } from 'axios';
import { LOCAL_STORAGE_ACCESS_TOKEN } from './utils/Consts';
import { validateUserByToken } from './http-requests/GetRequests';

interface contextInterface{
    userService: UserService,
    videoService:VideoService
}

const userService = new UserService();
const videoService = new VideoService();

export const Context = createContext<contextInterface>({
    userService:userService,
    videoService: videoService
});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Context.Provider value={{
      userService:userService,
      videoService: videoService
  }}>
      <React.StrictMode>
          <App />
      </React.StrictMode>
  </Context.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
