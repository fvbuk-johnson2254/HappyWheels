import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

/* [Embed(source="/_assets/assets.swf", symbol="symbol1063")] */
@boundClass
export default class RailRef extends Special {
    public inner: Sprite;
    protected minXDimension: number = 1;
    protected maxXDimension: number = 20;
    protected minYDimension: number = 1;
    protected maxYDimension: number = 1;

    constructor() {
        super();
        this.name = "rail";
        this._shapesUsed = 2;
        this._rotatable = true;
        this._scalable = true;
        this._joinable = false;
        this._groupable = false;
        this.shapeWidth = 250;
    }

    public override setAttributes() {
        this._type = "RailRef";
        this._attributes = ["x", "y", "shapeWidth", "shapeHeight", "angle"];
    }

    public override clone(): RefSprite {
        var _loc1_: RailRef = null;
        _loc1_ = new RailRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.scaleX = this.scaleX;
        _loc1_.scaleY = this.scaleY;
        return _loc1_;
    }

    public override set scaleX(param1: number) {
        if (param1 < this.minXDimension) {
            param1 = this.minXDimension;
        }
        if (param1 > this.maxXDimension) {
            param1 = this.maxXDimension;
        }
        super.scaleX = param1;
    }

    public override set scaleY(param1: number) {
        if (param1 < this.minYDimension) {
            param1 = this.minYDimension;
        }
        if (param1 > this.maxYDimension) {
            param1 = this.maxYDimension;
        }
        super.scaleY = param1;
    }

    public override get shapeWidth(): number {
        return Math.round(this.scaleX * 100);
    }

    public override set shapeWidth(param1: number) {
        this.scaleX = param1 / 100;
    }

    public override get shapeHeight(): number {
        return 18;
    }

    public override set shapeHeight(param1: number) {
        this.scaleY = 1;
    }
}