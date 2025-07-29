import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import { boundClass } from 'autobind-decorator';
import Event from "flash/events/Event";

@boundClass
export default class ValueEvent extends Event {
    public static VALUE_CHANGE: string;
    public static ADD_INPUT: string = "addinput";
    public static REMOVE_INPUT: string = "removeinput";
    public value;
    public inputObject: InputObject;
    private _resetInputs: boolean;

    constructor(
        param1: string,
        param2: InputObject,
        param3,
        param4: boolean = true,
    ) {
        super(param1);
        this.inputObject = param2;
        this.value = param3;
        this._resetInputs = param4;
    }

    public override clone(): Event {
        return new ValueEvent(this.type, this.inputObject, this.value);
    }

    public get resetInputs(): boolean {
        return this._resetInputs;
    }
}