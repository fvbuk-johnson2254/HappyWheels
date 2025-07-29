import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2909")] */
@boundClass
export default class CannonRef extends Special {
    public muzzle: MovieClip;
    public muzzleShadow: MovieClip;
    public shapes: MovieClip;
    public base: MovieClip;
    private _startRotation: number = 0;
    private _firingRotation: number = 0;
    private _muzzleScale: number = 1;
    private _power: number = 5;
    private _delay: number = 1;
    private _cannonType: number = 1;

    constructor() {
        super();
        this.name = "cannon";
        this._scalable = false;
        this.base.gotoAndStop(1);
        // @ts-expect-error
        this.muzzle.inner.gotoAndStop(1);
        // @ts-expect-error
        this.muzzleShadow.inner.gotoAndStop(1);
        // @ts-expect-error
        this.base.star.gotoAndStop(1);
        // @ts-expect-error
        this.base.meter.removeChild(this.base.meter.bar);
        this.removeChild(this.shapes);
    }

    public override setAttributes() {
        this._type = "CannonRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "startRotation",
            "firingRotation",
            "cannonType",
            "cannonDelay",
            "muzzleScale",
            "cannonPower",
        ];
    }

    public override clone(): RefSprite {
        var _loc1_ = new CannonRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.startRotation = this.startRotation;
        _loc1_.firingRotation = this.firingRotation;
        _loc1_.muzzleScale = this.muzzleScale;
        _loc1_.cannonPower = this.cannonPower;
        _loc1_.cannonDelay = this.cannonDelay;
        _loc1_.cannonType = this.cannonType;
        return _loc1_;
    }

    public get startRotation(): number {
        return this._startRotation;
    }

    public set startRotation(param1: number) {
        if (param1 < -90) {
            param1 = -90;
        }
        if (param1 > 90) {
            param1 = 90;
        }
        this._startRotation = param1;
        this.muzzle.rotation = this._startRotation;
        if (this._selected) {
            this.drawBoundingBox();
        }
    }

    public get firingRotation(): number {
        return this._firingRotation;
    }

    public set firingRotation(param1: number) {
        if (param1 < -90) {
            param1 = -90;
        }
        if (param1 > 90) {
            param1 = 90;
        }
        this._firingRotation = param1;
        this.muzzleShadow.rotation = this._firingRotation;
        if (this._selected) {
            this.drawBoundingBox();
        }
    }

    public get cannonPower(): number {
        return this._power;
    }

    public set cannonPower(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 10) {
            param1 = 10;
        }
        this._power = param1;
    }

    public get cannonType(): number {
        return this._cannonType;
    }

    public set cannonType(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 2) {
            param1 = 2;
        }
        this._cannonType = param1;
        // @ts-expect-error
        this.muzzle.inner.gotoAndStop(this._cannonType);
        // @ts-expect-error
        this.muzzleShadow.inner.gotoAndStop(this._cannonType);
        this.base.gotoAndStop(this._cannonType);
        if (param1 == 1) {
            // @ts-expect-error
            this.base.star.gotoAndStop(1);
        }
    }

    public get cannonDelay(): number {
        return this._delay;
    }

    public set cannonDelay(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 10) {
            param1 = 10;
        }
        this._delay = param1;
    }

    public get muzzleScale(): number {
        return this._muzzleScale;
    }

    public set muzzleScale(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 10) {
            param1 = 10;
        }
        this._muzzleScale = param1;
        var _loc2_: number = 1 + param1 / 20;
        this.muzzle.scaleX =
            this.muzzle.scaleY =
            this.muzzleShadow.scaleX =
            this.muzzleShadow.scaleY =
            _loc2_;
        if (this._selected) {
            this.drawBoundingBox();
        }
    }
}