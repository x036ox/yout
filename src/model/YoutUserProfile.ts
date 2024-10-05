import { UserProfile } from "oidc-client-ts";
import Video from "./Video";

interface YoutUserArgs{
    id: string,
    subscribers:number,
    username:string,
    isAdmin:boolean,
    email:string,
    picture:string,
    userVideos:Video[] | undefined
}

export class YoutUserProfile{
    private _id: string;
    private _subscribers:number | undefined;
    private _isAdmin:boolean;
    private _picture: string;
    private _videos: Video[] | undefined;
    private _username: string;
    private _email: string;
    

    constructor(args:YoutUserArgs){
        this._id = args.id;
        this._subscribers = args.subscribers;
        this._isAdmin = args.isAdmin;
        this._email = args.email;
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

    public get email(){
        return this._email;
    }

    public set email(value: string){
        this._email = value;
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

    get isAdmin(): boolean{
        return this._isAdmin;
    }
}