import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol2611")] */
@boundClass
export default class IBeamRef extends Special {
    protected minXDimension: number;
    protected maxXDimension: number = 4;
    protected minYDimension: number = 1;
    protected maxYDimension: number = 2;
    protected _immovable2: boolean;
    protected _sleeping: boolean;

    constructor() {
        super();
        this._triggerable = true;
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = ["wake from sleep", "apply impulse"];
        this._triggerActionListProperties = [
            null,
            ["impulseX", "impulseY", "spin"],
        ];

        this.name = "i-beam";
        this._shapesUsed = 1;
        this._rotatable = true;
        this._scalable = true;
        this._joinable = true;
        this._groupable = true;
        this._joints = new Array();
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
    }

    public override setAttributes() {
        this._type = "IBeamRef";
        this._attributes = [
            "x",
            "y",
            "shapeWidth",
            "shapeHeight",
            "angle",
            "immovable2",
            "sleeping",
        ];
        this.addTriggerProperties();
    }

    public override clone(): RefSprite {
        var _loc1_ = new IBeamRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.scaleX = this.scaleX;
        _loc1_.scaleY = this.scaleY;
        _loc1_._immovable2 = this.immovable2;
        _loc1_.sleeping = this._sleeping;
        this.transferKeyedProperties(_loc1_);
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
        return Math.round(this.scaleX * 400);
    }

    public override set shapeWidth(param1: number) {
        this.scaleX = param1 / 400;
    }

    public override get shapeHeight(): number {
        return Math.round(this.scaleY * 32);
    }

    public override set shapeHeight(param1: number) {
        this.scaleY = param1 / 32;
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

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }
}