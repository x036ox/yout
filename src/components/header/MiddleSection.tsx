import React, { RefObject, useRef } from "react";
import Searchbar from "./Searchbar";
import {useInput} from "../../hooks/useInput";
import {sendSearchOption} from "../../http-requests/PostRequests";
import {User} from "../../model/User";
import {SearchOption} from "../../model/SearchOption";
import {MAX_SEARCHES} from "../../utils/Consts";
import { useNavigate } from "react-router-dom";
import { VIDEO_SEARCH_ROUTE } from "../../utils/RoutesConsts";
import { Q_PARAM_SEARCH_QUERRY } from "../../utils/SearchQuerryParamConsts";

interface MiddleSectionProps{
    mainUser:User | null;
}

function addSearchOption(mainUser:User, searchbarValue: string){
    for(let i = 0; i < mainUser.searchHistory.length; i++){
        if(mainUser.searchHistory[i].value === searchbarValue) return null;
    }

    if(mainUser.searchHistory.length > MAX_SEARCHES){
        mainUser.searchHistory.pop();
    }
    mainUser.searchHistory.unshift(new SearchOption(searchbarValue));

    sendSearchOption(searchbarValue);
}

const MiddleSection:React.FC<MiddleSectionProps> = ({mainUser}) =>{
    const searchbar = useInput("");
    const navigate = useNavigate();
    const searchButton = useRef<HTMLButtonElement | null>(null)

    const onKeyDown = (event:any) =>{
        if(event.key === "Enter" && searchButton){
            searchButton.current?.click();
        }
    }

    return(
        <div className="middle-section">
            <Searchbar searchbar={searchbar} searches = {mainUser !== null ? mainUser.searchHistory : []} mainUser = {mainUser} onKeyDown={onKeyDown}/>
            <button ref={searchButton} className={"search-button"} onClick = {
                () =>{
                    if(searchbar.value.length > 0){
                        navigate(VIDEO_SEARCH_ROUTE + Q_PARAM_SEARCH_QUERRY + searchbar.value);
                    } 
                    if(mainUser){
                        addSearchOption(mainUser, searchbar.value);
                    }
                        
                }}>
                <img className={"search-icon"} src={"/tool-icons/search.svg"}/>
                <div className={"tooltip"}>Search</div>
            </button>
            <button className={"voice-search-button"}>
                <img className={"voice-search-icon"} src={"/tool-icons/voice-search-icon.svg"}/>
                <div className={"tooltip"}>Voice-search</div>
            </button>
        </div>
    );
}

export default MiddleSection;