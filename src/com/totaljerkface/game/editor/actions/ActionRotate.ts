import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionRotate extends Action {
    private _startAngle: number;
    private _endAngle: number;

    constructor(param1: RefSprite, param2: number) {
        super(param1);
        this._startAngle = param2;
    }

    public override undo() {
        trace("ROTATE UNDO " + this.refSprite.name);
        if (!this._endAngle) {
            this.setEndAngle();
        }
        this.refSprite.angle = this._startAngle;
    }

    public override redo() {
        trace("ROTATE REDO " + this.refSprite.name);
        this.refSprite.angle = this._endAngle;
    }

    public set endAngle(param1: number) {
        this._endAngle = param1;
    }

    public setEndAngle() {
        this._endAngle = this.refSprite.angle;
    }
}