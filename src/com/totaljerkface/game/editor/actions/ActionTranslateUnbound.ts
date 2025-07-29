import Action from "@/com/totaljerkface/game/editor/actions/Action";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";

@boundClass
export default class ActionTranslateUnbound extends Action {
    private _startPoint: Point;
    private _endPoint: Point;

    constructor(param1: RefSprite, param2: Point, param3: Point = null) {
        super(param1);
        this._startPoint = param2;
        if (param3) {
            this._endPoint = param3;
        }
    }

    public override undo() {
        trace("TRANSLATE UNBOUND UNDO " + this.refSprite.name);
        if (!this._endPoint) {
            this.setEndPoint();
        }
        this.refSprite.xUnbound = this._startPoint.x;
        this.refSprite.yUnbound = this._startPoint.y;
    }

    public override redo() {
        trace("TRANSLATE UNBOUND REDO " + this.refSprite.name);
        trace("sp + " + this._startPoint);
        trace("ep + " + this._endPoint);
        this.refSprite.xUnbound = this._endPoint.x;
        this.refSprite.yUnbound = this._endPoint.y;
    }

    public set endPoint(param1: Point) {
        this._endPoint = param1;
    }

    public setEndPoint() {
        this._endPoint = new Point(this.refSprite.x, this.refSprite.y);
        trace("SET END POINT " + this._endPoint);
    }
}