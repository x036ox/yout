import React, { useEffect, useState } from "react";
import {deleteSearchOption} from "../../http-requests/DeleteRequests";
import {observer} from "mobx-react";
import "../../styles/SearchHistory.css"
import { VIDEO_SEARCH_ROUTE } from "../../utils/RoutesConsts";
import { Q_PARAM_SEARCH_QUERRY } from "../../utils/SearchQuerryParamConsts";
import { useNavigate } from "react-router-dom";
import { YoutUserProfile } from "../../model/YoutUserProfile";
import { getUserSearchHistory } from "../../http-requests/GetRequests";
import { SearchOption } from "../../model/SearchOption";
import { useKeycloak } from "../../KeycloakPrivoder";

interface SearchHistoryProps{
    searchbar:any;
    searchHistory:SearchOption[]
    className:string;
}

const SearchHistory :React.FC<SearchHistoryProps>= observer(({searchbar,searchHistory, className}) =>{
    const navigate = useNavigate();
    const keycloak = useKeycloak();
    const [searches, setSearches] = useState<SearchOption[]>(searchHistory);

    useEffect(() => {
        setSearches(searchHistory);
      }, [searchHistory])

    if(!keycloak.authenticated) return null;    

    return(
        <div className={className}>
            {
                searches.map((search, index) =>{
                    return(
                        <div key={new Date().getDate() / index + 1 }  >
                            {
                                !search.deleted ?
                                    <div className={"search-option"}>
                                        <img className={"search-icon"} src={"/tool-icons/search.svg"}/>
                                        <button className="search-option-button" onMouseDown={(e) => e.preventDefault()} onMouseUp={(e) => {
                                            e.preventDefault();
                                            searchbar.setValue(search.value);
                                            navigate(VIDEO_SEARCH_ROUTE + Q_PARAM_SEARCH_QUERRY + search.value);
                                            searchbar.ref.current.blur();}}>
                                                {search.value}
                                        </button>
                                        <button   className="delete-search-option-button"
                                                  onMouseDown={(e) =>
                                                  {
                                                      e.preventDefault();
                                                      deleteSearchOption(search.value)
                                                      searchHistory.slice(searchHistory.indexOf(search), 1)
                                                      search.deleted = true;
                                                  }
                                                  }>
                                            Delete
                                        </button>
                                    </div>
                                    :
                                    <div className={"search-option"} >
                                        <div className={"deleted"}>Deleted</div>
                                    </div>

                            }
                        </div>
                    )})
            }

        </div>
    );
});

export default SearchHistory;