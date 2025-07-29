import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionDelete from "@/com/totaljerkface/game/editor/actions/ActionDelete";
import ActionProperty from "@/com/totaljerkface/game/editor/actions/ActionProperty";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import RefVehicle from "@/com/totaljerkface/game/editor/RefVehicle";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";
import Event from "flash/events/Event";
import Point from "flash/geom/Point";

@boundClass
export default class RefJoint extends RefSprite {
    protected _body1: RefSprite;
    protected _body2: RefSprite;
    protected _vehicleAttached: boolean;
    protected _vehicleControlled: boolean = true;
    protected _collideSelf: boolean;

    constructor() {
        super();
        this.rotatable = false;
        this.scalable = false;
    }

    public identifyBodies() {
        var _loc5_: boolean = false;
        var _loc6_: boolean = false;
        var _loc8_: DisplayObject = null;
        var _loc9_: RefSprite = null;
        trace("identify");
        var _loc1_: Canvas = this.parent.parent as Canvas;
        var _loc2_: DisplayObjectContainer = _loc1_.parent;
        var _loc3_: Point = _loc2_.localToGlobal(new Point(this.x, this.y));
        var _loc4_: any[] = _loc2_.getObjectsUnderPoint(_loc3_);
        trace("objects under joint" + _loc4_.length);
        _loc4_.reverse();
        var _loc7_: number = 0;
        while (_loc7_ < _loc4_.length) {
            _loc8_ = _loc4_[_loc7_];
            if (!(_loc8_ == _loc1_ || _loc8_ == _loc2_)) {
                while (_loc8_.parent.parent != _loc1_) {
                    _loc8_ = _loc8_.parent;
                }
                if (_loc8_ instanceof RefSprite) {
                    _loc9_ = _loc8_ as RefSprite;
                    if (_loc9_.joinable) {
                        if (!_loc5_) {
                            this._body1 = _loc9_;
                            _loc5_ = true;
                            this._body1.addEventListener(
                                RefSprite.COORDINATE_CHANGE,
                                this.bodyMoved,
                                false,
                                0,
                                true,
                            );
                            _loc9_.addJoint(this);
                        } else if (_loc9_ != this._body1) {
                            this._body2 = _loc9_;
                            _loc6_ = true;
                            this._body2.addEventListener(
                                RefSprite.COORDINATE_CHANGE,
                                this.bodyMoved,
                                false,
                                0,
                                true,
                            );
                            _loc9_.addJoint(this);
                            break;
                        }
                    }
                }
            }
            _loc7_++;
        }
        if (!_loc5_) {
            this.deleteSelf(_loc1_);
            return;
        }
        if (!_loc6_) {
            this._body2 = null;
        }
        this._vehicleAttached =
            this._body1 instanceof RefVehicle ||
                this._body2 instanceof RefVehicle
                ? true
                : false;
        this.setAttributes();
        this.drawArms();
    }

    public drawArms() {
        this.graphics.clear();
        this.graphics.lineStyle(0, 16737792);
        if (this._body1) {
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(this.body1.x - this.x, this.body1.y - this.y);
        }
        if (this.body2) {
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(this.body2.x - this.x, this.body2.y - this.y);
        }
        if (this.selected) {
            this.drawBoundingBox();
        }
    }

    protected bodyMoved(param1: Event) {
        this.drawArms();
    }

    private bodyDeleted(param1: Event) {
        trace("body deleted");
        if (param1.target == this.body1) {
            this._body1.removeEventListener(
                RefSprite.COORDINATE_CHANGE,
                this.bodyMoved,
            );
            this._body1 = null;
            if (!this.body2) {
                this.deleteSelf(this.parent.parent as Canvas);
                return;
            }
            this._body1 = this._body2;
            this._body2 = null;
        }
        if (param1.target == this.body2) {
            this._body2.removeEventListener(
                RefSprite.COORDINATE_CHANGE,
                this.bodyMoved,
            );
            this._body2 = null;
        }
        this.drawArms();
    }

