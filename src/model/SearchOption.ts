import {makeAutoObservable} from "mobx";


export class SearchOption {

    private _value : string;
    private _deleted: boolean;


    constructor(value: string) {
        this._value = value;
        this._deleted = false;
        makeAutoObservable(this);
    }


    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }

    get deleted(): boolean {
        return this._deleted;
    }

    set deleted(value: boolean) {
        this._deleted = value;
    }
}