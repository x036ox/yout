import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css"
import { getAllUsers, getAllVideos } from "../http-requests/GetRequests";
import Video from "../model/Video";
import UserCard from "../components/UserCard";
import VideoBox from "../components/VideoBox";
import { addUsers, addVideos } from "../http-requests/PostRequests";
import Spinner  from "../components/Spinner";
import NotFound from "../components/NotFound";
import { YoutUserProfile } from "../model/YoutUserProfile";
import { Authorities } from "../utils/Authorities";
import { useKeycloak } from "../KeycloakPrivoder";

enum Tabs{
    VIDEOS,
    USERS
}

enum UserOptions{
    BY_SUBSCRIBERS = "BY_SUBSCRIBERS",
    BY_EMAIL = "BY_EMAIL",
    BY_ID = "BY_ID",
    BY_VIDEO = "BY_VIDEO",
    ADMINS = "ADMINS",
    BY_USERNAME = "BY_USERNAME",
    MOST_SUBSCRIBERS = "MOST_SUBSCRIBERS"
}

enum VideoOptions{
    BY_ID = "BY_ID",
    MOST_DURATION = "MOST_DURATION",
    BY_VIEWS = "BY_VIEWS",
    BY_LIKES = "BY_LIKES",
    MOST_LIKES = "MOST_LIKES",
    MOST_VIEWS = "MOST_VIEWS",
    BY_TITLE = "BY_TITLE"
}

