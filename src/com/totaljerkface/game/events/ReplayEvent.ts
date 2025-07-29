import { boundClass } from 'autobind-decorator';
import Event from "flash/events/Event";

@boundClass
export default class ReplayEvent extends Event {
    public static ADD_ENTRY: string;
    private _keyString: string;

    constructor(param1: string, param2: string) {
        super(param1);
        this._keyString = param2;
    }

    public get keyString(): string {
        return this._keyString;
    }
}