import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol2584")] */
@boundClass
export default class MineRef extends Special {
    constructor() {
        super();
        this.name = "landmine";
        this.rotatable = true;
        this.scalable = false;
        this._triggerable = true;
        this._triggers = new Array();
    }

    public override setAttributes() {
        this._type = "MineRef";
        this._shapesUsed = 2;
        this._attributes = ["x", "y", "angle"];
    }

    public override clone(): RefSprite {
        var _loc1_: MineRef = null;
        _loc1_ = new MineRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        return _loc1_;
    }
}