import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import BoostPanelFlat from "@/top/BoostPanelFlat";
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol2805")] */
@boundClass
export default class BoostRef extends Special {
    public static MIN_POWER: number;
    public static MAX_POWER: number = 100;
    public panels: Sprite;
    private minPanels: number = 1;
    private maxPanels: number = 6;
    private _numPanels: number = 2;
    private _boostPower: number = 20;

    constructor() {
        super();
        this.name = "boost";
        this._shapesUsed = 1;
        this._rotatable = true;
        this._scalable = false;
        this._triggerable = true;
        this._triggers = new Array();
    }

    public override setAttributes() {
        this._type = "BoostRef";
        this._attributes = ["x", "y", "angle", "numPanels", "boostPower"];
    }

    public override clone(): RefSprite {
        var _loc1_: BoostRef = null;
        _loc1_ = new BoostRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.numPanels = this.numPanels;
        _loc1_.boostPower = this.boostPower;
        return _loc1_;
    }

    public get numPanels(): number {
        return this._numPanels;
    }

    public set numPanels(param1: number) {
        var _loc4_: number = 0;
        var _loc5_: DisplayObject = null;
        if (param1 < this.minPanels) {
            param1 = this.minPanels;
        }
        if (param1 > this.maxPanels) {
            param1 = this.maxPanels;
        }
        var _loc2_: number = param1 - this._numPanels;
        if (_loc2_ > 0) {
            _loc4_ = this._numPanels;
            while (_loc4_ < param1) {
                _loc5_ = new BoostPanelFlat();
                this.panels.addChild(_loc5_);
                _loc4_++;
            }
        } else if (_loc2_ < 0) {
            _loc4_ = _loc2_;
            while (_loc4_ < 0) {
                _loc5_ = this.panels.getChildAt(this.panels.numChildren - 1);
                this.panels.removeChild(_loc5_);
                _loc4_++;
            }
        }
        var _loc3_: number = this.panels.numChildren * -90;
        _loc4_ = 0;
        while (_loc4_ < this.panels.numChildren) {
            _loc5_ = this.panels.getChildAt(_loc4_);
            _loc5_.x = _loc3_;
            _loc3_ += 180;
            _loc4_++;
        }
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
        trace(this.panels.numChildren);
        this._numPanels = param1;
    }

    public get boostPower(): number {
        return this._boostPower;
    }

    public set boostPower(param1: number) {
        if (param1 > BoostRef.MAX_POWER) {
            param1 = BoostRef.MAX_POWER;
        }
        if (param1 < BoostRef.MIN_POWER) {
            param1 = BoostRef.MIN_POWER;
        }
        this._boostPower = param1;
    }
}