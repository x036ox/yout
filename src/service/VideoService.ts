import Video from "../model/Video";
import {makeAutoObservable} from "mobx";


export default class VideoService {
    private _videos:Video[];

    constructor(){
        this._videos = []
        makeAutoObservable(this);
    }

    addVideo(video:Video){
        this._videos.push(video);
    }

    setVideos(videos:Video[]){
        this._videos = videos;
    }

    get allVideos(){
        return this._videos;
    }
}