import { boundClass } from 'autobind-decorator';
import Event from "flash/events/Event";

@boundClass
export default class CanvasEvent extends Event {
    public static ART: string;
    public static SHAPE: string = "shape";
    private _value: number;

    constructor(param1: string, param2: number) {
        super(param1, true);
        this._value = param2;
    }

    public get value() {
        return this._value;
    }

    public override clone(): Event {
        return new CanvasEvent(this.type, this._value);
    }
}