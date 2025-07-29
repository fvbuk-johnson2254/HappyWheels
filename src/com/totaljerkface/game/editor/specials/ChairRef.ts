import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2694")] */
@boundClass
export default class ChairRef extends Special {
    public container: Sprite;
    private _reverse: boolean;
    private _interactive: boolean = true;
    private _sleeping: boolean = false;

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

        this.name = "chair";
        this._shapesUsed = 4;
        this._rotatable = true;
        this._scalable = false;
        this._joinable = true;
        this._joints = new Array();
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
    }

    public override setAttributes() {
        this._type = "ChairRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "reverse",
            "sleeping",
            "interactive",
        ];
        this.addTriggerProperties();
    }

    public get interactive(): boolean {
        return this._interactive;
    }

    public set interactive(param1: boolean) {
        if (this._interactive == param1) {
            return;
        }
        if (param1 && this._inGroup) {
            return;
        }
        this._interactive = param1;
        if (this._interactive) {
            this._groupable = false;
            this._joinable = true;
            this._shapesUsed = 4;
            this._artUsed = 0;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, -1));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, 4));
        } else {
            this._groupable = true;
            this._joinable = false;
            this._shapesUsed = 0;
            this._artUsed = 1;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, -4));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, 1));
        }
    }

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }

    public override clone(): RefSprite {
        var _loc1_ = new ChairRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.reverse = this.reverse;
        _loc1_.angle = this.angle;
        _loc1_.sleeping = this._sleeping;
        _loc1_.interactive = this._interactive;
        _loc1_.joinable = this._joinable;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get reverse(): boolean {
        return this._reverse;
    }

    public set reverse(param1: boolean) {
        if (param1 == this._reverse) {
            return;
        }
        this._reverse = param1;
        if (this._reverse) {
            this.container.scaleX = -1;
        } else {
            this.container.scaleX = 1;
        }
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }
}