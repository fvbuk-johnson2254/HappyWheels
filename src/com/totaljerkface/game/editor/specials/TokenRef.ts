import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol912")] */
@boundClass
export default class TokenRef extends Special {
    public container: MovieClip;
    private _tokenType: number = 1;

    constructor() {
        super();
        this.name = "token";
        this._shapesUsed = 1;
        this._scalable = false;
        this._rotatable = false;
        this._groupable = false;
        this.container.gotoAndStop(1);
        // @ts-expect-error
        this.container.container.gotoAndStop(this._tokenType);
    }

    public override setAttributes() {
        this._type = "TokenRef";
        this._attributes = ["x", "y", "tokenType"];
    }

    public override clone(): RefSprite {
        var _loc1_: TokenRef = null;
        _loc1_ = new TokenRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.tokenType = this._tokenType;
        return _loc1_;
    }

    public get tokenType(): number {
        return this._tokenType;
    }

    public set tokenType(param1: number) {
        if (param1 > 6) {
            param1 = 6;
        }
        if (param1 < 1) {
            param1 = 1;
        }
        // @ts-expect-error
        this.container.container.gotoAndStop(param1);
        this._tokenType = param1;
    }
}