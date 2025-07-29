import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import BezierVert from "@/com/totaljerkface/game/editor/vertedit/BezierVert";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class BezierHandle extends Sprite {
    private _vec: b2Vec2;
    private _vert: BezierVert;
    private _circleSprite: Sprite;

    constructor(param1: BezierVert, param2: number = 0, param3: number = 0) {
        super();
        this._vec = new b2Vec2();
        this._vert = param1;
        this.x = param2;
        this.y = param3;
        this._circleSprite = new Sprite();
        this._circleSprite.mouseEnabled = false;
        this.addChild(this._circleSprite);
    }

    public drawSelf() {
        this._circleSprite.graphics.clear();
        this._circleSprite.graphics.beginFill(16777215, 0.5);
        this._circleSprite.graphics.lineStyle(null, 0, 1);
        var _loc1_: number = 3;
        this._circleSprite.graphics.drawCircle(0, 0, _loc1_);
        this._circleSprite.graphics.endFill();
    }

    public clearSelf() {
        this._circleSprite.graphics.clear();
    }

    public get vert(): BezierVert {
        return this._vert;
    }

    public Set(param1: number, param2: number) {
        this.x = param1;
        this.y = param2;
        if (this.x == 0 && this.y == 0) {
            this.clearSelf();
        } else {
            this.drawSelf();
        }
        if (this._vert) {
            this._vert.drawArms();
        }
    }

    public get circleSprite(): Sprite {
        return this._circleSprite;
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