export const Admin = () => {
    const ADD_VIDEOS_NUM = "5";

    const keycloak = useKeycloak();
    const navigate = useNavigate();

    const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.USERS);
    const [users, setUsers] = useState<YoutUserProfile[] | null | undefined>(undefined);
    const [videos, setVideos] = useState<Video[] | null | undefined>(undefined);
    const [addVideosButtonPressed, setAddVideosButtonPressed] = useState<boolean>(false);
    const [addUsersButtonPressed, setAddUsersButtonPressed] = useState<boolean>(false);
    const [isContentLoading, setIsContentLoading] = useState<boolean>(false);
    
    useEffect(() => {
        if(!keycloak.hasResourceRole(Authorities.ADMIN)){
            navigate("/");
        }
    },[keycloak])

    function onChange(event:any){
        const value = event.target.value;
    }

    function getInputValues() {
        const radioContainers = document.querySelectorAll('.radiobox');

        const options:string[] = [];
        const values: string[] = [];
    
        radioContainers.forEach(container => {
          const radio = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
          const input = container.querySelector('input[id="input"]') as HTMLInputElement;
          const inputStart = container.querySelector('input[id="input-start"]') as HTMLInputElement;
          const inputEnd = container.querySelector('input[id="input-end"]') as HTMLInputElement;
            
          if (radio && radio.checked) {
            if(input){
                if(input.value.length == 0){
                    alert("Field must not be empty");
                    return;
                }
                options.push(radio.value);
                values.push(input.value);
            } else if(inputStart && inputEnd){
               if(inputStart.value.length == 0 || inputEnd.value.length == 0){
                    alert("Fields must not be empty");
                    return;
               }
               if(!/^\d+$/.test(inputStart.value) && !/^\d+$/.test(inputEnd.value)){
                    alert("Fields must contain only numbers");
                    return;
               }
               options.push(radio.value);
                values.push(inputStart.value + "/" + inputEnd.value);
            } else{
                console.error("Unable to get input fields");
            }
          }
        });
        if(currentTab === Tabs.USERS){
            setIsContentLoading(true);
            getAllUsers(options, values).then(videos =>{
                setUsers(videos);
                setIsContentLoading(false);
            });
      } else if(currentTab === Tabs.VIDEOS){
            setIsContentLoading(true);
            getAllVideos(options, values).then(videos =>{
                setVideos(videos);
                setIsContentLoading(false);
            });
      } 
      options.splice(0, options.length);
      values.splice(0, values.length); 
      }

      function deleteUser(user:YoutUserProfile){
        setUsers(users?.filter(u => u.id !== user.id));
      }

      async function addUsersOnClick(event:any){
        setAddUsersButtonPressed(true);
        event.target.disabled = true;
        addUsers(ADD_VIDEOS_NUM).then(() => setAddUsersButtonPressed(false));
        event.target.disabled = false;
      }
      
      async function addVieosOnClick(event :any){
        setAddVideosButtonPressed(true);
        event.target.disabled = true;
        await addVideos("5").then(() => setAddVideosButtonPressed(false));
        event.target.disabled = false;
      }


    return(
        <div>
            <button className={"user-tab-button" + (currentTab === Tabs.USERS ? " button-active" : "")} onClick={() => {
                setCurrentTab(Tabs.USERS);
            }}>
                Users
            </button>
            <button className={"video-tab-button" + (currentTab === Tabs.VIDEOS ? " button-active" : "")} onClick={() => {
                setCurrentTab(Tabs.VIDEOS)
            }}>
                Videos
            </button>
            
            
            {
                currentTab === Tabs.USERS &&
                <div className="users-tab">
                    <button className="add-button" onClick={addUsersOnClick}>
                        Add 5 users
                    </button>
                    {addUsersButtonPressed &&
                        <Spinner className={"add-button-spinner"}/>
                    }
                    <div style={{display:"inline"}}>
                        Choose option:
                    </div>
                    <label className="radiobox">
                        <span className="radiobox-value">
                        <input type="checkbox" name="videoRadioGroup" value={UserOptions.BY_ID}/>
                        Id:
                        </span>
                        <input id="input" className="value-input" type="text" placeholder="Id..."/>
                    </label>
                    <label className="radiobox">
                            <span className="radiobox-value">
                            <input type="checkbox" name="videoRadioGroup" value={UserOptions.BY_EMAIL}/>
                            Email:
                            </span>
                            <input id="input" className="value-input" type="text" placeholder="Email..."/>
                        </label>
                    <label className="radiobox">
                        <span className="radiobox-value">
                        <input type="checkbox" name="videoRadioGroup" value={UserOptions.BY_USERNAME}/>
                        Username:
                        </span>
                        <input id="input" className="value-input" type="text" placeholder="Username..."/>
                    </label>
                    <label className="radiobox">
                        <span className="radiobox-value">
                        <input type="checkbox" name="videoRadioGroup" value={UserOptions.BY_VIDEO}/>
                        Num videos:
                        </span>
                        <span className="radiobox-value">
                       <input id="input-start" className="input-start" type="text" placeholder="From:"/>
                        <input id="input-end" className="input-end" type="text" placeholder="To..."/>
                       </span>
                    </label>
                    <button className="admin-search-button" onClick={() => getInputValues()}>
                        <img className="admin-search-icon" src="tool-icons/search.svg"/>
                    </button>

                    <div className="page-grid">
                        {
                            isContentLoading ?
                            <Spinner/> :
                            users === null || users?.length == 0 ?
                            <NotFound/> :
                            users?.map(user =>
                                <UserCard user={user} deleteUserFunc={deleteUser}/>
                            )
                        }
                    </div>
                </div>
            }
            {
                currentTab === Tabs.VIDEOS &&
                <div className="videos-tab">
                    <button className="add-button" onClick={addVieosOnClick}>
                        Add {ADD_VIDEOS_NUM} videos
                    </button>
                    {
                        addVideosButtonPressed && 
                        <Spinner className={"add-button-spinner"}/>
                    }
                    <div style={{display:"inline"}}>
                        Choose option:
                    </div>
                    <label className="radiobox">
                        <span className="radiobox-value">
                        <input type="checkbox"  name="videoRadioGroup" value={VideoOptions.BY_ID}/>
                        Id:
                        </span>
                        <input id="input" className="value-input" type="text" placeholder="Id..."/>
                    </label>
                    <label className="radiobox">
                           <span className="radiobox-value">
                           <input type="checkbox" name="videoRadioGroup" value={VideoOptions.BY_TITLE}/>
                            Title:
                           </span>
                            <input id="input" className="value-input" type="text" placeholder="Title..."/>
                    </label>
                    <label className="radiobox">
                        <span className="radiobox-value">
                        <input type="checkbox" name="videoRadioGroup" value={VideoOptions.BY_LIKES}/>
                        Likes:
                        </span>
                       <span>
                       <input id="input-start" className="input-start" type="text" placeholder="From:"/>
                        <input id="input-end" className="input-end" type="text" placeholder="To..."/>
                       </span>
                    </label>
                    <label className="radiobox">
                        <span className="radiobox-value">
                        <input type="checkbox" name="videoRadioGroup" value={VideoOptions.BY_VIEWS}/>
                        Views:
                        </span>
                        <span className="radiobox-value">
                        <input id="input-start" className="input-start" type="text" placeholder="From..."/>
                        <input id="input-end" className="input-end" type="text" placeholder="To..."/>
                        </span>
                    </label>
                    <button className="admin-search-button" onClick={() => getInputValues()}>
                        <img className="admin-search-icon" src="tool-icons/search.svg"/>
                    </button>
                    {
                        isContentLoading ?
                        <Spinner/> :
                        videos === null || videos?.length == 0 ?
                        <NotFound/> :
                        <div className="page-grid">
                        {
                            videos?.map(video =>
                                <VideoBox video={video}/>
                            )
                        }
                    </div>
                    }
                    
                </div>
            }
        </div>
    );
}

export default Admin;