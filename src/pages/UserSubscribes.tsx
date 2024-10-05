import React, { useContext, useEffect, useState } from "react";
import { getUserSubscribes } from "../http-requests/GetRequests";
import Spinner from "../components/Spinner";
import NotFound from "../components/NotFound";
import UserCard from "../components/UserCard";
import { observer } from "mobx-react";
import "../styles/UserSubscribes.css"
import { YoutUserProfile } from "../model/YoutUserProfile";
import { useKeycloak } from "../KeycloakPrivoder";

const UserSubscribes = observer(() =>{

    const [users, setUsers] = useState<YoutUserProfile[] | null | undefined>();
    const keycloak = useKeycloak();

    useEffect(() =>{
        if(!keycloak.authenticated){
            alert("Should be authorized");
            window.location.href = "/";
        }
        if(keycloak.subject){
            getUserSubscribes(keycloak.subject).then(setUsers);
        }
    },[keycloak.subject])


    return(
        <div className={"user-subscribes"}>
            {
                users === undefined ?
                <Spinner/> :
                users === null ?
                <NotFound/> :
                users.map(user =>
                    <UserCard user={user}/> 
                )
            }
        </div>
    )
})

export default UserSubscribes;