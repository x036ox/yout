import React, {useEffect, useState} from "react";
import {SearchOption} from "../../model/SearchOption";
import SearchHistory from "./SearchHistory";
import { YoutUserProfile } from "../../model/YoutUserProfile";
import { getUserSearchHistory } from "../../http-requests/GetRequests";
import { useAuth } from "react-oidc-context";

interface SearchbarProps{
    searchbar:any;
    searchHistory:SearchOption[];
    onKeyDown:Function;
}

const Searchbar:React.FC<SearchbarProps> = ({searchbar, searchHistory, onKeyDown}) =>{
    const auth = useAuth();
    const [searchHistoryVisible, setSearchHistoryVisible] = useState<boolean>(false);
    const [wasOpened, setWasOpened] = useState<boolean>(false);
    const [searches, setSearches] = useState<SearchOption[] | undefined>();
    let rootClasses = "search-history";

    useEffect(() =>{
        if(auth.user && wasOpened){
            getUserSearchHistory(auth.user?.profile.sub).then(search => {setSearches(search); searchHistory = search}) 
            console.log("searches");
            console.log(searches);
        }
    }, [wasOpened])

    if(searchHistoryVisible)
        rootClasses += " active";

    return(
        <div className={"searchbar-div"}>
            <input className="searchbar" {...searchbar} onFocus={() => {setSearchHistoryVisible(true); setWasOpened(true)}} onBlur={() => setSearchHistoryVisible(false)}  placeholder="Search" type="Text" onKeyDown={onKeyDown}/>
            {
                searches !== undefined  && searches.length > 0 &&
                <SearchHistory className={rootClasses} searchHistory={searches} searchbar={searchbar}/>
            }
            {
                searchbar.value !== "" &&
                <button className="text-clear-button" onClick={() => searchbar.setValue("")}>
                    <img className="text-clear-icon" src={"tool-icons/cross.svg"} />
                </button>
            }
        </div>
    )
}

export default Searchbar;