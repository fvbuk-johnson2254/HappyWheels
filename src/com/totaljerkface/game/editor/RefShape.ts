import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionProperty from "@/com/totaljerkface/game/editor/actions/ActionProperty";
import CircleShape from "@/com/totaljerkface/game/editor/CircleShape";
import RectangleShape from "@/com/totaljerkface/game/editor/RectangleShape";
import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import RefVehicle from "@/com/totaljerkface/game/editor/RefVehicle";
import TriangleShape from "@/com/totaljerkface/game/editor/TriangleShape";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import GlowFilter from "flash/filters/GlowFilter";
import Point from "flash/geom/Point";

@boundClass
export default class RefShape extends RefSprite {
    protected static handleGlowFilter: GlowFilter;
    protected _interactive: boolean;
    protected _density: number;
    protected _immovable: boolean;
    protected _sleeping: boolean;
    protected _vehicleHandle: boolean = true;
    protected _color: number;
    protected _outlineColor: number;
    protected _opacity: number = 1;
    protected _innerCutout: number = 0;
    protected _collision: number = 1;
    public minDimension: number = 0.05;
    public maxDimension: number = 50;
    protected maxDensity: number = 100;
    protected minDensity: number = 0.1;
    protected minOpacity: number = 0;
    protected maxOpacity: number = 100;

    constructor(
        param1: boolean,
        param2: boolean,
        param3: boolean = false,
        param4: number = 5,
        param5: number = 11184810,
        param6: number = -1,
        param7: number = 100,
        param8: number = 0,
        param9: number = 0,
    ) {
        super();
        this._joints = new Array();
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = [
            "wake from sleep",
            "set to fixed",
            "set to non fixed",
            "change opacity",
            "apply impulse",
            "delete shape",
            "delete self",
            "change collision",
        ];
        this._triggerActionListProperties = [
            null,
            null,
            null,
            ["newOpacities", "opacityTimes"],
            ["impulseX", "impulseY", "spin"],
            null,
            null,
            ["newCollisions"],
        ];

        this._interactive = param1;
        if (this._interactive) {
            this._shapesUsed = 1;
            this._artUsed = 0;
        } else {
            this._shapesUsed = 0;
            this._artUsed = 1;
        }
        this._immovable = param2;
        this._sleeping = param3;
        this._density = param4;
        this._color = param5;
        this._outlineColor = param6;
        this._opacity = param7 * 0.01;
        this._collision = param8;
        this._innerCutout = param9;
        this._joinable = true;
        this._groupable = true;
        this._triggerable = true;
        this._triggerString = "triggerActionsShape";
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this.setAttributes();
        this.setFilters();
        this.drawShape();
    }

    public override setAttributes() {
        if (this._interactive) {
            this._attributes = [
                "x",
                "y",
                "shapeWidth",
                "shapeHeight",
                "angle",
                "color",
                "outlineColor",
                "opacity",
                "interactive",
                "immovable",
                "collision",
            ];
        } else {
            this._attributes = [
                "x",
                "y",
                "shapeWidth",
                "shapeHeight",
                "angle",
                "color",
                "outlineColor",
                "opacity",
                "interactive",
            ];
        }
        this.addTriggerProperties();
    }

    public override getFullProperties(): any[] {
        return [
            "x",
            "y",
            "shapeWidth",
            "shapeHeight",
            "angle",
            "immovable",
            "sleeping",
            "density",
            "color",
            "outlineColor",
            "opacity",
            "collision",
        ];
    }

    public override get functions(): any[] {
        if (this.groupable) {
            return ["groupSelected"];
        }
        if (this.group instanceof RefVehicle && this._interactive == true) {
            if (this.vehicleHandle) {
                return ["removeHandleProperty"];
            }
            return ["setShapeAsHandle"];
        }
        return new Array();
    }

    protected drawShape() { }

    public getFlatSprite(): Sprite {
        return null;
    }

    public get interactive(): boolean {
        return this._interactive;
    }

