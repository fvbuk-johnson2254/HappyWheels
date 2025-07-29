import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ArtShape from "@/com/totaljerkface/game/editor/ArtShape";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import BezierVert from "@/com/totaljerkface/game/editor/vertedit/BezierVert";
import Vert from "@/com/totaljerkface/game/editor/vertedit/Vert";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionDeleteVert extends Action {
    private _vertIndex: number;
    private _edgeShape: EdgeShape;
    private posX: number;
    private posY: number;
    private handle1X: number;
    private handle1Y: number;
    private handle2X: number;
    private handle2Y: number;
    private _tool: Tool;

    constructor(param1: number, param2: EdgeShape, param3: Tool = null) {
        super(null);
        this._vertIndex = param1;
        this._edgeShape = param2;
        this._tool = param3;
        this.setPosition();
    }

    public override undo() {
        var _loc1_: Vert = null;
        var _loc2_: b2Vec2 = null;
        trace("DELETE VERT UNDO " + this._edgeShape.name);
        if (this._edgeShape instanceof ArtShape) {
            _loc1_ = new BezierVert(
                this.posX,
                this.posY,
                this.handle1X,
                this.handle1Y,
                this.handle2X,
                this.handle2Y,
            );
        } else {
            _loc1_ = new Vert(this.posX, this.posY);
        }
        _loc1_.edgeShape = this._edgeShape;
        this._edgeShape.addVert(_loc1_, this._vertIndex);
        if (this._tool) {
            this._tool.remoteButtonPress();
            if (this._edgeShape.numVerts == 1) {
                this._tool.addFrameHandler();
            } else {
                _loc1_ = this._edgeShape.getVertAt(
                    this._edgeShape.numVerts - 2,
                );
                _loc1_.selected = false;
            }
        } else {
            _loc2_ = this._edgeShape.vertVector[0];
            this._edgeShape.drawEditMode(_loc2_, this._edgeShape.completeFill);
        }
    }

    public override redo() {
        var _loc1_: Vert = null;
        var _loc2_: b2Vec2 = null;
        trace("DELETE VERT REDO " + this._edgeShape.name);
        this._edgeShape.removeVert(this._vertIndex);
        if (this._tool) {
            this._tool.remoteButtonPress();
            if (this._edgeShape.numVerts == 0) {
                this._tool.removeFrameHandler();
                this._edgeShape.graphics.clear();
            } else {
                _loc1_ = this._edgeShape.getVertAt(
                    this._edgeShape.numVerts - 1,
                );
                _loc1_.selected = true;
            }
        } else {
            _loc2_ = this._edgeShape.vertVector[0];
            this._edgeShape.drawEditMode(_loc2_, this._edgeShape.completeFill);
        }
    }

    private setPosition() {
        var _loc1_: b2Vec2 = null;
        var _loc2_: ArtShape = null;
        var _loc3_: number = 0;
        _loc1_ = this._edgeShape.vertVector[this._vertIndex];
        this.posX = _loc1_.x;
        this.posY = _loc1_.y;
        if (this._edgeShape instanceof ArtShape) {
            _loc2_ = this._edgeShape as ArtShape;
            _loc3_ = this._vertIndex * 2;
            _loc1_ = _loc2_.handleVector[_loc3_];
            this.handle1X = _loc1_.x;
            this.handle1Y = _loc1_.y;
            _loc1_ = _loc2_.handleVector[_loc3_ + 1];
            this.handle2X = _loc1_.x;
            this.handle2Y = _loc1_.y;
        }
    }
}