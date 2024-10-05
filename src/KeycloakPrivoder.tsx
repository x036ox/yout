import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Keycloak, { KeycloakConfig } from 'keycloak-js';
import Spinner from './components/Spinner';
import { LOCAL_STORAGE_ACCESS_TOKEN, LOCAL_STORAGE_KEYCLOAK_TOKENS } from './utils/Consts';
import keycloak, { signout, renewTokensInLocalStorage, updateToken } from './keycloak';

const KeycloakContext = createContext<Keycloak>(keycloak);

export const useKeycloak = () => useContext(KeycloakContext);

interface KeycloakProviderProps {
    children: ReactNode;
}

export const KeycloakProvider = ({ children } : KeycloakProviderProps) => {
  const [keycloakInstance, setKeycloak] = useState<Keycloak | null>(null);

  useEffect(() => {
    const storedTokens = localStorage.getItem(LOCAL_STORAGE_KEYCLOAK_TOKENS);

    if (storedTokens) {
      const { token, refreshToken } = JSON.parse(storedTokens);
      keycloak.token = token;
      keycloak.refreshToken = refreshToken;
    }

    keycloak
      .init({ onLoad: 'check-sso',token: keycloak.token, refreshToken: keycloak.refreshToken, scope: process.env.REACT_APP_OAUTH_SCOPE + " roles", redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI})
      .then((authenticated) => {
        setKeycloak(keycloak);
        if (authenticated) {
         renewTokensInLocalStorage(keycloak.token, keycloak.refreshToken);
        }
        keycloak.onTokenExpired = () =>{
          updateToken();
        }
      });
  }, []);

  if (!keycloakInstance) {
    return(<Spinner/>);
  }

  return (
    <KeycloakContext.Provider value={keycloakInstance}>
      {children}
    </KeycloakContext.Provider>
  );
};