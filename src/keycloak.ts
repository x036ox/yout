import Keycloak, { KeycloakConfig } from "keycloak-js";
import { LOCAL_STORAGE_KEYCLOAK_TOKENS } from "./utils/Consts";

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


const keycloak = new Keycloak(keycloakConfig);

export async function updateToken(){
    return keycloak.updateToken(300).then(success => {
        if (success) {
          renewTokensInLocalStorage(keycloak.token, keycloak.refreshToken);
        } else {
          console.log("Token is still valid");
        }
        return keycloak.token;
      }).catch(() => {
        console.log('Failed to refresh the token, logging out');
        signout(keycloak);
      });
}

export function renewTokensInLocalStorage(token:string | undefined, refreshToken:string|undefined){
    localStorage.setItem(LOCAL_STORAGE_KEYCLOAK_TOKENS, JSON.stringify({
      token: token,
      refreshToken: refreshToken,
    }));
  }
  export function signout(keycloak: Keycloak){
    localStorage.removeItem(LOCAL_STORAGE_KEYCLOAK_TOKENS);
    keycloak.logout({redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI})
  }


export default keycloak;