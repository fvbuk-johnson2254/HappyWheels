import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import MovieClip from "flash/display/MovieClip";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol3081")] */
@boundClass
export default class BladeWeaponRef extends Special {
    public static MAX_WEAPONS;
    public mc: MovieClip;
    private _bladeWeaponType: number = 1;
    private _reverse: boolean = false;
    private _sleeping: boolean = false;
    private _interactive: boolean = true;

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

        this.name = "blade weapon";
        this._scalable = false;
        this._joinable = true;
        this._groupable = true;
        this._shapesUsed = 2;
        this._joints = new Array();
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this.mc.gotoAndStop(this._bladeWeaponType);
    }

    public override setAttributes() {
        this._type = "BladeWeaponRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "reverse",
            "sleeping",
            "interactive",
            "bladeWeaponType",
        ];
        this.addTriggerProperties();
    }

    public get bladeWeaponType(): number {
        return this._bladeWeaponType;
    }

    public set bladeWeaponType(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > BladeWeaponRef.MAX_WEAPONS) {
            param1 = BladeWeaponRef.MAX_WEAPONS;
        }
        this.mc.gotoAndStop(param1);
        if (this._selected) {
            this.drawBoundingBox();
        }
        this._bladeWeaponType = param1;
    }

    public get reverse(): boolean {
        return this._reverse;
    }

    public set reverse(param1: boolean) {
        if (param1 == this._reverse) {
            return;
        }
        this.mc.scaleX = param1 ? -1 : 1;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this._reverse = param1;
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
            this._joinable = true;
            this._shapesUsed = 2;
            this._artUsed = 0;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, -1));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, 2));
        } else {
            this._joinable = false;
            this._shapesUsed = 0;
            this._artUsed = 1;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, -2));
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
        var _loc1_ = new BladeWeaponRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.interactive = this.interactive;
        _loc1_.angle = this.angle;
        _loc1_.reverse = this.reverse;
        _loc1_.sleeping = this.sleeping;
        _loc1_.bladeWeaponType = this.bladeWeaponType;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public override get groupable(): boolean {
        if (this._inGroup) {
            return false;
        }
        return this._groupable;
    }
}