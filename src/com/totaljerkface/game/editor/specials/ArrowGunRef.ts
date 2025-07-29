import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol2851")] */
@boundClass
export default class ArrowGunRef extends Special {
    protected _rateOfFire: number;
    protected _dontShootPlayer: boolean = false;
    protected _immovable2: boolean = true;

    constructor() {
        super();
        this.name = "arrow gun";
        this._shapesUsed = 23;
        this._rotatable = true;
        this._scalable = false;
        this._joinable = true;
        this._groupable = true;
        this._joints = new Array();
    }

    public override setAttributes() {
        this._type = "ArrowGunRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "immovable2",
            "rateOfFire",
            "dontShootPlayer",
        ];
    }

    public override clone(): RefSprite {
        var _loc1_ = new ArrowGunRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.rateOfFire = this.rateOfFire;
        _loc1_.immovable2 = this.immovable2;
        _loc1_.dontShootPlayer = this.dontShootPlayer;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get immovable2(): boolean {
        return this._immovable2;
    }

    public set immovable2(param1: boolean) {
        if (param1 && this._inGroup) {
            return;
        }
        this._immovable2 = param1;
    }

    public get rateOfFire(): number {
        return this._rateOfFire;
    }

    public set rateOfFire(param1: number) {
        this._rateOfFire = param1;
    }

    public get dontShootPlayer(): boolean {
        return this._dontShootPlayer;
    }

    public set dontShootPlayer(param1: boolean) {
        this._dontShootPlayer = param1;
    }

    public override get joinable(): boolean {
        if (this._immovable2) {
            return false;
        }
        return this._joinable;
    }

    public override get groupable(): boolean {
        if (this._immovable2 || this._inGroup) {
            return false;
        }
        return this._groupable;
    }
}