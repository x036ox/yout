import {makeAutoObservable} from "mobx";

export interface NewVideo{
    title:string;
    description:string;
    thumbnail:File;
    category:string | undefined;
    video:File;
}


export default class Video {
    private _id: string;
    private _title: string;
    private _duration: string;
    private _thumbnail:string;
    private _views: string;
    private _likes:number;
    private _uploadDate: string;
    private _description: string;
    private _category: string;
    private _creatorPicture: string;
    private _channelId:string;
    private _creatorName: string | undefined;
    private _deleted: boolean;


    constructor(id: string, title: string, duration:string,thumbnail:string, views:string, likes:number, uploadDate:string, description:string, channelId:string, creatorPicture:string, creatorName:string, category:string) {
        this._id = id;
        this._title = title;
        this._duration = duration;
        this._thumbnail = thumbnail;
        this._views = views;
        this._likes = likes;
        this._uploadDate = uploadDate;
        this._description = description;
        this._creatorName = creatorName;
        this._creatorPicture = creatorPicture;
        this._channelId = channelId;
        this._category = category;


        this._deleted = false;
        makeAutoObservable(this);
    }


    static toJSON(video: Video):string {
        const obj = {
            title:video.title,
            duration:video.duration,
            thumbnail:video.thumbnail,
            description:video.description
        }
        return JSON.stringify(obj);
    }

    static toVideo(videoJSON:any):Video{
        return new Video(videoJSON.id, videoJSON.title, videoJSON.duration, videoJSON.thumbnail, videoJSON.views, videoJSON.likes, videoJSON.uploadDate, videoJSON.description , videoJSON.channelId, videoJSON.creatorPicture,  videoJSON.creatorName, videoJSON.category)
    }


    get likes() {
        return this._likes;
    }

    set likes(value) {
        this._likes = value;
    }

    get category() {
        return this._category;
    }

    set category(value) {
        this._category = value;
    }

    get deleted() {
        return this._deleted;
    }

    set deleted(value) {
        this._deleted = value;
    }

    get thumbnail() {
        return this._thumbnail;
    }

    set thumbnail(value) {
        this._thumbnail = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }

    get views() {
        return this._views;
    }

    set views(value) {
        this._views = value;
    }

    get uploadDate() {
        return this._uploadDate;
    }

    set uploadDate(value) {
        this._uploadDate = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }


    get channelId(): string {
        return this._channelId;
    }

    set channelId(value: string) {
        this._channelId = value;
    }

    get creatorPicture() {
        return this._creatorPicture;
    }

    set creatorPicture(value) {
        this._creatorPicture = value;
    }

    get creatorName() {
        return this._creatorName;
    }

    set creatorName(value) {
        this._creatorName = value;
    }
}