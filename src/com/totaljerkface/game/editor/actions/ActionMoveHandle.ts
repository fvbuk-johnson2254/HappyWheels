import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import BezierVert from "@/com/totaljerkface/game/editor/vertedit/BezierVert";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";

@boundClass
export default class ActionMoveHandle extends Action {
    private _vertIndex: number;
    private _edgeShape: EdgeShape;
    private _startPoint1: Point;
    private _startPoint2: Point;
    private _endPoint1: Point;
    private _endPoint2: Point;

    constructor(
        param1: number,
        param2: EdgeShape,
        param3: Point = null,
        param4: Point = null,
    ) {
        super(null);
        this._vertIndex = param1;
        this._edgeShape = param2;
        var _loc5_: BezierVert = this._edgeShape.getVertAt(
            this._vertIndex,
        ) as BezierVert;
        this._startPoint1 = !!param3
            ? param3
            : new Point(_loc5_.handle1.x, _loc5_.handle1.y);
        this._startPoint2 = !!param4
            ? param4
            : new Point(_loc5_.handle2.x, _loc5_.handle2.y);
    }

    public override undo() {
        trace("MOVE HANDLE UNDO " + this._vertIndex);
        var _loc1_: BezierVert = this._edgeShape.getVertAt(
            this._vertIndex,
        ) as BezierVert;
        if (!this._endPoint1) {
            this._endPoint1 = new Point(_loc1_.handle1.x, _loc1_.handle1.y);
        }
        if (!this._endPoint2) {
            this._endPoint2 = new Point(_loc1_.handle2.x, _loc1_.handle2.y);
        }
        _loc1_.handle1.Set(this._startPoint1.x, this._startPoint1.y);
        _loc1_.handle2.Set(this._startPoint2.x, this._startPoint2.y);
        var _loc2_: b2Vec2 = this._edgeShape.vertVector[0];
        this._edgeShape.drawEditMode(_loc2_, this._edgeShape.completeFill);
    }

    public override redo() {
        trace("MOVE HANDLE REDO " + this._vertIndex);
        var _loc1_: BezierVert = this._edgeShape.getVertAt(
            this._vertIndex,
        ) as BezierVert;
        _loc1_.handle1.Set(this._endPoint1.x, this._endPoint1.y);
        _loc1_.handle2.Set(this._endPoint2.x, this._endPoint2.y);
        var _loc2_: b2Vec2 = this._edgeShape.vertVector[0];
        this._edgeShape.drawEditMode(_loc2_, this._edgeShape.completeFill);
    }
}