import React, { useContext, useEffect, useState } from "react";
import { User } from "../model/User";
import { getUserSubscribes } from "../http-requests/GetRequests";
import { Context } from "..";
import Spinner from "../components/Spinner";
import NotFound from "../components/NotFound";
import UserCard from "../components/UserCard";
import { observer } from "mobx-react";
import "../styles/UserSubscribes.css"

const UserSubscribes = observer(() =>{

    const [users, setUsers] = useState<User[] | null | undefined>();
    const userService = useContext(Context).userService;

    useEffect(() =>{
        if(userService.isAuth !== undefined && userService.isAuth === false){
            alert("Should be authorized");
            window.location.href = "/";
        }
        if(userService.mainUser){
            getUserSubscribes(userService.mainUser.id.toString()).then(setUsers);
        }
    },[userService.isAuth])


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