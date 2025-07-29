import Action from "@/com/totaljerkface/game/editor/actions/Action";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";

@boundClass
export default class ActionProperty extends Action {
    private _startVal;
    private _endVal;
    private _startPoint: Point;
    private _endPoint: Point;
    private _property: string;

    constructor(
        param1: RefSprite,
        param2: string,
        param3,
        param4,
        param5: Point = null,
        param6: Point = null,
    ) {
        super(param1);
        this._property = param2;
        this._startVal = param3;
        this._endVal = param4;
        this._startPoint = param5;
        this._endPoint = param6;
    }

    public override undo() {
        trace("PROPERTY UNDO " + this._property + " " + this.refSprite.name);
        this.refSprite[this._property] = this._startVal;
        if (this._startPoint) {
            this.refSprite.x = this._startPoint.x;
            this.refSprite.y = this._startPoint.y;
        }
    }

    public override redo() {
        trace("PROPERTY REDO " + this._property + " " + this.refSprite.name);
        this.refSprite[this._property] = this._endVal;
        if (this._endPoint) {
            this.refSprite.x = this._endPoint.x;
            this.refSprite.y = this._endPoint.y;
        }
    }

    public set endVal(param1) {
        this._endVal = param1;
    }

    public setEndVal() {
        this._endVal = this.refSprite[this._property];
    }
}