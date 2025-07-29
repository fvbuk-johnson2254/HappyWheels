import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import Spike from "@/top/Spike";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";

/* [Embed(source="/_assets/assets.swf", symbol="symbol1015")] */
@boundClass
export default class SpikesRef extends Special {
    public base: Sprite;
    public spikes: Sprite;
    private minSpikes: number = 20;
    private maxSpikes: number = 150;
    protected _immovable2: boolean = true;
    protected _sleeping: boolean;
    private _numSpikes: number = 20;

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

        this.name = "spike set";
        this._shapesUsed = 2;
        this._rotatable = true;
        this._scalable = false;
        this._joinable = true;
        this._groupable = true;
        this._joints = new Array();
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
    }

    public override setAttributes() {
        this._type = "SpikesRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "immovable2",
            "numSpikes",
            "sleeping",
        ];
        this.addTriggerProperties();
    }

    public override clone(): RefSprite {
        var _loc1_ = new SpikesRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.numSpikes = this.numSpikes;
        _loc1_.immovable2 = this.immovable2;
        _loc1_.sleeping = this.sleeping;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get numSpikes(): number {
        return this._numSpikes;
    }

    public set numSpikes(param1: number) {
        var _loc3_: number = 0;
        var _loc4_: DisplayObject = null;
        if (param1 < this.minSpikes) {
            param1 = this.minSpikes;
        }
        if (param1 > this.maxSpikes) {
            param1 = this.maxSpikes;
        }
        var _loc2_: number = param1 - this._numSpikes;
        if (_loc2_ > 0) {
            _loc3_ = this._numSpikes;
            while (_loc3_ < param1) {
                _loc4_ = new Spike();
                this.spikes.addChild(_loc4_);
                _loc4_.x = _loc3_ * 15;
                _loc3_++;
            }
        } else if (_loc2_ < 0) {
            _loc3_ = _loc2_;
            while (_loc3_ < 0) {
                _loc4_ = this.spikes.getChildAt(this.spikes.numChildren - 1);
                this.spikes.removeChild(_loc4_);
                _loc3_++;
            }
        }
        this.base.width = param1 * 15;
        this.spikes.x = this.base.width / -2;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
        this._numSpikes = param1;
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