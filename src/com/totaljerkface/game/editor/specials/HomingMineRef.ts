import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol2613")] */
@boundClass
export default class HomingMineRef extends Special {
    private _seekSpeed: number;
    private _explosionDelay: number = 0;
    private _seekStyle: number = 1;

    constructor() {
        super();
        this.name = "homing mine";
        this.rotatable = false;
        this.scalable = false;
        this._triggers = new Array();
        this._triggerable = true;
    }

    public override setAttributes() {
        this._type = "HomingMineRef";
        this._shapesUsed = 4;
        this._attributes = ["x", "y", "seekSpeed", "explosionDelay"];
    }

    public override clone(): RefSprite {
        var _loc1_ = new HomingMineRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.seekSpeed = this.seekSpeed;
        _loc1_.explosionDelay = this.explosionDelay;
        return _loc1_;
    }

    public get seekSpeed(): number {
        return this._seekSpeed;
    }

    public set seekSpeed(param1: number) {
        if (param1 > 10) {
            param1 = 10;
        }
        if (param1 < 1) {
            param1 = 1;
        }
        this._seekSpeed = param1;
    }

    public get explosionDelay(): number {
        return this._explosionDelay;
    }

    public set explosionDelay(param1: number) {
        if (param1 > 5) {
            param1 = 5;
        }
        if (param1 < 0) {
            param1 = 0;
        }
        this._explosionDelay = param1;
    }
}