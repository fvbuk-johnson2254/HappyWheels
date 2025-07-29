import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import PostMC from "@/top/PostMC";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol1058")] */
@boundClass
export default class SignPostRef extends Special {
    public static TOTAL_SIGN_TYPES: number;
    public container: MovieClip;
    private _sleeping: boolean = false;
    private _signPostType: number = 1;
    private _hasPost: boolean;
    private _postMC: MovieClip;

    constructor() {
        super();
        this.name = "sign";
        this._shapesUsed = 0;
        this._artUsed = 1;
        this._rotatable = true;
        this._scalable = false;
        this._joinable = false;
        this._groupable = true;
        this.signPost = true;
        this.container.gotoAndStop(1);
    }

    public override setAttributes() {
        this._type = "SignPostRef";
        this._attributes = ["x", "y", "angle", "signPostType", "signPost"];
    }

    public override clone(): RefSprite {
        var _loc1_ = new SignPostRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        // @ts-expect-error
        _loc1_.groupable = this._groupable;
        _loc1_.signPostType = this._signPostType;
        _loc1_.signPost = this._hasPost;
        return _loc1_;
    }

    public get signPost(): boolean {
        return this._hasPost;
    }

    public set signPost(param1: boolean) {
        if (this._hasPost == param1) {
            return;
        }
        if (param1) {
            this._postMC = new PostMC();
            this.container.addChildAt(this._postMC, 0);
        } else {
            this._postMC.parent.removeChild(this._postMC);
        }
        if (this._selected) {
            this.drawBoundingBox();
        }
        this._hasPost = param1;
    }

    public get signPostType(): number {
        return this._signPostType;
    }

    public set signPostType(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > SignPostRef.TOTAL_SIGN_TYPES) {
            param1 = SignPostRef.TOTAL_SIGN_TYPES;
        }
        this.container.gotoAndStop(param1);
        if (this._selected) {
            this.drawBoundingBox();
        }
        this._signPostType = param1;
    }
}