    public override deleteSelf(param1: Canvas): Action {
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        var _loc5_ = 0;
        var _loc6_: RefTrigger = null;
        var _loc2_ = new Point(this.x, this.y);
        if (this._body1) {
            _loc3_ = new ActionProperty(
                this,
                "body1",
                this._body1,
                null,
                _loc2_,
                _loc2_,
            );
            _loc4_ = _loc3_;
            this._body1.removeEventListener(
                RefSprite.COORDINATE_CHANGE,
                this.bodyMoved,
            );
            this._body1.removeJoint(this);
            this._body1 = null;
        }
        if (this._body2) {
            _loc3_ = new ActionProperty(
                this,
                "body2",
                this._body2,
                null,
                _loc2_,
                _loc2_,
            );
            if (_loc4_) {
                _loc4_.nextAction = _loc3_;
            }
            _loc4_ = _loc3_;
            this._body2.removeEventListener(
                RefSprite.COORDINATE_CHANGE,
                this.bodyMoved,
            );
            this._body2.removeJoint(this);
            this._body2 = null;
        }
        if (this._triggers) {
            _loc5_ = 0;
            while (_loc5_ < this._triggers.length) {
                _loc6_ = this._triggers[_loc5_];
                _loc3_ = _loc6_.removeTarget(this);
                if (_loc4_) {
                    _loc4_.nextAction = _loc3_.firstAction;
                }
                _loc4_ = _loc3_;
                this.removeTrigger(_loc6_);
                _loc5_ = --_loc5_ + 1;
            }
        }
        if (this.parent) {
            _loc3_ = new ActionDelete(
                this,
                param1,
                this.parent.getChildIndex(this),
            );
            if (_loc4_) {
                _loc4_.nextAction = _loc3_;
            }
            param1.removeRefSprite(this);
            return _loc3_;
        }
        return null;
    }

    public removeBody(param1: RefSprite): Action {
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        trace("REMOVE BODY " + param1);
        var _loc2_ = new Point(this.x, this.y);
        if (param1 == this._body1) {
            trace("body 1 " + param1);
            _loc3_ = new ActionProperty(
                this,
                "body1",
                this._body1,
                null,
                _loc2_,
                _loc2_,
            );
            this._body1 = null;
        } else {
            if (param1 != this._body2) {
                throw new Error("body not contained in this joint");
            }
            trace("body 2 " + param1);
            _loc3_ = new ActionProperty(
                this,
                "body2",
                this._body2,
                null,
                _loc2_,
                _loc2_,
            );
            this._body2 = null;
        }
        if (this._body1 == null && this._body2 == null) {
            trace("BOTH NULL");
            _loc4_ = _loc3_;
            _loc3_ = this.deleteSelf(this.parent.parent as Canvas);
            _loc4_.nextAction = _loc3_;
        } else {
            this.drawArms();
        }
        this._vehicleAttached =
            this._body1 instanceof RefVehicle ||
                this._body2 instanceof RefVehicle
                ? true
                : false;
        this.setAttributes();
        return _loc3_;
    }

    public get body1(): RefSprite {
        return this._body1;
    }

    public set body1(param1: RefSprite) {
        if (this._body1) {
            this._body1.removeEventListener(
                RefSprite.COORDINATE_CHANGE,
                this.bodyMoved,
            );
            this._body1.removeJoint(this);
        }
        if (param1 == null) {
            this._body1 = null;
            return;
        }
        this._body1 = param1;
        this._vehicleAttached =
            this._body1 instanceof RefVehicle ||
                this._body2 instanceof RefVehicle
                ? true
                : false;
        this.setAttributes();
        if (this.stage == null) {
            return;
        }
        param1.addEventListener(
            RefSprite.COORDINATE_CHANGE,
            this.bodyMoved,
            false,
            0,
            true,
        );
        param1.addJoint(this);
    }

    public get body2(): RefSprite {
        return this._body2;
    }

    public set body2(param1: RefSprite) {
        if (this._body2) {
            this._body2.removeEventListener(
                RefSprite.COORDINATE_CHANGE,
                this.bodyMoved,
            );
            this._body2.removeJoint(this);
        }
        if (param1 == null) {
            this._body2 = null;
            return;
        }
        this._body2 = param1;
        this._vehicleAttached =
            this._body1 instanceof RefVehicle ||
                this._body2 instanceof RefVehicle
                ? true
                : false;
        this.setAttributes();
        if (this.stage == null) {
            return;
        }
        param1.addEventListener(
            RefSprite.COORDINATE_CHANGE,
            this.bodyMoved,
            false,
            0,
            true,
        );
        param1.addJoint(this);
    }

    public override set x(param1: number) {
        super.x = param1;
        this.drawArms();
    }

    public override set y(param1: number) {
        super.y = param1;
        this.drawArms();
    }

    public get collideSelf(): boolean {
        return this._collideSelf;
    }

    public set collideSelf(param1: boolean) {
        this._collideSelf = param1;
    }

    public get vehicleAttached(): boolean {
        return this._vehicleAttached;
    }

    public get vehicleControlled(): boolean {
        return this._vehicleControlled;
    }

    public set vehicleControlled(param1: boolean) {
        this._vehicleControlled = param1;
    }
}