import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import ReplayDataObject from "@/com/totaljerkface/game/menus/ReplayDataObject";
import { boundClass } from 'autobind-decorator';
import Event from "flash/events/Event";

@boundClass
export default class NavigationEvent extends Event {
    public static MAIN_MENU: string;
    public static EDITOR: string = "editor";
    public static SESSION: string = "session";
    public static REPLAY_BROWSER: string = "replaybrowser";
    public static LEVEL_BROWSER: string = "levelbrowser";
    public static PREVIOUS_MENU: string = "previousmenu";
    public static CUSTOMIZE_CONTROLS: string = "customizecontrols";
    private _extra;
    private _levelDataObject: LevelDataObject;
    private _replayDataObject: ReplayDataObject;

    constructor(
        param1: string,
        param2: LevelDataObject = null,
        param3: ReplayDataObject = null,
        param4 = null,
    ) {
        super(param1);
        this._levelDataObject = param2;
        this._replayDataObject = param3;
        this._extra = param4;
    }

    public get levelDataObject(): LevelDataObject {
        return this._levelDataObject;
    }

    public get replayDataObject(): ReplayDataObject {
        return this._replayDataObject;
    }

    public get extra() {
        return this._extra;
    }

    public override clone(): Event {
        return new NavigationEvent(
            this.type,
            this._levelDataObject,
            this._replayDataObject,
            this._extra,
        );
    }
}