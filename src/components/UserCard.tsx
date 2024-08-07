import React from "react";
import "../styles/UserCard.css"
import { useNavigate } from "react-router-dom";
import { CHANNEL_ROUTE, USER_EDIT_ROUTE } from "../utils/RoutesConsts";
import { deleteUser } from "../http-requests/DeleteRequests";
import { YoutUserProfile } from "../model/YoutUserProfile";

interface UserCardProps{
    user:YoutUserProfile;
    deleteUserFunc?:Function;
}

const UserCard:React.FC<UserCardProps> = ({user, deleteUserFunc}) =>{

    const navigate = useNavigate();


    return(
        <div className="user-card">
            <div className="left-container">
                <img className="user-pic" src={user.picture}/>
                <div className="user-id-container">
                    Id:
                    {user.id}
                </div>
            </div>
            <div className="user-info-container">
                <div className="info-field-div">Username: {user.username}</div>
                <div className="info-field-div">Subscribers: {user.subscribers}</div>
                <div className="info-field-div">Amount of videos: {user.videos ? user.videos.length : 0}</div>
                <div className="info-field-div">Admin: {user.isAdmin}</div>
            </div>
            <span className="channel-link" onClick={() => navigate(CHANNEL_ROUTE + "?userId=" + user.id)}>
                <img className="channel-link-img" src="tool-icons/link.png"/>
            </span>
            <span className="delete-button" onClick={() =>{
                deleteUser(user.id.toString()).then(deleted =>{
                    if(deleted && deleteUserFunc){
                        deleteUserFunc(user);
                    }
                })
            }} >
                <img className="delete-img" src="tool-icons/VideoDeleteIcon.png"/>
            </span>
            <span className="edit-button" onClick={() => navigate(USER_EDIT_ROUTE + "?userId=" + user.id)}>
                <img className="edit-img" src="tool-icons/VideoEditIcon.png"/>
            </span>
        </div>
    );
}

export default UserCard;