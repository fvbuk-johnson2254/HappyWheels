import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class GlassRef extends Special {
    protected minXDimension: number;
    protected maxXDimension: number = 0.5;
    protected minYDimension: number = 0.5;
    protected maxYDimension: number = 5;
    protected minStrength: number = 1;
    protected maxStrength: number = 10;
    private _sleeping: boolean;
    private _shatterStrength: number = 10;
    private _stabbing: boolean = true;

    constructor() {
        super();
        this._triggerable = true;
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = [
            "shatter",
            "wake from sleep",
            "apply impulse",
        ];
        this._triggerActionListProperties = [
            null,
            null,
            ["impulseX", "impulseY", "spin"],
        ];
        this._triggerString = "triggerActionsGlass";

        this.name = "glass panel";
        this._shapesUsed = 16;
        this._rotatable = true;
        this._scalable = true;
        this._joinable = true;
        this._joints = new Array();
        this.scaleX = 0.1;
        this.scaleY = 1;
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this.drawShape();
    }

    public override setAttributes() {
        this._type = "GlassRef";
        this._attributes = [
            "x",
            "y",
            "shapeWidth",
            "shapeHeight",
            "angle",
            "sleeping",
            "shatterStrength",
            "stabbing",
        ];
        this.addTriggerProperties();
    }

    public override clone(): RefSprite {
        var _loc1_: GlassRef = null;
        _loc1_ = new GlassRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.scaleX = this.scaleX;
        _loc1_.scaleY = this.scaleY;
        _loc1_.sleeping = this.sleeping;
        _loc1_.shatterStrength = this.shatterStrength;
        _loc1_.stabbing = this.stabbing;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    protected drawShape() {
        this.graphics.clear();
        this.graphics.beginFill(6737151, 0.35);
        this.graphics.drawRect(-50, -50, 100, 100);
        this.graphics.endFill();
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

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }

    public get shatterStrength(): number {
        return this._shatterStrength;
    }

    public set shatterStrength(param1: number) {
        if (param1 == 0) {
            param1 = 10;
        }
        if (param1 < this.minStrength) {
            param1 = this.minStrength;
        }
        if (param1 > this.maxStrength) {
            param1 = this.maxStrength;
        }
        this._shatterStrength = param1;
    }

    public get stabbing(): boolean {
        return this._stabbing;
    }

    public set stabbing(param1: boolean) {
        this._stabbing = param1;
    }

    public get triggerActionsGlass(): Dictionary<any, any> {
        return this._triggerActions;
    }
}