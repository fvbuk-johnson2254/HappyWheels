import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol2588")] */
@boundClass
export default class MeteorRef extends Special {
    protected minDimension: number;
    protected maxDimension: number = 1.5;
    private defWidth: number = 400;
    private defHeight: number = 400;
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

        this._shapesUsed = 1;
        this.name = "meteor";
        this.rotatable = false;
        this.scalable = true;
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
    }

    public override setAttributes() {
        this._type = "MeteorRef";
        this._attributes = [
            "x",
            "y",
            "shapeWidth",
            "shapeHeight",
            "immovable2",
            "sleeping",
        ];
        this.addTriggerProperties();
    }

    public override clone(): RefSprite {
        var _loc1_: MeteorRef = null;
        _loc1_ = new MeteorRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.scaleX = this.scaleX;
        _loc1_.scaleY = this.scaleY;
        _loc1_._immovable2 = this.immovable2;
        _loc1_.sleeping = this.sleeping;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public override set scaleX(param1: number) {
        if (param1 < this.minDimension) {
            param1 = this.minDimension;
        }
        if (param1 > this.maxDimension) {
            param1 = this.maxDimension;
        }
        super.scaleX = param1;
    }

    public override set scaleY(param1: number) {
        if (param1 < this.minDimension) {
            param1 = this.minDimension;
        }
        if (param1 > this.maxDimension) {
            param1 = this.maxDimension;
        }
        super.scaleY = param1;
    }

    public override get shapeWidth(): number {
        return Math.round(this.scaleX * this.defWidth);
    }

    public override set shapeWidth(param1: number) {
        this.scaleX = this.scaleY = param1 / this.defWidth;
    }

    public override get shapeHeight(): number {
        return Math.round(this.scaleY * this.defHeight);
    }

    public override set shapeHeight(param1: number) {
        this.scaleY = this.scaleX = param1 / this.defHeight;
    }

    public get immovable2(): boolean {
        return this._immovable2;
    }

    public set immovable2(param1: boolean) {
        this._immovable2 = param1;
    }

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }
}