import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Keycloak, { KeycloakConfig } from 'keycloak-js';
import Spinner from './components/Spinner';
import { LOCAL_STORAGE_ACCESS_TOKEN, LOCAL_STORAGE_KEYCLOAK_TOKENS } from './utils/Consts';

const keycloakConfig : KeycloakConfig= {
    url: process.env.REACT_APP_OAUTH_AUTHORITY_URL ? process.env.REACT_APP_OAUTH_AUTHORITY_URL : "",
    clientId: process.env.REACT_APP_OAUTH_CLIENT_ID ? process.env.REACT_APP_OAUTH_CLIENT_ID : "",
    realm: process.env.REACT_APP_OAUTH_REALM ? process.env.REACT_APP_OAUTH_REALM : ""
    // redirect_uri: process.env.REACT_APP_OAUTH_REDIRECT_URI ? process.env.REACT_APP_OAUTH_REDIRECT_URI : "",
    // scope: process.env.REACT_APP_OAUTH_SCOPE ? process.env.REACT_APP_OAUTH_SCOPE : "",
    // stateStore: new WebStorageStateStore({store: window.localStorage}),
    // userStore: new WebStorageStateStore({store: window.localStorage}),
    // loadUserInfo: false
}

export const keycloak = new Keycloak();
const KeycloakContext = createContext<Keycloak>(new Keycloak());

export const useKeycloak = () => useContext(KeycloakContext);

interface KeycloakProviderProps {
    children: ReactNode;
}


export function updateTokens(token:string | undefined, refreshToken:string|undefined){
  // console.log(token)
  localStorage.setItem(LOCAL_STORAGE_KEYCLOAK_TOKENS, JSON.stringify({
    token: token,
    refreshToken: refreshToken,
  }));
}
export function signout(keycloak: Keycloak){
  localStorage.removeItem(LOCAL_STORAGE_KEYCLOAK_TOKENS);
  keycloak.logout({redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI})
}

export const KeycloakProvider = ({ children } : KeycloakProviderProps) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const keycloak = new Keycloak(keycloakConfig);

    const storedTokens = localStorage.getItem(LOCAL_STORAGE_KEYCLOAK_TOKENS);

    if (storedTokens) {
      const { token, refreshToken } = JSON.parse(storedTokens);
      keycloak.token = token;
      keycloak.refreshToken = refreshToken;
    }

    keycloak
      .init({ onLoad: 'check-sso',token: keycloak.token, refreshToken: keycloak.refreshToken, scope: process.env.REACT_APP_OAUTH_SCOPE, redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI})
      .then((authenticated) => {
        setKeycloak(keycloak);
        setAuthenticated(authenticated);
        if (authenticated) {
         updateTokens(keycloak.token, keycloak.refreshToken);
        }
        keycloak.onTokenExpired = () =>{
          keycloak.updateToken(30).then(success => {
            if (success) {
              updateTokens(keycloak.token, keycloak.refreshToken);
            } else {
              console.log("Token is still valid");
            }
          }).catch(() => {
            console.log('Failed to refresh the token, logging out');
            signout(keycloak);
          });
        }
      });
  }, []);

  if (!keycloak) {
    return(<Spinner/>);
  }

  return (
    <KeycloakContext.Provider value={keycloak}>
      {children}
    </KeycloakContext.Provider>
  );
};