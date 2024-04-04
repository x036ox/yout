import "../styles/Filter.css"
import {ChangeEvent, ChangeEventHandler, useState} from "react";
import React from "react";



export enum Sort {
    NONE = 0,
    BY_VIEWS_FROM_MOST = 1,
    BY_VIEWS_FROM_LEAST = 2,
    BY_UPLOAD_DATE_FROM_OLDEST = 3,
    BY_UPLOAD_DATE_FROM_NEWEST = 4,
    BY_DURATION_FROM_MOST = 5,
    BY_DURATION_FROM_LEAST = 6
}

interface fBarProps{
    onChange: ChangeEventHandler;
}


export const FilterBar: React.FC<fBarProps> = ({onChange}) =>{
    const defaultOption = Sort.BY_UPLOAD_DATE_FROM_OLDEST;

    return(
        <div>
            <div style={{display:"inline"}}>
                Sort by:
            </div>
            <select className="option-list" onChange={onChange}>\
                <option value={Sort.NONE}>None</option>
                <option value={Sort.BY_VIEWS_FROM_MOST}>views(descending)</option>
                <option value={Sort.BY_VIEWS_FROM_LEAST}>views(ascending)</option>
                <option value={Sort.BY_UPLOAD_DATE_FROM_NEWEST}>upload date(new ones first)</option>
                <option value={Sort.BY_UPLOAD_DATE_FROM_OLDEST}>upload date(old ones first)</option>
                <option value={Sort.BY_DURATION_FROM_MOST}>by duration(more first)</option>
                <option value={Sort.BY_DURATION_FROM_LEAST}>by duration(less first)</option>
            </select>
        </div>
    )
}

export default FilterBar;