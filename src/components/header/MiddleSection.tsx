import React, { RefObject, useEffect, useRef, useState } from "react";
import Searchbar from "./Searchbar";
import {useInput} from "../../hooks/useInput";
import {sendSearchOption} from "../../http-requests/PostRequests";
import {SearchOption} from "../../model/SearchOption";
import {MAX_SEARCHES} from "../../utils/Consts";
import { useNavigate } from "react-router-dom";
import { VIDEO_SEARCH_ROUTE } from "../../utils/RoutesConsts";
import { Q_PARAM_SEARCH_QUERRY } from "../../utils/SearchQuerryParamConsts";
import { useAuth } from "react-oidc-context";
import { getUserSearchHistory } from "../../http-requests/GetRequests";


const MiddleSection:React.FC = () =>{
    const searchbar = useInput("");
    const navigate = useNavigate();
    const searchButton = useRef<HTMLButtonElement | null>(null)
    const auth = useAuth();
    const [searchHistory, setSearchHistory] = useState<Array<SearchOption>>([]);

    const onKeyDown = (event:any) =>{
        if(event.key === "Enter" && searchButton){
            searchButton.current?.click();
        }
    }

    function addSearchOption(searchbarValue: string){
        for(let i = 0; i < searchHistory.length; i++){
            if(searchHistory[i].value === searchbarValue) return null;
        }
    
        if(searchHistory.length > MAX_SEARCHES){
            searchHistory.pop();
        }
        searchHistory.unshift(new SearchOption(searchbarValue));
    
        sendSearchOption(searchbarValue);
    }

    return(
        <div className="middle-section">
            <Searchbar searchbar={searchbar} searchHistory={searchHistory} onKeyDown={onKeyDown}/>
            <button ref={searchButton} className={"search-button"} onClick = {
                () =>{
                    if(searchbar.value.length > 0){
                        navigate(VIDEO_SEARCH_ROUTE + Q_PARAM_SEARCH_QUERRY + searchbar.value);
                    } 
                    if(auth.user){
                        addSearchOption(searchbar.value);
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