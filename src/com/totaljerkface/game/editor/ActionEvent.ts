import Action from "@/com/totaljerkface/game/editor/actions/Action";
import { boundClass } from 'autobind-decorator';
import Event from "flash/events/Event";

@boundClass
export default class ActionEvent extends Event {
    public static GENERIC: string;
    public static TEMP: string = "temp";
    public static SCALE: string = "scale";
    public static TRANSLATE: string = "translate";
    public static ROTATE: string = "rotate";
    public static DEPTH: string = "depth";
    public static VERT: string = "vert";
    private _action: Action;

    constructor(
        param1: string,
        param2: Action,
        param3: boolean = false,
        param4: boolean = false,
    ) {
        super(param1, param3, param4);
        this._action = param2;
    }

    public get action(): Action {
        return this._action;
    }
}