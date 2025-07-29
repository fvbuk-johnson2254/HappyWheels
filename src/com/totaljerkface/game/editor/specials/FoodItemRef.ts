import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol602")] */
@boundClass
export default class FoodItemRef extends Special {
    public container: MovieClip;
    private _interactive: boolean = true;
    private _sleeping: boolean = false;
    private _foodType: number = 1;

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

        this.name = "food item";
        this._shapesUsed = 3;
        this._rotatable = true;
        this._scalable = false;
        this._joinable = true;
        this._joints = new Array();
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this.container.gotoAndStop(this._foodType);
    }

    public override setAttributes() {
        this._type = "FoodItemRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "sleeping",
            "interactive",
            "foodItemType",
        ];
        this.addTriggerProperties();
    }

    public override clone(): RefSprite {
        var _loc1_: FoodItemRef = null;
        _loc1_ = new FoodItemRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.interactive = this._interactive;
        // @ts-expect-error
        _loc1_.groupable = this._groupable;
        _loc1_.joinable = this._joinable;
        _loc1_.sleeping = this._sleeping;
        _loc1_.foodItemType = this._foodType;
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
        if (param1 && this._inGroup) {
            return;
        }
        this._interactive = param1;
        if (this._interactive) {
            this._groupable = false;
            this._joinable = true;
            this._shapesUsed = 3;
            this._artUsed = 0;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, -1));
            this.dispatchEvent(
                new CanvasEvent(CanvasEvent.SHAPE, this._shapesUsed),
            );
        } else {
            this._groupable = true;
            this._joinable = false;
            this._shapesUsed = 0;
            this._artUsed = 1;
            this.dispatchEvent(
                new CanvasEvent(CanvasEvent.SHAPE, -this._shapesUsed),
            );
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, 1));
        }
    }

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }

    public get foodItemType(): number {
        return this._foodType;
    }

    public set foodItemType(param1: number) {
        this._foodType = param1;
        this.container.gotoAndStop(param1);
        if (this._selected) {
            this.drawBoundingBox();
        }
    }
}