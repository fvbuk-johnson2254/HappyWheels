import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class TargetActionTrigger extends LevelItem {
    protected _refSprite: RefSprite;
    protected _sourceTrigger: Trigger;
    protected _receivingTrigger: Trigger;
    protected _targetAction: string;
    protected _properties: any[];
    protected _instant: boolean;
    protected counter: number = 0;

    constructor(
        param1: RefSprite,
        param2: Trigger,
        param3: Trigger,
        param4: string,
        param5: any[],
    ) {
        super();
        this._refSprite = param1;
        this._sourceTrigger = param2;
        this._receivingTrigger = param3;
        this._targetAction = param4;
        this._instant = true;
        this._properties = param5;
    }

    public override singleAction() {
        switch (this._targetAction) {
            case "activate trigger":
                this._receivingTrigger.activateByTrigger();
                break;
            case "disable":
                this._receivingTrigger.disabled = true;
                break;
            case "enable":
                this._receivingTrigger.disabled = false;
        }
    }

    public override actions() { }

    public get targetAction(): string {
        return this._targetAction;
    }

    public get instant(): boolean {
        return this._instant;
    }
}