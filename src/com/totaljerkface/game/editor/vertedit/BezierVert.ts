import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import BezierHandle from "@/com/totaljerkface/game/editor/vertedit/BezierHandle";
import Vert from "@/com/totaljerkface/game/editor/vertedit/Vert";
import { boundClass } from 'autobind-decorator';
import Matrix from "flash/geom/Matrix";

@boundClass
export default class BezierVert extends Vert {
    private _handle1: BezierHandle;
    private _handle2: BezierHandle;

    constructor(
        param1: number = 0,
        param2: number = 0,
        param3: number = 0,
        param4: number = 0,
        param5: number = 0,
        param6: number = 0,
    ) {
        super(param1, param2);
        this._handle1 = new BezierHandle(this);
        this._handle2 = new BezierHandle(this);
        this.addChild(this._handle1);
        this.addChild(this._handle2);
        this._handle1.Set(param3, param4);
        this._handle2.Set(param5, param6);
        this._handle1.visible = false;
        this._handle2.visible = false;
        this.doubleClickEnabled = true;
    }

    public override drawSelf() {
        var _loc5_: Matrix = null;
        this.graphics.clear();
        this._sprite.graphics.clear();
        var _loc1_: number = 0;
        var _loc2_: number = this._selected ? 16777215 : 0;
        this._sprite.graphics.lineStyle(null, _loc1_, 1);
        this._sprite.graphics.beginFill(_loc2_, 0.5);
        if (this._edgeShape) {
            _loc5_ = new Matrix();
            _loc5_.rotate((-this._edgeShape.rotation * Math.PI) / 180);
            _loc5_.scale(
                1 / (this._edgeShape.scaleX * Math.pow(2, Editor.currentZoom)),
                1 / (this._edgeShape.scaleY * Math.pow(2, Editor.currentZoom)),
            );
            this._sprite.transform.matrix = _loc5_;
            this._handle1.circleSprite.transform.matrix = _loc5_;
            this._handle2.circleSprite.transform.matrix = _loc5_;
        }
        var _loc3_: number = 5;
        var _loc4_: number = _loc3_ * 0.5;
        this._sprite.graphics.drawRect(-_loc4_, -_loc4_, _loc3_, _loc3_);
        this._sprite.graphics.endFill();
    }

    public drawArms(param1: boolean = true, param2: boolean = true) {
        this.drawSelf();
        this.graphics.lineStyle(null, 0, 1);
        if (param1 && !(this._handle1.x == 0 && this._handle1.y == 0)) {
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(this._handle1.x, this._handle1.y);
            this.handle1.drawSelf();
        }
        if (param2 && !(this._handle2.x == 0 && this._handle2.y == 0)) {
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(this._handle2.x, this._handle2.y);
            this.handle2.drawSelf();
        }
        this._handle1.visible = param1;
        this._handle2.visible = param2;
    }

    public clearArms() {
        this.drawSelf();
        this._handle1.visible = false;
        this._handle2.visible = false;
        this._handle1.clearSelf();
        this._handle2.clearSelf();
    }

    public get handle1(): BezierHandle {
        return this._handle1;
    }

    public get handle2(): BezierHandle {
        return this._handle2;
    }

    public get anchor1(): b2Vec2 {
        return new b2Vec2(this.x + this._handle1.x, this.y + this._handle1.y);
    }

    public get anchor2(): b2Vec2 {
        return new b2Vec2(this.x + this._handle2.x, this.y + this._handle2.y);
    }

    public override set selected(param1: boolean) {
        this._selected = param1;
        if (this._selected) {
            this.drawArms(true, true);
        } else {
            this.clearArms();
        }
    }

    public hasHandles(): boolean {
        if (
            this._handle1.x == 0 &&
            this._handle1.y == 0 &&
            this._handle2.x == 0 &&
            this._handle2.y == 0
        ) {
            return false;
        }
        return true;
    }

    public override clone(): Vert {
        var _loc1_ = new BezierVert();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.handle1.Set(this.handle1.x, this.handle1.y);
        _loc1_.handle2.Set(this.handle2.x, this.handle2.y);
        return _loc1_;
    }
}