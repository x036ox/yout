import { makeAutoObservable } from "mobx"
import {User} from "../model/User";
import { LOCAL_STORAGE_ACCESS_TOKEN, LOCAL_STORAGE_USER } from "../utils/Consts";
import { sendLoginUser } from "../http-requests/PostRequests";
import { logout } from "../http-requests/DeleteRequests";



export default class UserService {

    private _mainUser:User | null;
    private _isAuth:boolean | undefined;

    constructor(){
        this._mainUser = null;
        this._isAuth = undefined;
        makeAutoObservable(this);
    }

    login(user:User){
        this._mainUser = user;
        this._isAuth = true;
    }


    logout(){
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
        this._mainUser = null;
        this.isAuth = false;
        logout();
    }


    get mainUser(): User | null {
        return this._mainUser;
    }

    set mainUser(value: User | null) {
        this._mainUser = value;
        if(value !== null){
            this._isAuth = true;
        }
    }


    get isAuth(): boolean | undefined {
        return this._isAuth;
    }

    set isAuth(value: boolean | undefined) {
        this._isAuth = value;
    }

}