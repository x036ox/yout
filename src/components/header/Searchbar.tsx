import React, {useState} from "react";
import {SearchOption} from "../../model/SearchOption";
import SearchHistory from "./SearchHistory";
import {User} from "../../model/User";

interface SearchbarProps{
    searchbar:any;
    searches:SearchOption[];
    mainUser:User | null;
    onKeyDown:Function;
}

const Searchbar:React.FC<SearchbarProps> = ({searchbar, searches, mainUser, onKeyDown}) =>{
    const [searchHistoryVisible, setSearchHistoryVisible] = useState<boolean>(false);
    let rootClasses = "search-history";
    if(searchHistoryVisible)
        rootClasses += " active";

    return(
        <div className={"searchbar-div"}>
            <input className="searchbar" {...searchbar} onFocus={() => setSearchHistoryVisible(true)} onBlur={() => setSearchHistoryVisible(false)}  placeholder="Search" type="Text" onKeyDown={onKeyDown}/>
            {
                searches !== undefined  && searches.length > 0 &&
                <SearchHistory className={rootClasses} searchbar={searchbar} mainUser = {mainUser}/>
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