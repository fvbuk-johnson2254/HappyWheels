import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Matrix from "flash/geom/Matrix";

@boundClass
export default class Vert extends Sprite {
    protected _vec: b2Vec2;
    protected _selected: boolean;
    protected _sprite: Sprite;
    protected _edgeShape: EdgeShape;

    constructor(param1: number = 0, param2: number = 0) {
        super();
        this._vec = new b2Vec2();
        this.x = param1;
        this.y = param2;
        this._sprite = new Sprite();
        this._sprite.mouseEnabled = false;
        this.addChild(this._sprite);
    }

    public drawSelf() {
        var _loc3_: Matrix = null;
        this.graphics.clear();
        this._sprite.graphics.clear();
        var _loc1_: number = 0;
        var _loc2_: number = this._selected ? 16777215 : 0;
        this._sprite.graphics.lineStyle(null, _loc1_, 1);
        this._sprite.graphics.beginFill(_loc2_, 0.5);
        if (this._edgeShape) {
            _loc3_ = new Matrix();
            _loc3_.rotate((-this._edgeShape.rotation * Math.PI) / 180);
            _loc3_.scale(
                1 / (this._edgeShape.scaleX * Math.pow(2, Editor.currentZoom)),
                1 / (this._edgeShape.scaleY * Math.pow(2, Editor.currentZoom)),
            );
            this._sprite.transform.matrix = _loc3_;
        }
        this._sprite.graphics.drawCircle(0, 0, 3);
        this._sprite.graphics.endFill();
    }

    public get position(): b2Vec2 {
        return new b2Vec2(this.x, this.y);
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(param1: boolean) {
        this._selected = param1;
        this.drawSelf();
    }

    public get edgeShape(): EdgeShape {
        return this._edgeShape;
    }

    public set edgeShape(param1: EdgeShape) {
        this._edgeShape = param1;
        this.drawSelf();
    }

    public clone(): Vert {
        var _loc1_ = new Vert();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        return _loc1_;
    }

    // @ts-expect-error
    public override set x(param1: number) {
        // @ts-expect-error
        super.x = param1;
        this._vec.x = this.x;
    }

    // @ts-expect-error
    public override set y(param1: number) {
        // @ts-expect-error
        super.y = param1;
        this._vec.y = this.y;
    }

    public get vec(): b2Vec2 {
        return this._vec;
    }

    public set vec(param1: b2Vec2) {
        this._vec = param1;
        this.x = this._vec.x;
        this.y = this._vec.y;
    }
}