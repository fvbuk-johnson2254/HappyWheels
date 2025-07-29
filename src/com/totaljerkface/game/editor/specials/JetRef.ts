import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol2598")] */
@boundClass
export default class JetRef extends Special {
    public static MAX_POWER: number;
    public static MIN_POWER: number = 1;
    public static MAX_ACCEL_TIME: number = 5;
    public static MIN_ACCEL_TIME: number = 0;
    public static MAX_FIRE_TIME: number = 50;
    public static MIN_FIRE_TIME: number = 0;
    private _power: number = 1;
    private _fixedRotation: boolean = false;
    private _sleeping: boolean = false;
    private _accelTime: number = 0;
    private _fireTime: number = 0;

    constructor() {
        super();
        this.name = "jet";
        this.joinable = true;
        this.scalable = false;
        this._joints = new Array();
        this._triggers = new Array();
    }

    public override setAttributes() {
        this._type = "JetRef";
        this._shapesUsed = 1;
        this._attributes = [
            "x",
            "y",
            "angle",
            "sleeping",
            "power",
            "fireTime",
            "accelTime",
            "fixedRotation",
        ];
    }

    public override clone(): RefSprite {
        var _loc1_: JetRef = null;
        _loc1_ = new JetRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.sleeping = this.sleeping;
        _loc1_.power = this.power;
        _loc1_.accelTime = this.accelTime;
        _loc1_.fireTime = this.fireTime;
        _loc1_.fixedRotation = this.fixedRotation;
        return _loc1_;
    }

    public get power(): number {
        return this._power;
    }

    public set power(param1: number) {
        if (param1 > JetRef.MAX_POWER) {
            param1 = JetRef.MAX_POWER;
        }
        if (param1 < JetRef.MIN_POWER) {
            param1 = JetRef.MIN_POWER;
        }
        this._power = param1;
        var _loc2_: number = JetRef.MAX_POWER - JetRef.MIN_POWER;
        var _loc3_: number = (this._power - JetRef.MIN_POWER) / _loc2_;
        this.scaleX = this.scaleY = 1 + _loc3_;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get fireTime(): number {
        return this._fireTime;
    }

    public set fireTime(param1: number) {
        if (param1 > JetRef.MAX_FIRE_TIME) {
            param1 = JetRef.MAX_FIRE_TIME;
        }
        if (param1 < JetRef.MIN_FIRE_TIME) {
            param1 = JetRef.MIN_FIRE_TIME;
        }
        this._fireTime = param1;
    }

    public get accelTime(): number {
        return this._accelTime;
    }

    public set accelTime(param1: number) {
        if (param1 > JetRef.MAX_ACCEL_TIME) {
            param1 = JetRef.MAX_ACCEL_TIME;
        }
        if (param1 < JetRef.MIN_ACCEL_TIME) {
            param1 = JetRef.MIN_ACCEL_TIME;
        }
        this._accelTime = param1;
    }

    public get fixedRotation(): boolean {
        return this._fixedRotation;
    }

    public set fixedRotation(param1: boolean) {
        this._fixedRotation = param1;
    }

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }

    public override get triggerable(): boolean {
        if (this._sleeping) {
            return true;
        }
        return this._triggerable;
    }
}