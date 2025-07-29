import Settings from "@/com/totaljerkface/game/Settings";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class TargetActionSpecial extends LevelItem {
    protected _refSprite: RefSprite;
    protected _trigger: Trigger;
    protected _levelItem: LevelItem;
    protected _targetAction: string;
    protected _properties: any[];
    protected _instant: boolean;
    protected counter: number = 0;

    constructor(
        param1: RefSprite,
        param2: Trigger,
        param3: LevelItem,
        param4: string,
        param5: any[],
    ) {
        super();
        this._refSprite = param1;
        this._trigger = param2;
        this._levelItem = param3;
        this._targetAction = param4;
        this._instant =
            param4 == "change opacity" || param4 == "slide" ? false : true;
        this._properties = param5;
    }

    public override singleAction() {
        this._levelItem.triggerSingleActivation(
            this._trigger,
            this._targetAction,
            this._properties,
        );
    }

    public override actions() {
        var _loc1_: boolean = this._levelItem.triggerRepeatActivation(
            this._trigger,
            this._targetAction,
            this._properties,
            this.counter,
        );
        if (_loc1_) {
            if (Settings.currentSession.levelVersion > 1.8) {
                this.counter = 0;
            }
            Settings.currentSession.level.removeFromActionsVector(this);
            return;
        }
        this.counter += 1;
    }

    public get targetAction(): string {
        return this._targetAction;
    }

    public get levelItem(): LevelItem {
        return this._levelItem;
    }

    public get instant(): boolean {
        return this._instant;
    }
}