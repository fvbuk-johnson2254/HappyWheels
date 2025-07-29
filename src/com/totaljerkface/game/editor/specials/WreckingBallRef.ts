import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

/* [Embed(source="/_assets/assets.swf", symbol="symbol655")] */
@boundClass
export default class WreckingBallRef extends Special {
    public ball: Sprite;
    public arrows: Sprite;
    public rope: Sprite;
    protected minLength: number = 200;
    protected maxLength: number = 1000;
    protected minSpeed: number = 0;
    protected maxSpeed: number = 7;
    private _ropeLength: number = 350;
    private _ballSpeed: number = 4;

    constructor() {
        super();
        this.name = "wrecking ball";
        this._shapesUsed = 3;
        this._rotatable = false;
        this._scalable = false;
        this._triggerable = true;
        this._triggers = new Array();
        this.mouseChildren = false;
    }

    public override setAttributes() {
        this._type = "WreckingBallRef";
        this._attributes = ["x", "y", "ropeLength"];
    }

    public override clone(): RefSprite {
        var _loc1_: WreckingBallRef = null;
        _loc1_ = new WreckingBallRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.ropeLength = this._ropeLength;
        return _loc1_;
    }

    public get ropeLength(): number {
        return this._ropeLength;
    }

    public set ropeLength(param1: number) {
        if (param1 < this.minLength) {
            param1 = this.minLength;
        }
        if (param1 > this.maxLength) {
            param1 = this.maxLength;
        }
        this._ropeLength = param1;
        this.rope.height = param1;
        this.ball.y = this._ropeLength;
        this.arrows.width = this.ball.y * 2 + 150;
        this.arrows.scaleY = this.arrows.scaleX;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get ballSpeed(): number {
        return this._ballSpeed;
    }

    public set ballSpeed(param1: number) {
        if (param1 < this.minSpeed) {
            param1 = this.minSpeed;
        }
        if (param1 > this.maxSpeed) {
            param1 = this.maxSpeed;
        }
        this._ballSpeed = param1;
    }
}