import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionDelete from "@/com/totaljerkface/game/editor/actions/ActionDelete";
import ActionKeyedProperty from "@/com/totaljerkface/game/editor/actions/ActionKeyedProperty";
import ActionProperty from "@/com/totaljerkface/game/editor/actions/ActionProperty";
import AttributeReference from "@/com/totaljerkface/game/editor/AttributeReference";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import GroupCanvas from "@/com/totaljerkface/game/editor/GroupCanvas";
import RefGroup from "@/com/totaljerkface/game/editor/RefGroup";
import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import Point from "flash/geom/Point";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class RefSprite extends MovieClip {
    public static COORDINATE_CHANGE: string;
    protected _selected: boolean;
    protected boundingBox: Sprite;
    protected _deletable: boolean = true;
    protected _cloneable: boolean = true;
    protected _rotatable: boolean = true;
    protected _scalable: boolean = true;
    protected _joinable: boolean = false;
    protected _groupable: boolean = false;
    protected _inGroup: boolean = false;
    protected _triggerable: boolean = false;
    protected _attributes: any[];
    protected _joints: any[];
    protected _triggers: any[];
    protected _triggerActionList: any[];
    protected _triggerActionListProperties: any[];
    protected _triggerActions: Dictionary<any, any>;
    protected _triggerString: string;
    protected _keyedPropertyObject: {};
    protected _shapesUsed: number = 0;
    protected _artUsed: number = 0;
    protected _group: RefGroup;

    constructor() {
        super();
        this.boundingBox = new Sprite();
        this.addChild(this.boundingBox);
        this.mouseChildren = false;
        this._keyedPropertyObject = new Object();
        this.setAttributes();
    }

    public setAttributes() {
        this._attributes = ["x", "y"];
    }

    public get attributes(): any[] {
        return this._attributes;
    }

    public get functions(): any[] {
        if (this.groupable) {
            return ["groupSelected"];
        }
        return new Array();
    }

    public getFullProperties(): any[] {
        return this._attributes;
    }

    protected addTriggerProperties() {
        var _loc2_: RefTrigger = null;
        var _loc3_: any[] = null;
        var _loc4_: number = 0;
        var _loc5_: string = null;
        var _loc6_: number = 0;
        var _loc7_: any[] = null;
        var _loc8_: number = 0;
        var _loc9_: string = null;
        var _loc10_: Dictionary<any, any> = null;
        var _loc11_: any[] = null;
        var _loc1_: number = 0;
        while (_loc1_ < this._triggers.length) {
            _loc2_ = this._triggers[_loc1_];
            if (_loc2_.typeIndex == 1) {
                _loc3_ = this._triggerActions.get(_loc2_);
                if (!_loc3_) {
                    _loc3_ = this._triggerActions.set(_loc2_, new Array());
                    _loc3_.push(this._triggerActionList[0]);
                }
                _loc4_ = 0;
                while (_loc4_ < _loc3_.length) {
                    this._attributes.push([
                        this._triggerString,
                        _loc2_,
                        _loc4_,
                    ]);
                    _loc5_ = _loc3_[_loc4_];
                    _loc6_ = int(this.triggerActionList.indexOf(_loc5_));
                    _loc7_ = this.triggerActionListProperties[_loc6_];
                    if (_loc7_) {
                        _loc8_ = 0;
                        while (_loc8_ < _loc7_.length) {
                            _loc9_ = _loc7_[_loc8_];
                            _loc10_ = this._keyedPropertyObject[_loc9_];
                            if (!_loc10_) {
                                _loc10_ = this._keyedPropertyObject[_loc9_] =
                                    new Dictionary();
                            }
                            _loc11_ = _loc10_.get(_loc2_);
                            if (!_loc11_) {
                                _loc11_ = _loc10_.set(_loc2_, new Array());
                            }
                            if (!_loc11_[_loc4_]) {
                                _loc11_[_loc4_] =
                                    AttributeReference.getDefaultValue(_loc9_);
                            }
                            this._attributes.push([_loc9_, _loc2_, _loc4_]);
                            _loc8_++;
                        }
                    }
                    _loc4_++;
                }
            }
            _loc1_++;
        }
    }

    public get shapesUsed(): number {
        return this._shapesUsed;
    }

    public get artUsed(): number {
        return this._artUsed;
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(param1: boolean) {
        this._selected = param1;
        if (param1) {
            this.drawBoundingBox();
            this.alpha = 0.8;
        } else {
            this.clearBoundingBox();
            this.alpha = 1;
        }
    }

    public get deletable(): boolean {
        return this._deletable;
    }

    public set deletable(param1: boolean) {
        this._deletable = param1;
    }

    public get cloneable(): boolean {
        return this._cloneable;
    }

    public set cloneable(param1: boolean) {
        this._cloneable = param1;
    }

    public get rotatable(): boolean {
        return this._rotatable;
    }

    public set rotatable(param1: boolean) {
        this._rotatable = param1;
    }

    public get scalable(): boolean {
        return this._scalable;
    }

    public set scalable(param1: boolean) {
        this._scalable = param1;
    }

    public get joinable(): boolean {
        return this._joinable;
    }

    public set joinable(param1: boolean) {
        this._joinable = param1;
    }

    public get group(): RefGroup {
        return this._group;
    }

    public set group(param1: RefGroup) {
        this._group = param1;
    }

    public get groupable(): boolean {
        return this._groupable;
    }

    public set groupable(param1: boolean) {
        this._groupable = param1;
    }

    public get inGroup(): boolean {
        return this._inGroup;
    }

    public set inGroup(param1: boolean) {
        this._inGroup = param1;
    }

    public get triggerable(): boolean {
        return this._triggerable;
    }

    public set triggerable(param1: boolean) {
        this._triggerable = param1;
    }

    public get joints(): any[] {
        return this._joints;
    }

    public get triggers(): any[] {
        return this._triggers;
    }

    public get triggerActions(): Dictionary<any, any> {
        return this._triggerActions;
    }

    public get triggerActionList(): any[] {
        return this._triggerActionList;
    }

    public get triggerActionListProperties(): any[] {
        return this._triggerActionListProperties;
    }

    public addJoint(param1: RefJoint) {
        this._joints.push(param1);
    }

    public addTrigger(param1: RefTrigger) {
        var _loc5_: RefTrigger = null;
        var _loc6_: number = 0;
        var _loc2_ = int(this._triggers.length);
        var _loc3_: number = param1.parent.getChildIndex(param1);
        var _loc4_: number = 0;
        while (_loc4_ < _loc2_) {
            _loc5_ = this._triggers[_loc4_];
            _loc6_ = _loc5_.parent.getChildIndex(_loc5_);
            if (_loc6_ > _loc3_) {
                this._triggers.splice(_loc4_, 0, param1);
                this.setAttributes();
                return;
            }
            _loc4_++;
        }
        this._triggers.push(param1);
        this.setAttributes();
    }

    public removeJoint(param1: RefJoint) {
        var _loc2_ = int(this._joints.indexOf(param1));
        this._joints.splice(_loc2_, 1);
        if (_loc2_ < 0) {
            throw new Error("FUCK YOU joint not found");
        }
    }

    public removeTrigger(param1: RefTrigger) {
        var _loc2_ = int(this._triggers.indexOf(param1));
        this._triggers.splice(_loc2_, 1);
        if (_loc2_ < 0) {
            throw new Error("FUCK YOU trigger not found");
        }
        this.setAttributes();
    }

    public drawBoundingBox() {
        this.boundingBox.graphics.clear();
        var _loc1_: Rectangle = this.getBounds(this);
        var _loc2_: number = this.doubleClickEnabled ? 52223 : 0;
        this.boundingBox.graphics.lineStyle(0, _loc2_, 1, true);
        this.boundingBox.graphics.drawRect(
            _loc1_.x,
            _loc1_.y,
            _loc1_.width,
            _loc1_.height,
        );
    }

    public clearBoundingBox() {
        this.boundingBox.graphics.clear();
    }

    public deleteSelf(param1: Canvas): Action {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc4_ = 0;
        var _loc5_: RefJoint = null;
        var _loc6_: RefTrigger = null;
        if (this.deletable && Boolean(this.parent)) {
            if (this._joints) {
                _loc4_ = 0;
                while (_loc4_ < this._joints.length) {
                    _loc5_ = this._joints[_loc4_];
                    _loc2_ = _loc5_.removeBody(this);
                    if (_loc3_) {
                        _loc3_.nextAction = _loc2_.firstAction;
                    }
                    _loc3_ = _loc2_;
                    this.removeJoint(_loc5_);
                    _loc4_ = --_loc4_ + 1;
                }
            }
            if (this._triggers) {
                _loc4_ = 0;
                while (_loc4_ < this._triggers.length) {
                    _loc6_ = this._triggers[_loc4_];
                    _loc2_ = _loc6_.removeTarget(this);
                    if (_loc3_) {
                        _loc3_.nextAction = _loc2_.firstAction;
                    }
                    _loc3_ = _loc2_;
                    this.removeTrigger(_loc6_);
                    _loc4_ = --_loc4_ + 1;
                }
            }
            _loc2_ = new ActionDelete(
                this,
                param1,
                this.parent.getChildIndex(this),
            );
            if (_loc3_) {
                _loc3_.nextAction = _loc2_;
            }
            param1.removeRefSprite(this);
            if (param1 instanceof GroupCanvas) {
                this.inGroup = false;
            }
            return _loc2_;
        }
        return null;
    }

    public clone(): RefSprite {
        return null;
    }

    public transferKeyedProperties(param1: RefSprite) {
        var _loc2_: string = null;
        var _loc3_: Dictionary<any, any> = null;
        var _loc4_: any[] = null;
        var _loc5_: any[] = null;
        var _loc6_: Dictionary<any, any> = null;
        var _loc7_ = undefined;
        var _loc8_: number = 0;
        var _loc9_: number = 0;
        for (_loc2_ in this._keyedPropertyObject) {
            _loc3_ = this._keyedPropertyObject[_loc2_];
            if (_loc3_) {
                _loc6_ = param1.keyedPropertyObject[_loc2_];
                if (!_loc6_) {
                    _loc6_ = param1.keyedPropertyObject[_loc2_] = new Dictionary();
                }
                for (_loc7_ of _loc3_.keys()) {
                    _loc4_ = _loc3_[_loc7_];
                    _loc5_ = new Array();
                    _loc8_ = int(_loc4_.length);
                    _loc9_ = 0;
                    while (_loc9_ < _loc8_) {
                        _loc5_.push(_loc4_[_loc9_]);
                        _loc9_++;
                    }
                    _loc6_[_loc7_] = _loc5_;
                }
            }
        }
    }

    // @ts-expect-error
    public override set x(param1: number) {
        var _loc3_: number = NaN;
        // @ts-expect-error
        super.x = param1;
        if (!this.parent) {
            return;
        }
        var _loc2_: Rectangle = this.getBounds(this.parent);
        if (_loc2_.x < 0) {
            _loc3_ = 0 - _loc2_.x;
            param1 += _loc3_;
        } else if (_loc2_.x + _loc2_.width > Canvas.canvasWidth) {
            _loc3_ = Canvas.canvasWidth - (_loc2_.x + _loc2_.width);
            param1 += _loc3_;
        }
        // @ts-expect-error
        super.x = param1;
        if (this._joinable || this._triggerable) {
            this.dispatchEvent(new Event(RefSprite.COORDINATE_CHANGE));
        }
    }

    // @ts-expect-error
    public override set y(param1: number) {
        var _loc3_: number = NaN;
        // @ts-expect-error
        super.y = param1;
        if (!this.parent) {
            return;
        }
        var _loc2_: Rectangle = this.getBounds(this.parent);
        if (_loc2_.y < 0) {
            _loc3_ = 0 - _loc2_.y;
            param1 += _loc3_;
        } else if (_loc2_.y + _loc2_.height > Canvas.canvasHeight) {
            _loc3_ = Canvas.canvasHeight - (_loc2_.y + _loc2_.height);
            param1 += _loc3_;
        }
        // @ts-expect-error
        super.y = param1;
        if (this._joinable || this._triggerable) {
            this.dispatchEvent(new Event(RefSprite.COORDINATE_CHANGE));
        }
    }

    public set xUnbound(param1: number) {
        // @ts-expect-error
        super.x = param1;
    }

    public set yUnbound(param1: number) {
        // @ts-expect-error
        super.y = param1;
    }

    public set angleUnbound(param1: number) {
        this.rotation = param1;
    }

    // @ts-expect-error
    public override set scaleX(param1: number) {
        // @ts-expect-error
        super.scaleX = param1;
        this.x = this.x;
        this.y = this.y;
    }

    // @ts-expect-error
    public override set scaleY(param1: number) {
        // @ts-expect-error
        super.scaleY = param1;
        this.x = this.x;
        this.y = this.y;
    }

    public get angle(): number {
        return this.rotation;
    }

    public set angle(param1: number) {
        this.rotation = param1;
        this.x = this.x;
        this.y = this.y;
    }

    public get shapeWidth(): number {
        return Math.round(this.scaleX * 100);
    }

    public set shapeWidth(param1: number) {
        this.scaleX = param1 / 100;
    }

    public get shapeHeight(): number {
        return Math.round(this.scaleY * 100);
    }

    public set shapeHeight(param1: number) {
        this.scaleY = param1 / 100;
    }

    public setFilters() { }

    public checkVehicleAttached(param1: any[] = null): boolean {
        var _loc3_: RefJoint = null;
        var _loc4_: number = 0;
        var _loc5_: RefSprite = null;
        var _loc6_: RefSprite = null;
        if (!this.joints) {
            return false;
        }
        if (!param1) {
            param1 = new Array();
        }
        var _loc2_: number = 0;
        while (_loc2_ < this.joints.length) {
            _loc3_ = this.joints[_loc2_];
            _loc4_ = int(param1.indexOf(_loc3_));
            if (_loc4_ < 0) {
                param1.push(_loc3_);
                _loc5_ = _loc3_.body1;
                if (Boolean(_loc5_) && this != _loc5_) {
                    if (_loc5_.checkVehicleAttached(param1)) {
                        return true;
                    }
                }
                _loc6_ = _loc3_.body2;
                if (Boolean(_loc6_) && this != _loc6_) {
                    if (_loc6_.checkVehicleAttached(param1)) {
                        return true;
                    }
                }
            }
            _loc2_++;
        }
        return false;
    }

    public setProperty(param1: string, param2): Action {
        var _loc3_: Action = null;
        var _loc4_ = this[param1];
        var _loc5_ = new Point(this.x, this.y);
        this[param1] = param2;
        var _loc6_ = this[param1];
        var _loc7_ = new Point(this.x, this.y);
        if (_loc6_ != _loc4_) {
            _loc3_ = new ActionProperty(
                this,
                param1,
                _loc4_,
                _loc6_,
                _loc5_,
                _loc7_,
            );
        }
        return _loc3_;
    }

    public setKeyedProperty(
        param1: string,
        param2: {},
        param3: number,
        param4,
    ): Action {
        var _loc5_: Action = null;
        trace("SET Keyed PROPERTY " + param2 + " " + param3 + " " + param4);
        var _loc6_ = this._keyedPropertyObject[param1][param2][param3];
        trace("startVal " + _loc6_);
        trace("value " + param4);
        this._keyedPropertyObject[param1][param2][param3] = param4;
        var _loc7_ = this._keyedPropertyObject[param1][param2][param3];
        trace("array " + this._keyedPropertyObject[param1][param2]);
        if (_loc7_ != _loc6_) {
            _loc5_ = new ActionKeyedProperty(
                this,
                param1,
                _loc6_,
                _loc7_,
                param2,
                param3,
            );
        }
        this.setAttributes();
        return _loc5_;
    }

    public get keyedPropertyObject(): {} {
        return this._keyedPropertyObject;
    }

    public get triggerString(): string {
        return this._triggerString;
    }
}