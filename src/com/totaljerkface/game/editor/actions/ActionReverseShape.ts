import Action from "@/com/totaljerkface/game/editor/actions/Action";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import { boundClass } from 'autobind-decorator';
import Point from "flash/geom/Point";

@boundClass
export default class ActionReverseShape extends Action {
    private _startPoint: Point;
    private _endPoint: Point;
    private _edgeShape: EdgeShape;

    constructor(param1: EdgeShape, param2: Point = null, param3: Point = null) {
        super(null);
        this._edgeShape = param1;
        this._startPoint = param2;
        this._endPoint = param3;
    }

    public override undo() {
        trace("MIRROR UNDO " + this._edgeShape.name);
        this._edgeShape.reverse();
        if (this._startPoint) {
            this._edgeShape.x = this._startPoint.x;
            this._edgeShape.y = this._startPoint.y;
        }
    }

    public override redo() {
        trace("MIRROR REDO " + this._edgeShape.name);
        this._edgeShape.reverse();
        if (this._endPoint) {
            this._edgeShape.x = this._endPoint.x;
            this._edgeShape.y = this._endPoint.y;
        }
    }
}