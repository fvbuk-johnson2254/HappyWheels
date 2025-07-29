import Action from "@/com/totaljerkface/game/editor/actions/Action";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionTriggerRemove extends Action {
    private _trigger: RefTrigger;
    private _targetIndex: number;

    constructor(param1: RefTrigger, param2: RefSprite, param3: number) {
        super(param2);
        this._trigger = param1;
        this._targetIndex = param3;
    }

    public override undo() {
        trace(
            "TRIGGER REMOVE UNDO " +
            this.refSprite.name +
            " " +
            this._targetIndex,
        );
        this._trigger.targets.splice(this._targetIndex, 0, this.refSprite);
        this._trigger.addMoveListener(this.refSprite);
        this.refSprite.addTrigger(this._trigger);
        this._trigger.drawArms();
    }

    public override redo() {
        trace("TRIGGER REMOVE REDO " + this.refSprite.name);
        this._trigger.targets.splice(this._targetIndex, 1);
        this._trigger.removeMoveListener(this.refSprite);
        this.refSprite.removeTrigger(this._trigger);
        this._trigger.drawArms();
    }
}