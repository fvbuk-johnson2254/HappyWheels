import { boundClass } from 'autobind-decorator';
import Event from "flash/events/Event";

@boundClass
export default class BrowserEvent extends Event {
    public static USER: string;
    public static FLAG: string = "flag";
    public static ADD_TO_FAVORITES: string = "add to favorites";
    public static REMOVE_FROM_FAVORITES: string = "remove from favorites";
    private _extra;

    constructor(param1: string, param2 = null) {
        super(param1);
        this._extra = param2;
    }

    public get extra() {
        return this._extra;
    }

    public override clone(): Event {
        return new BrowserEvent(this.type, this._extra);
    }
}