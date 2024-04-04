import Video from "./Video";
import {SearchOption} from "./SearchOption";
import { LOCAL_STORAGE_USER } from "../utils/Consts";
import { Authorities } from "../utils/Authorities";

export interface NewUser{
    email:string;
    username:string;
    password:string;
    picture:File;
}


export class User{

    private _id: number;
    private _username: string;
    private _picture: string;
    private _subscribers: string;
    private _videos:Video[];
    private _searchHistory: SearchOption[];
    private _authorities:string[];

    private _isAdmin:boolean;


    constructor(id: number, username: string, picture: string, subscribers: string, videos:Video[], searchHistory: SearchOption[], authorities:string) {
        this._id = id;
        this._searchHistory = searchHistory;
        this._username = username;
        this._picture = picture;
        this._videos = videos;
        this._subscribers = subscribers;
        this._authorities = authorities.split(",");
        this._isAdmin = this.authorities.find((value) => value === Authorities.ADMIN) !== undefined;
    }

    static newUserJSON(user: NewUser){
        return JSON.stringify({
            email:user.email,
            username:user.username,
            password:user.password
        })
    }


    static toUser(userJSON: any){
         let searchHistory: SearchOption[]  = [];
        if(userJSON.searchHistory !== undefined){
            searchHistory = userJSON.searchHistory.map((searchOption: string) => new SearchOption(searchOption));
        }
        const user = new User(userJSON.id, userJSON.username, userJSON.picture, userJSON.subscribers, userJSON.userVideos, searchHistory, userJSON.authorities);
        user.isAdmin = user._authorities.includes("ADMIN");
        return user;
    }

    

    get videos(): Video[] {
        return this._videos;
    }

    set videos(value: Video[]) {
        this._videos = value;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get picture() {
        return this._picture;
    }

    set picture(value) {
        this._picture = value;
    }

    get subscribers() {
        return this._subscribers;
    }

    set subscribers(value) {
        this._subscribers = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get searchHistory() {
        return this._searchHistory;
    }

    set searchHistory(value) {
        this._searchHistory = value;
    }

    get authorities(){
        return this._authorities;
    }

    set authorities(value){
        this._authorities = value;
    }

    get isAdmin(){
        return this._isAdmin;
    }

    set isAdmin(isAdmin:boolean){
        this._isAdmin =isAdmin;
    }

}