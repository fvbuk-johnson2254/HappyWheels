import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionScale extends Action {
    private _startScaleX: number;
    private _startScaleY: number;
    private _endScaleX: number;
    private _endScaleY: number;

    constructor(param1: RefSprite, param2: number, param3: number) {
        super(param1);
        this._startScaleX = param2;
        this._startScaleY = param3;
    }

    public override undo() {
        trace("SCALE UNDO " + this.refSprite.name);
        if (!this._endScaleX) {
            this.setEndScale();
        }
        this.refSprite.scaleX = this._startScaleX;
        this.refSprite.scaleY = this._startScaleY;
    }

    public override redo() {
        trace("SCALE REDO " + this.refSprite.name);
        this.refSprite.scaleX = this._endScaleX;
        this.refSprite.scaleY = this._endScaleY;
    }

    public set endScaleX(param1: number) {
        this._endScaleX = param1;
    }

    public set endScaleY(param1: number) {
        this._endScaleY = param1;
    }

    public setEndScale() {
        this._endScaleX = this.refSprite.scaleX;
        this._endScaleY = this.refSprite.scaleY;
    }
}