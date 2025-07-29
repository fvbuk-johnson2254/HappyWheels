import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import Vert from "@/com/totaljerkface/game/editor/vertedit/Vert";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";

@boundClass
export default class ActionMoveVert extends Action {
    private _vertIndex: number;
    private _edgeShape: EdgeShape;
    private _startPoint: Point;
    private _endPoint: Point;

    constructor(
        param1: number,
        param2: EdgeShape,
        param3: Point,
        param4: Point = null,
    ) {
        super(null);
        this._vertIndex = param1;
        this._edgeShape = param2;
        this._startPoint = param3;
        if (param4) {
            this._endPoint = param4;
        }
    }

    public override undo() {
        var _loc1_: Vert = null;
        trace("MOVE VERT UNDO " + this._vertIndex);
        _loc1_ = this._edgeShape.getVertAt(this._vertIndex);
        if (!this._endPoint) {
            this.setEndPoint();
        }
        _loc1_.x = this._startPoint.x;
        _loc1_.y = this._startPoint.y;
        var _loc2_: b2Vec2 = this._edgeShape.vertVector[0];
        this._edgeShape.drawEditMode(_loc2_, this._edgeShape.completeFill);
    }

    public override redo() {
        trace("MOVE VERT REDO " + this._vertIndex);
        trace("sp + " + this._startPoint);
        trace("ep + " + this._endPoint);
        var _loc1_: Vert = this._edgeShape.getVertAt(this._vertIndex);
        _loc1_.x = this._endPoint.x;
        _loc1_.y = this._endPoint.y;
        var _loc2_: b2Vec2 = this._edgeShape.vertVector[0];
        this._edgeShape.drawEditMode(_loc2_, this._edgeShape.completeFill);
    }

    public set endPoint(param1: Point) {
        this._endPoint = param1;
    }

    public setEndPoint() {
        var _loc1_: Vert = this._edgeShape.getVertAt(this._vertIndex);
        this._endPoint = new Point(_loc1_.x, _loc1_.y);
        trace("SET END POINT " + this._endPoint);
    }
}