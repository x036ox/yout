import React, { useContext, useEffect, useState } from "react";
import { getUserSubscribes } from "../http-requests/GetRequests";
import { Context } from "..";
import Spinner from "../components/Spinner";
import NotFound from "../components/NotFound";
import UserCard from "../components/UserCard";
import { observer } from "mobx-react";
import "../styles/UserSubscribes.css"
import { useAuth } from "react-oidc-context";
import { YoutUserProfile } from "../model/YoutUserProfile";

const UserSubscribes = observer(() =>{

    const [users, setUsers] = useState<YoutUserProfile[] | null | undefined>();
    const auth = useAuth();

    useEffect(() =>{
        if(!auth.isAuthenticated){
            alert("Should be authorized");
            window.location.href = "/";
        }
        if(auth.user){
            getUserSubscribes(auth.user.profile.sub).then(setUsers);
        }
    },[auth.user])


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