import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2800")] */
@boundClass
export default class BottleRef extends Special {
    public container: MovieClip;
    private _bottleType: number = 1;
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

        this.name = "bottle";
        this._shapesUsed = 1;
        this._rotatable = true;
        this._scalable = false;
        this._joinable = true;
        this._joints = new Array();
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this.container.gotoAndStop(1);
    }

    public override setAttributes() {
        this._type = "BottleRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "bottleType",
            "sleeping",
            "interactive",
        ];
        this.addTriggerProperties();
    }

    public override clone(): RefSprite {
        var _loc1_: BottleRef = null;
        _loc1_ = new BottleRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.rotatable = this._rotatable;
        _loc1_.angle = this.angle;
        _loc1_.interactive = this._interactive;
        // @ts-expect-error
        _loc1_.groupable = this._groupable;
        _loc1_.joinable = this._joinable;
        _loc1_.sleeping = this._sleeping;
        _loc1_.bottleType = this._bottleType;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get bottleType(): number {
        return this._bottleType;
    }

    public set bottleType(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 4) {
            param1 = 4;
        }
        this.container.gotoAndStop(param1);
        this._bottleType = param1;
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
            this._shapesUsed = 1;
            this._artUsed = 0;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, -1));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, 1));
        } else {
            this._groupable = true;
            this._joinable = false;
            this._shapesUsed = 0;
            this._artUsed = 1;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, -1));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, 1));
        }
    }

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }
}