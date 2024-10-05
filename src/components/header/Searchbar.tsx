import React, {useEffect, useState} from "react";
import {SearchOption} from "../../model/SearchOption";
import SearchHistory from "./SearchHistory";
import { YoutUserProfile } from "../../model/YoutUserProfile";
import { getUserSearchHistory } from "../../http-requests/GetRequests";
import { useKeycloak } from "../../KeycloakPrivoder";

interface SearchbarProps{
    searchbar:any;
    searchHistory:SearchOption[];
    setSearchHistory:(searchHistory:any) => any;
    onKeyDown:Function;
}

const Searchbar:React.FC<SearchbarProps> = ({searchbar, searchHistory, setSearchHistory, onKeyDown}) =>{
    const keycloak = useKeycloak();
    const [searchHistoryVisible, setSearchHistoryVisible] = useState<boolean>(false);
    const [wasOpened, setWasOpened] = useState<boolean>(false);
    let rootClasses = "search-history";

    useEffect(() =>{
        if(keycloak.subject && wasOpened && searchHistory.length === 0){
            getUserSearchHistory(keycloak.subject).then(search => {setSearchHistory((prev: any) => [...prev, ...search])}) 
        }
    }, [wasOpened])

    if(searchHistoryVisible)
        rootClasses += " active";

    return(
        <div className={"searchbar-div"}>
            <input className="searchbar" {...searchbar} onFocus={() => {setSearchHistoryVisible(true); setWasOpened(true)}} onBlur={() => setSearchHistoryVisible(false)}  placeholder="Search" type="Text" onKeyDown={onKeyDown}/>
            {
               searchHistory !== undefined  && searchHistory.length > 0 &&
                <SearchHistory className={rootClasses} searchHistory={searchHistory} searchbar={searchbar}/>
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