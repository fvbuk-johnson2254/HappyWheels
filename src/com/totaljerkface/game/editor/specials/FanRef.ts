import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol2674")] */
@boundClass
export default class FanRef extends Special {
    constructor() {
        super();
        this._shapesUsed = 3;
        this.name = "fan";
        this.rotatable = true;
        this.scalable = false;
        this._triggerable = true;
        this._triggers = new Array();
    }

    public override setAttributes() {
        this._type = "FanRef";
        this._attributes = ["x", "y", "angle"];
    }

    public override clone(): RefSprite {
        var _loc1_: FanRef = null;
        _loc1_ = new FanRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        return _loc1_;
    }
}