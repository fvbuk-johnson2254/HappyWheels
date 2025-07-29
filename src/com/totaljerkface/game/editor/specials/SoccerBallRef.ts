import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol1038")] */
@boundClass
export default class SoccerBallRef extends Special {
    constructor() {
        super();
        this.name = "soccer ball";
        this._shapesUsed = 1;
        this._rotatable = false;
        this._scalable = false;
    }

    public override setAttributes() {
        this._type = "SoccerBallRef";
        this._attributes = ["x", "y"];
    }

    public override clone(): RefSprite {
        var _loc1_: SoccerBallRef = null;
        _loc1_ = new SoccerBallRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        return _loc1_;
    }
}