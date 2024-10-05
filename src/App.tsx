import React from 'react';
import {BrowserRouter} from "react-router-dom";
import Header from "./components/header/Header";
import "./styles/Global.css";
import Navbar from "./components/Navbar";
import AppRouter from "./AppRouter";
import axios, { AxiosResponse } from 'axios';
import { useKeycloak } from './KeycloakPrivoder';
import { LOCAL_STORAGE_KEYCLOAK_TOKENS } from './utils/Consts';
import { renewTokensInLocalStorage } from './keycloak';



function App() {
    const keycloak = useKeycloak();
  
   React.useEffect(() => {
   
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
