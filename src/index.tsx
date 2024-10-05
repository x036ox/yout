import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import VideoService from "./service/VideoService";
import { KeycloakProvider } from './KeycloakPrivoder';

interface contextInterface{
    videoService:VideoService
}

const videoService = new VideoService();

export const Context = createContext<contextInterface>({
    videoService: videoService
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  
    <KeycloakProvider>
        <Context.Provider value={{
                videoService: videoService
            }}>
            {/* <React.StrictMode> */}
                <App/>
            {/* </React.StrictMode> */}
        </Context.Provider>
    </KeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
