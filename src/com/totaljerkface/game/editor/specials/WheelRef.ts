import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

@boundClass
export default class WheelRef extends Special {
    public inner: MovieClip;
    private _wheelType: number = 1;

    constructor() {
        super();
        this.name = "wheel";
        this._shapesUsed = 1;
    }

    public override setAttributes() {
        this._type = "WheelRef";
        this._attributes = ["x", "y", "wheelType"];
    }

    public set wheelType(param1: number) {
        trace("wheel type: " + param1);
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 10) {
            param1 = 10;
        }
        this._wheelType = param1;
    }

    public get wheelType(): number {
        return this._wheelType;
    }

    public override clone(): RefSprite {
        var _loc1_: WheelRef = null;
        _loc1_ = new WheelRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.wheelType = this.wheelType;
        return _loc1_;
    }
}