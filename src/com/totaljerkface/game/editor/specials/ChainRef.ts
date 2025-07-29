import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import link0MC from "@/top/link0MC";
import link1MC from "@/top/link1MC";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class ChainRef extends Special {
    public container: Sprite;
    private baseAngle: number = 90;
    private baseLinkThickness: number = 3;
    private linkThickness: number;
    private baseLinkHeight: number = 15;
    private linkHeight: number;
    private _interactive: boolean = true;
    private _sleeping: boolean = false;
    private _linkAngle: number = 0;
    private _linkScale: number = 1;
    private _linkCount: number = 20;
    private _linkMCs: any[] = [];
    private _points: any[] = [];

    constructor() {
        super();
        this._triggerable = true;
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = ["wake from sleep", "apply impulse"];
        this._triggerActionListProperties = [null, ["impulseX", "impulseY"]];

        this.name = "chain";
        this._shapesUsed = this._linkCount;
        this._artUsed = 0;
        this._rotatable = true;
        this._scalable = true;
        this._joinable = true;
        this._joints = new Array();
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this.container = new Sprite();
        this.addChild(this.container);
        this.addLinks();
    }

    private addLinks() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: any[] = null;
        var _loc12_: number = NaN;
        var _loc13_: number = NaN;
        var _loc14_: MovieClip = null;
        this.clearLinks();
        _loc1_ = 1 + ((this._linkScale - 1) / 9) * 2;
        _loc2_ = -((this._linkAngle / 10) * (360 / (this._linkCount * 2)));
        this._shapesUsed = this._linkCount;
        var _loc3_: number = 180 / Math.PI;
        var _loc4_: number = this.baseAngle / _loc3_;
        var _loc5_: number = _loc2_ / _loc3_;
        _loc8_ = [0, 0];
        this._points = [_loc8_];
        var _loc9_: number =
            (this.baseLinkHeight - this.baseLinkThickness * 2) * _loc1_;
        var _loc10_: number = this.container.numChildren;
        var _loc11_: number = 0;
        while (_loc11_ < this._linkCount) {
            _loc6_ = _loc4_ + ((_loc11_ + 1) * _loc5_ - _loc5_ * 0.5);
            _loc7_ = _loc6_ * _loc3_;
            _loc12_ = Math.cos(_loc6_) * _loc9_;
            _loc13_ = Math.sin(_loc6_) * _loc9_;
            if (_loc11_ % 2 == 0) {
                _loc14_ = new link0MC();
                this.container.addChildAt(_loc14_, Math.max(0, _loc10_));
            } else {
                _loc14_ = new link1MC();
                this.container.addChildAt(_loc14_, _loc10_ + 1);
            }
            _loc14_.scaleX = _loc14_.scaleY = _loc1_;
            _loc14_.rotation = _loc7_ - 90;
            _loc14_.x = _loc8_[0] + _loc12_ / 2;
            _loc14_.y = _loc8_[1] + _loc13_ / 2;
            this._linkMCs.push(_loc14_);
            _loc8_[0] += _loc12_;
            _loc8_[1] += _loc13_;
            _loc10_ = _loc14_.parent.getChildIndex(_loc14_);
            this._points.push(_loc8_);
            _loc11_++;
        }
        if (this._selected) {
            this.drawBoundingBox();
        }
    }

    private clearLinks() {
        var _loc1_: number = 0;
        while (_loc1_ < this._linkMCs.length) {
            this.container.removeChild(this._linkMCs[_loc1_]);
            _loc1_++;
        }
        this._linkMCs = [];
    }

    public override setAttributes() {
        this._type = "ChainRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "sleeping",
            "interactive",
            "linkCount",
            "linkScale",
            "linkAngle",
        ];
        this.addTriggerProperties();
    }

    public override clone(): RefSprite {
        var _loc1_: ChainRef = null;
        _loc1_ = new ChainRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.rotatable = this._rotatable;
        _loc1_.angle = this.angle;
        _loc1_.interactive = this._interactive;
        // @ts-expect-error
        _loc1_.groupable = this._groupable;
        _loc1_.joinable = this._joinable;
        _loc1_.sleeping = this._sleeping;
        _loc1_.linkScale = this._linkScale;
        _loc1_.linkAngle = this._linkAngle;
        _loc1_.linkCount = this._linkCount;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get interactive(): boolean {
        return this._interactive;
    }

    public set interactive(param1: boolean) {
        if (this._interactive == param1) {
            return;
        }
        this._interactive = param1;
        if (this._interactive) {
            this._joinable = true;
            this._shapesUsed = this._linkCount;
            this._artUsed = 0;
            this.dispatchEvent(
                new CanvasEvent(CanvasEvent.ART, -this._linkCount),
            );
            this.dispatchEvent(
                new CanvasEvent(CanvasEvent.SHAPE, this._linkCount),
            );
        } else {
            this._joinable = false;
            this._shapesUsed = 0;
            this._artUsed = this._linkCount;
            this.dispatchEvent(
                new CanvasEvent(CanvasEvent.SHAPE, -this._linkCount),
            );
            this.dispatchEvent(
                new CanvasEvent(CanvasEvent.ART, this._linkCount),
            );
        }
    }

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }

    public get linkScale(): number {
        return this._linkScale;
    }

    public set linkScale(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 10) {
            param1 = 10;
        }
        this._linkScale = param1;
        this.addLinks();
    }

    public get linkAngle(): number {
        return this._linkAngle;
    }

    public set linkAngle(param1: number) {
        if (param1 < -10) {
            param1 = -10;
        }
        if (param1 > 10) {
            param1 = 10;
        }
        this._linkAngle = param1;
        this.addLinks();
    }

    public set linkCount(param1: number) {
        if (param1 < 2) {
            param1 = 2;
        }
        if (param1 > 40) {
            param1 = 40;
        }
        var _loc2_: number = param1 - this._linkCount;
        this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, _loc2_));
        this._linkCount = param1;
        this.addLinks();
    }

    public get linkCount(): number {
        return this._linkCount;
    }

    public get linkMCs(): any[] {
        return this._linkMCs;
    }

    public set linkMCs(param1: any[]) {
        this._linkMCs = param1;
    }

    public get points(): any[] {
        return this._points;
    }

    public set points(param1: any[]) {
        this._points = param1;
    }
}