import { UserProfile } from "oidc-client-ts";
import Video from "./Video";
import { checkIsUserAdmin, parseAuthorities } from "../utils/AuthorityUtils";

interface YoutUserArgs{
    id: string,
    authorities: string,
    subscribers:number,
    username:string
    picture:string,
    userVideos:Video[] | undefined
}

export class YoutUserProfile{
    private _id: string;
    private _subscribers:number | undefined;
    private _authorities:string[];
    private _isAdmin:boolean;
    private _picture: string;
    private _videos: Video[] | undefined;
    private _username: string;
    

    constructor(args:YoutUserArgs){
        this._id = args.id;
        this._subscribers = args.subscribers;
        this._authorities = parseAuthorities(args.authorities);
        this._isAdmin = checkIsUserAdmin(this.authorities);
        this._picture = args.picture;
        this._username = args.username;
    }

    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }

    public get picture(): string {
        return this._picture;
    }
    public set picture(value: string) {
        this._picture = value;
    }

    public get videos(): Video[] | undefined {
        return this._videos;
    }
    public set videos(value: Video[] | undefined) {
        this._videos = value;
    }

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

    set subscribers(subscribers:number|undefined){
        this._subscribers = subscribers;
    }

    get subscribers() :number | undefined{
        return this._subscribers;
    }

    get authorities(): string[]{
        return this._authorities;
    }

    get isAdmin(): boolean{
        return this._isAdmin;
    }
}