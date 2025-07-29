import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol1078")] */
@boundClass
export default class PaddleRef extends Special {
    public paddle: MovieClip;
    private minDelay: number = 0;
    private maxDelay: number = 2;
    private _springDelay: number = 0;
    private _reverse: boolean = false;
    private _paddleAngle: number = 90;
    private _paddleSpeed: number = 10;

    constructor() {
        super();
        this.name = "paddle platform";
        this._shapesUsed = 3;
        this._rotatable = true;
        this._scalable = false;
    }

    public override setAttributes() {
        this._type = "PaddleRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "springDelay",
            "reverse",
            "paddleAngle",
            "paddleSpeed",
        ];
    }

    public override clone(): RefSprite {
        var _loc1_ = new PaddleRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.springDelay = this.springDelay;
        _loc1_.reverse = this.reverse;
        _loc1_.paddleAngle = this.paddleAngle;
        _loc1_.paddleSpeed = this.paddleSpeed;
        return _loc1_;
    }

    public get reverse(): boolean {
        return this._reverse;
    }

    public set reverse(param1: boolean) {
        if (this._reverse != param1) {
            // @ts-expect-error
            this.paddle.timer.x *= -1;
            // @ts-expect-error
            this.paddle.nub.x *= -1;
            // @ts-expect-error
            this.paddle.arrow.x *= -1;
        }
        this._reverse = param1;
    }

    public get paddleAngle(): number {
        return this._paddleAngle;
    }

    public set paddleAngle(param1: number) {
        if (param1 > 90) {
            param1 = 90;
        }
        if (param1 < 15) {
            param1 = 15;
        }
        this._paddleAngle = param1;
    }

    public get paddleSpeed(): number {
        return this._paddleSpeed;
    }

    public set paddleSpeed(param1: number) {
        if (param1 > 10) {
            param1 = 10;
        }
        if (param1 < 1) {
            param1 = 1;
        }
        this._paddleSpeed = param1;
    }

    public get springDelay(): number {
        return this._springDelay;
    }

    public set springDelay(param1: number) {
        if (param1 < this.minDelay) {
            param1 = this.minDelay;
        }
        if (param1 > this.maxDelay) {
            param1 = this.maxDelay;
        }
        this._springDelay = param1;
    }
}