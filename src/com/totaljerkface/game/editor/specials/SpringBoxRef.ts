import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol1002")] */
@boundClass
export default class SpringBoxRef extends Special {
    private minDelay: number;
    private maxDelay: number = 2;
    private _springDelay: number = 0;

    constructor() {
        super();
        this.name = "spring platform";
        this._shapesUsed = 4;
        this._rotatable = true;
        this._scalable = false;
    }

    public override setAttributes() {
        this._type = "SpringBoxRef";
        this._attributes = ["x", "y", "angle", "springDelay"];
    }

    public override clone(): RefSprite {
        var _loc1_: SpringBoxRef = null;
        _loc1_ = new SpringBoxRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.springDelay = this.springDelay;
        return _loc1_;
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