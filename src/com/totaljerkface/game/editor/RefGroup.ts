import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionAdd from "@/com/totaljerkface/game/editor/actions/ActionAdd";
import ActionGroup from "@/com/totaljerkface/game/editor/actions/ActionGroup";
import ActionProperty from "@/com/totaljerkface/game/editor/actions/ActionProperty";
import ActionRotateUnbound from "@/com/totaljerkface/game/editor/actions/ActionRotateUnbound";
import ActionTranslateUnbound from "@/com/totaljerkface/game/editor/actions/ActionTranslateUnbound";
import ActionUngroup from "@/com/totaljerkface/game/editor/actions/ActionUngroup";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import GroupCanvas from "@/com/totaljerkface/game/editor/GroupCanvas";
import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import RefVehicle from "@/com/totaljerkface/game/editor/RefVehicle";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class RefGroup extends RefSprite {
    protected _shapeContainer: Sprite;
    protected _specialContainer: Sprite;
    protected _offset: Point;
    protected _sleeping: boolean;
    protected _foreground: boolean;
    protected _immovable: boolean;
    protected _fixedRotation: boolean;
    protected _opacity: number = 1;

    constructor() {
        super();
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = [
            "wake from sleep",
            "change opacity",
            "apply impulse",
            "set to fixed",
            "set to non fixed",
            "delete shapes",
            "delete self",
            "change collision",
        ];
        this._triggerActionListProperties = [
            null,
            ["newOpacities", "opacityTimes"],
            ["impulseX", "impulseY", "spin"],
            null,
            null,
            null,
            null,
            ["newCollisions"],
        ];

        this.name = "group";
        this._scalable = false;
        this._joinable = true;
        this._joints = new Array();
        this._triggerable = true;
        this._triggerString = "triggerActionsGroup";
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this._shapeContainer = new Sprite();
        this._specialContainer = new Sprite();
        this.addChild(this._shapeContainer);
        this.addChild(this._specialContainer);
        this.doubleClickEnabled = true;
    }

    public override setAttributes() {
        this._attributes = [
            "x",
            "y",
            "angle",
            "sleeping",
            "foreground",
            "opacity",
            "immovable3",
            "fixedRotation",
        ];
        this.addTriggerProperties();
    }

    public override get functions(): any[] {
        if (this.vehiclePossible) {
            return ["breakSelectedGroups", "convertGroupToVehicle"];
        }
        return ["breakSelectedGroups"];
    }

    public build(param1: any[], param2: Canvas): Action {
        var _loc3_: RefSprite = null;
        var _loc4_: Rectangle = null;
        var _loc5_: Action = null;
        var _loc6_: Action = null;
        var _loc7_: Action = null;
        var _loc8_: number = 0;
        var _loc9_: DisplayObjectContainer = null;
        var _loc11_: Point = null;
        _loc4_ = new Rectangle();
        this._shapesUsed = 0;
        this._artUsed = 0;
        var _loc10_: number = 0;
        while (_loc10_ < param1.length) {
            _loc3_ = param1[_loc10_];
            this._shapesUsed += _loc3_.shapesUsed;
            this._artUsed += _loc3_.artUsed;
            _loc9_ = _loc3_.parent;
            _loc8_ = _loc9_.getChildIndex(_loc3_);
            _loc4_ = _loc3_.getBounds(_loc9_).union(_loc4_);
            _loc5_ = _loc3_.deleteSelf(param2);
            if (_loc3_ instanceof RefShape) {
                this._shapeContainer.addChild(_loc3_);
            } else {
                if (!(_loc3_ instanceof Special)) {
                    throw Error(
                        "group child is not shape or special.  FUCK OFF",
                    );
                }
                this._specialContainer.addChild(_loc3_);
            }
            _loc6_ = new ActionGroup(
                _loc3_,
                null,
                this,
                _loc3_.parent,
                _loc3_.parent.getChildIndex(_loc3_),
            );
            _loc3_.group = this;
            _loc5_.nextAction = _loc6_;
            if (_loc7_) {
                _loc7_.nextAction = _loc5_.firstAction;
            }
            _loc7_ = _loc6_;
            _loc10_++;
        }
        if (this._shapesUsed == 0) {
            _loc6_ = new ActionProperty(
                this,
                "joinable",
                this._joinable,
                false,
            );
            if (_loc7_) {
                _loc7_.nextAction = _loc6_;
            }
            this._joinable = false;
        }
        _loc11_ = new Point(
            _loc4_.x + _loc4_.width / 2,
            _loc4_.y + _loc4_.height / 2,
        );
        this._shapeContainer.x = this._specialContainer.x = -_loc11_.x;
        this._shapeContainer.y = this._specialContainer.y = -_loc11_.y;
        this.x = _loc11_.x;
        this.y = _loc11_.y;
        this._offset = new Point(
            this._shapeContainer.x,
            this._shapeContainer.y,
        );
        return _loc6_;
    }

    public rebuild(
        param1: any[],
        param2: Canvas,
        param3: boolean = true,
    ): Action {
        var _loc4_: RefSprite = null;
        var _loc6_: Action = null;
        var _loc7_: Action = null;
        var _loc8_: Action = null;
        var _loc9_: number = 0;
        var _loc10_: DisplayObjectContainer = null;
        var _loc13_: Point = null;
        var _loc14_: number = NaN;
        var _loc15_: number = NaN;
        var _loc16_: b2Vec2 = null;
        var _loc17_: b2Mat22 = null;
        var _loc18_: b2Vec2 = null;
        var _loc19_: ActionRotateUnbound = null;
        var _loc20_: ActionTranslateUnbound = null;
        var _loc21_: RefJoint = null;
        var _loc5_ = new Rectangle();
        this._shapesUsed = 0;
        this._artUsed = 0;
        var _loc11_: number = (this.rotation * Math.PI) / 180;
        var _loc12_ = 0;
        while (_loc12_ < param1.length) {
            _loc4_ = param1[_loc12_];
            _loc13_ = new Point(_loc4_.x, _loc4_.y);
            _loc14_ = _loc4_.angle;
            _loc15_ = _loc14_ - this.rotation;
            _loc16_ = new b2Vec2(_loc4_.x - this.x, _loc4_.y - this.y);
            _loc17_ = new b2Mat22(-_loc11_);
            _loc18_ = new b2Vec2(-this._offset.x, -this._offset.y);
            _loc16_.MulM(_loc17_);
            _loc16_.Add(_loc18_);
            _loc4_.angleUnbound = _loc15_;
            _loc19_ = new ActionRotateUnbound(_loc4_, _loc14_);
            _loc4_.xUnbound = _loc16_.x;
            _loc4_.yUnbound = _loc16_.y;
            _loc20_ = new ActionTranslateUnbound(
                _loc4_,
                _loc13_.clone(),
                new Point(_loc16_.x, _loc16_.y),
            );
            _loc19_.nextAction = _loc20_;
            if (_loc8_) {
                _loc8_.nextAction = _loc19_;
            }
            _loc8_ = _loc20_;
            this._shapesUsed += _loc4_.shapesUsed;
            this._artUsed += _loc4_.artUsed;
            _loc10_ = _loc4_.parent;
            _loc9_ = _loc10_.getChildIndex(_loc4_);
            _loc6_ = _loc4_.deleteSelf(param2);
            if (_loc4_ instanceof RefShape) {
                this._shapeContainer.addChild(_loc4_);
            } else {
                if (!(_loc4_ instanceof Special)) {
                    throw Error(
                        "group child is not shape or special.  FUCK OFF",
                    );
                }
                this._specialContainer.addChild(_loc4_);
            }
            _loc7_ = new ActionGroup(
                _loc4_,
                _loc4_.group,
                this,
                _loc4_.parent,
                _loc4_.parent.getChildIndex(_loc4_),
            );
            _loc4_.group = this;
            _loc6_.nextAction = _loc7_;
            if (_loc8_) {
                _loc8_.nextAction = _loc6_.firstAction;
            }
            _loc8_ = _loc7_;
            _loc12_++;
        }
        if (this._shapesUsed == 0) {
            _loc7_ = new ActionProperty(
                this,
                "joinable",
                this._joinable,
                false,
            );
            if (_loc8_) {
                _loc8_.nextAction = _loc7_;
            }
            _loc8_ = _loc7_;
            this._joinable = false;
            _loc12_ = 0;
            while (_loc12_ < this._joints.length) {
                trace(this._joints.length);
                trace("shape deleting joint " + _loc12_);
                _loc21_ = this._joints[_loc12_];
                _loc7_ = _loc21_.removeBody(this);
                if (_loc8_) {
                    _loc8_.nextAction = _loc7_.firstAction;
                }
                _loc8_ = _loc7_;
                this.removeJoint(_loc21_);
                _loc12_ = --_loc12_ + 1;
            }
        } else {
            _loc7_ = new ActionProperty(this, "joinable", this._joinable, true);
            if (_loc8_) {
                _loc8_.nextAction = _loc7_;
            }
            this._joinable = true;
        }
        return _loc7_;
    }

    public breakApart(param1: any[], param2: Canvas): Action {
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        if (this.shapeContainer.numChildren > 0) {
            _loc3_ = this.breakContainer(this._shapeContainer, param1, param2);
            _loc4_ = _loc3_;
        }
        if (this.specialContainer.numChildren > 0) {
            _loc3_ = this.breakContainer(
                this._specialContainer,
                param1,
                param2,
            );
            if (_loc4_) {
                _loc4_.nextAction = _loc3_.firstAction;
            }
            _loc4_ = _loc3_;
        }
        return _loc4_;
    }

    private breakContainer(
        param1: DisplayObjectContainer,
        param2: any[],
        param3: Canvas,
    ): Action {
        var _loc5_: Point = null;
        var _loc6_: Point = null;
        var _loc7_: Action = null;
        var _loc8_: Action = null;
        var _loc9_: RefSprite = null;
        var _loc10_: number = NaN;
        var _loc11_: number = NaN;
        var _loc12_: ActionAdd = null;
        var _loc13_: ActionTranslateUnbound = null;
        var _loc14_: ActionRotateUnbound = null;
        var _loc15_: GroupCanvas = null;
        var _loc4_: number = this.rotation;
        while (param1.numChildren > 0) {
            _loc9_ = param1.getChildAt(0) as RefSprite;
            _loc5_ = new Point(_loc9_.x, _loc9_.y);
            _loc6_ = param1.localToGlobal(_loc5_.clone());
            _loc10_ = _loc9_.angle;
            _loc11_ = _loc10_ + _loc4_;
            param2.push(_loc9_);
            param1.removeChild(_loc9_);
            _loc7_ = new ActionUngroup(_loc9_, _loc9_.group, null, param1, 0);
            param3.addRefSprite(_loc9_);
            if (param3 instanceof GroupCanvas) {
                _loc9_.inGroup = true;
                _loc15_ = param3 as GroupCanvas;
                _loc9_.group = _loc15_.refGroup;
            } else {
                _loc9_.inGroup = false;
                _loc9_.group = null;
            }
            _loc12_ = new ActionAdd(
                _loc9_,
                param3,
                _loc9_.parent.getChildIndex(_loc9_),
            );
            _loc9_.xUnbound = _loc6_.x;
            _loc9_.yUnbound = _loc6_.y;
            _loc13_ = new ActionTranslateUnbound(
                _loc9_,
                _loc5_.clone(),
                _loc6_.clone(),
            );
            _loc9_.angleUnbound = _loc11_;
            _loc14_ = new ActionRotateUnbound(_loc9_, _loc10_);
            _loc14_.setEndAngle();
            if (_loc8_) {
                _loc8_.nextAction = _loc7_;
            }
            _loc7_.nextAction = _loc12_;
            _loc12_.nextAction = _loc13_;
            _loc13_.nextAction = _loc14_;
            _loc8_ = _loc14_;
        }
        return _loc8_;
    }

    public override get joinable(): boolean {
        if (this._immovable) {
            return false;
        }
        return this._joinable;
    }

    public get sleeping(): boolean {
        return this._sleeping;
    }

    public set sleeping(param1: boolean) {
        this._sleeping = param1;
    }

    public get foreground(): boolean {
        return this._foreground;
    }

    public set foreground(param1: boolean) {
        this._foreground = param1;
    }

    public get shapeContainer(): Sprite {
        return this._shapeContainer;
    }

    public get specialContainer(): Sprite {
        return this._specialContainer;
    }

    public get totalObjects(): number {
        return (
            this._shapeContainer.numChildren +
            this._specialContainer.numChildren
        );
    }

    public get offset(): Point {
        return this._offset;
    }

    public set offset(param1: Point) {
        this._offset = param1.clone();
        this._shapeContainer.x = this._specialContainer.x = this._offset.x;
        this._shapeContainer.y = this._specialContainer.y = this._offset.y;
    }

    public get opacity(): number {
        return Math.round(this._opacity * 100);
    }

    public set opacity(param1: number) {
        if (param1 < 0) {
            param1 = 0;
        }
        if (param1 > 100) {
            param1 = 100;
        }
        this._opacity = param1 * 0.01;
        this._shapeContainer.alpha = this._specialContainer.alpha =
            this._opacity;
    }

    public get immovable(): boolean {
        return this._immovable;
    }

    public set immovable(param1: boolean) {
        this._immovable = param1;
    }

    public get fixedRotation(): boolean {
        return this._fixedRotation;
    }

    public set fixedRotation(param1: boolean) {
        this._fixedRotation = param1;
    }

    public get vehiclePossible(): boolean {
        var _loc2_: RefShape = null;
        var _loc1_: number = 0;
        while (_loc1_ < this._shapeContainer.numChildren) {
            _loc2_ = this._shapeContainer.getChildAt(_loc1_) as RefShape;
            if (_loc2_.interactive) {
                return true;
            }
            _loc1_++;
        }
        return false;
    }

    public addShape(param1: RefShape) {
        this._shapesUsed += param1.shapesUsed;
        this._artUsed += param1.artUsed;
        this._shapeContainer.addChild(param1);
    }

    public addSpecial(param1: Special) {
        this._shapesUsed += param1.shapesUsed;
        this._artUsed += param1.artUsed;
        this._specialContainer.addChild(param1);
    }

    public override clone(): RefSprite {
        var _loc3_: RefSprite = null;
        var _loc4_: RefSprite = null;
        var _loc1_ = new RefGroup();
        _loc1_.offset = this.offset;
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.sleeping = this.sleeping;
        _loc1_.foreground = this.foreground;
        _loc1_.opacity = this.opacity;
        // @ts-expect-error
        _loc1_.joinable = this.joinable;
        _loc1_.immovable = this.immovable;
        _loc1_.fixedRotation = this.fixedRotation;
        var _loc2_: number = 0;
        while (_loc2_ < this._shapeContainer.numChildren) {
            _loc3_ = this._shapeContainer.getChildAt(_loc2_) as RefSprite;
            _loc4_ = _loc3_.clone();
            _loc4_.group = _loc1_;
            _loc4_.inGroup = true;
            _loc1_.addShape(_loc4_ as RefShape);
            _loc2_++;
        }
        _loc2_ = 0;
        while (_loc2_ < this._specialContainer.numChildren) {
            _loc3_ = this._specialContainer.getChildAt(_loc2_) as RefSprite;
            _loc4_ = _loc3_.clone();
            _loc4_.group = _loc1_;
            _loc4_.inGroup = true;
            _loc1_.addSpecial(_loc4_ as Special);
            _loc2_++;
        }
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public vehicleClone(): RefVehicle {
        var _loc3_: RefSprite = null;
        var _loc4_: RefSprite = null;
        var _loc1_ = new RefVehicle();
        _loc1_.offset = this.offset;
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.sleeping = this.sleeping;
        _loc1_.foreground = this.foreground;
        _loc1_.opacity = this.opacity;
        // @ts-expect-error
        _loc1_.joinable = this.joinable;
        var _loc2_: number = 0;
        while (_loc2_ < this._shapeContainer.numChildren) {
            _loc3_ = this._shapeContainer.getChildAt(_loc2_) as RefSprite;
            _loc4_ = _loc3_.clone();
            _loc4_.group = _loc1_;
            _loc4_.inGroup = true;
            _loc1_.addShape(_loc4_ as RefShape);
            _loc4_.setFilters();
            _loc2_++;
        }
        _loc2_ = 0;
        while (_loc2_ < this._specialContainer.numChildren) {
            _loc3_ = this._specialContainer.getChildAt(_loc2_) as RefSprite;
            _loc4_ = _loc3_.clone();
            _loc4_.group = _loc1_;
            _loc4_.inGroup = true;
            _loc1_.addSpecial(_loc4_ as Special);
            _loc2_++;
        }
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public override setProperty(param1: string, param2): Action {
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        var _loc9_ = 0;
        var _loc10_: RefJoint = null;
        if (param1 == "immovable" && param2 == true) {
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
}