    public set interactive(param1: boolean) {
        if (this._interactive == param1) {
            return;
        }
        this._interactive = param1;
        this.setAttributes();
        this.setFilters();
        if (this._interactive) {
            this._shapesUsed = 1;
            this._artUsed = 0;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, -1));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, 1));
        } else {
            this._shapesUsed = 0;
            this._artUsed = 1;
            this.dispatchEvent(new CanvasEvent(CanvasEvent.SHAPE, -1));
            this.dispatchEvent(new CanvasEvent(CanvasEvent.ART, 1));
        }
    }

    public get density(): number {
        return this._density;
    }

    public set density(param1: number) {
        if (param1 > this.maxDensity) {
            param1 = this.maxDensity;
        }
        if (param1 < this.minDensity) {
            param1 = this.minDensity;
        }
        this._density = param1;
    }

    public get immovable(): boolean {
        return this._immovable;
    }

    public set immovable(param1: boolean) {
        if (param1 && this._inGroup) {
            return;
        }
        this._immovable = param1;
    }

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }

    public get color(): number {
        return this._color;
    }

    public set color(param1: number) {
        if (this._color == param1) {
            return;
        }
        this._color = param1;
        this.drawShape();
    }

    public get outlineColor(): number {
        return this._outlineColor;
    }

    public set outlineColor(param1: number) {
        if (this._outlineColor == param1) {
            return;
        }
        this._outlineColor = param1;
        this.drawShape();
    }

    public get opacity(): number {
        return Math.round(this._opacity * 100);
    }

    public set opacity(param1: number) {
        if (param1 < this.minOpacity) {
            param1 = this.minOpacity;
        }
        if (param1 > this.maxOpacity) {
            param1 = this.maxOpacity;
        }
        this._opacity = param1 * 0.01;
        this.drawShape();
    }

    public get innerCutout(): number {
        return this._innerCutout;
    }

    public set innerCutout(param1: number) {
        if (param1 < 0) {
            param1 = 0;
        }
        if (param1 > 100) {
            param1 = 100;
        }
        this._innerCutout = param1;
        this.drawShape();
    }

    public get collision(): number {
        return this._collision;
    }

    public set collision(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 7) {
            param1 = 7;
        }
        this._collision = param1;
    }

    public get vehicleHandle(): boolean {
        return this._vehicleHandle;
    }

    public set vehicleHandle(param1: boolean) {
        this._vehicleHandle = param1;
        this.setFilters();
    }

    public override get joinable(): boolean {
        if (this._immovable || !this.interactive) {
            return false;
        }
        return this._joinable;
    }

    public override get groupable(): boolean {
        if ((this._interactive && this._immovable) || this._inGroup) {
            return false;
        }
        return this._groupable;
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

    public override setFilters() {
        if (
            this._vehicleHandle &&
            this._interactive &&
            this._group instanceof RefVehicle &&
            this.filters.length == 0
        ) {
            this.filters = [RefShape.handleGlowFilter];
        } else {
            this.filters = [];
        }
    }

    public override setProperty(param1: string, param2): Action {
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        var _loc9_ = 0;
        var _loc10_: RefJoint = null;
        if (
            (param1 == "immovable" && param2 == true) ||
            (param1 == "interactive" && param2 == false)
        ) {
            _loc9_ = 0;
            while (_loc9_ < this._joints.length) {
                _loc10_ = this._joints[_loc9_];
                _loc3_ = _loc10_.removeBody(this);
                if (_loc4_) {
                    _loc4_.nextAction = _loc3_.firstAction;
                }
                _loc4_ = _loc3_;
                this.removeJoint(_loc10_);
                _loc9_ = --_loc9_ + 1;
            }
        } else if (
            param1 == "interactive" &&
            this._immovable &&
            this._inGroup
        ) {
            this._immovable = false;
            _loc4_ = new ActionProperty(this, "immovable", true, false);
        }
        var _loc5_ = this[param1];
        var _loc6_ = new Point(this.x, this.y);
        this[param1] = param2;
        var _loc7_ = this[param1];
        var _loc8_ = new Point(this.x, this.y);
        if (_loc7_ != _loc5_) {
            _loc3_ = new ActionProperty(
                this,
                param1,
                _loc5_,
                _loc7_,
                _loc6_,
                _loc8_,
            );
            if (_loc4_) {
                _loc4_.nextAction = _loc3_;
            }
        }
        return _loc3_;
    }

    public override clone(): RefSprite {
        var _loc1_: RefShape = null;
        if (this instanceof RectangleShape) {
            _loc1_ = new RectangleShape(
                this.interactive,
                this.immovable,
                this.sleeping,
                this.density,
                this.color,
                this.outlineColor,
                this.opacity,
                this.collision,
            );
        } else if (this instanceof CircleShape) {
            _loc1_ = new CircleShape(
                this.interactive,
                this.immovable,
                this.sleeping,
                this.density,
                this.color,
                this.outlineColor,
                this.opacity,
                this.collision,
            );
        } else if (this instanceof TriangleShape) {
            _loc1_ = new TriangleShape(
                this.interactive,
                this.immovable,
                this.sleeping,
                this.density,
                this.color,
                this.outlineColor,
                this.opacity,
                this.collision,
            );
        }
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.shapeWidth = this.shapeWidth;
        _loc1_.shapeHeight = this.shapeHeight;
        _loc1_.angle = this.angle;
        _loc1_.vehicleHandle = this.vehicleHandle;
        _loc1_.innerCutout = this.innerCutout;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get triggerActionsShape(): Dictionary<any, any> {
        return this._triggerActions;
    }
}