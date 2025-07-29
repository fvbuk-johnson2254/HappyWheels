import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Sprite from "flash/display/Sprite";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol751")] */
@boundClass
export default class PrisJoint extends RefJoint {
    public inner: Sprite;
    protected _axisAngle: number;
    protected _limit: boolean;
    protected _motor: boolean;
    protected _speed: number = 3;
    protected _force: number = 50;
    protected _upperLimit: number = 100;
    protected _lowerLimit: number = -100;
    protected maxForce: number = 100000;
    protected maxSpeed: number = 50;
    protected maxLimit: number = 8000;

    constructor() {
        super();
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = [
            "disable motor",
            "change motor speed",
            "delete self",
            "disable limits",
            "change limits",
        ];
        this._triggerActionListProperties = [
            null,
            ["newMotorSpeedsPris", "motorSpeedTimes"],
            null,
            null,
            ["newUpperLimits", "newLowerLimits"],
        ];

        this.name = "sliding joint";
        this.triggerable = true;
        this._triggerString = "triggerActionsPrisJoint";
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this.axisAngle = 90;
    }

    public override setAttributes() {
        this._attributes = [
            "x",
            "y",
            "axisAngle",
            "limitPris",
            "motorPris",
            "collideSelf",
        ];
        if (this._vehicleAttached) {
            this._attributes.push("vehicleControlled");
        }
        this.addTriggerProperties();
    }

    public override drawArms() {
        var _loc1_: b2Vec2 = null;
        var _loc2_: b2Vec2 = null;
        var _loc3_: b2Mat22 = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: number = NaN;
        var _loc6_: b2Vec2 = null;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        var _loc9_: number = NaN;
        var _loc10_: number = 0;
        var _loc11_: number = NaN;
        var _loc12_: number = NaN;
        var _loc13_: number = NaN;
        var _loc14_: b2Vec2 = null;
        var _loc15_: b2Vec2 = null;
        var _loc16_: number = 0;
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
        if (this._limit) {
            this.graphics.lineStyle(0, 16737792, 0.7);
            _loc1_ = new b2Vec2(-this._lowerLimit, 0);
            _loc2_ = new b2Vec2(-this._upperLimit, 0);
            _loc3_ = new b2Mat22((this.axisAngle * Math.PI) / 180);
            _loc1_.MulM(_loc3_);
            _loc2_.MulM(_loc3_);
            _loc4_ = new b2Vec2(_loc2_.x - _loc1_.x, _loc2_.y - _loc1_.y);
            _loc5_ = _loc4_.Length();
            _loc6_ = new b2Vec2(_loc4_.x / _loc5_, _loc4_.y / _loc5_);
            _loc7_ = 6;
            _loc8_ = 6;
            _loc9_ = (_loc5_ - _loc7_) / (_loc7_ + _loc8_);
            _loc10_ = Math.ceil(_loc9_);
            _loc11_ = _loc9_ / _loc10_;
            _loc7_ *= _loc11_;
            _loc8_ *= _loc11_;
            _loc10_++;
            _loc12_ = _loc1_.x;
            _loc13_ = _loc1_.y;
            _loc14_ = new b2Vec2(-25, 0);
            _loc15_ = new b2Vec2(25 + _loc7_, 0);
            if (this.axisAngle < -90 || this._axisAngle > 90) {
                _loc14_.x = _loc15_.x;
                _loc15_.x = -25;
            }
            _loc14_.MulM(_loc3_);
            _loc15_.MulM(_loc3_);
            _loc16_ = 0;
            while (_loc16_ < _loc10_) {
                if (_loc12_ < _loc14_.x || _loc12_ > _loc15_.x) {
                    this.graphics.moveTo(_loc12_, _loc13_);
                    this.graphics.lineTo(
                        _loc12_ + _loc6_.x * _loc7_,
                        _loc13_ + _loc6_.y * _loc7_,
                    );
                }
                _loc12_ += _loc6_.x * (_loc7_ + _loc8_);
                _loc13_ += _loc6_.y * (_loc7_ + _loc8_);
                _loc16_++;
            }
            this.graphics.moveTo(
                _loc1_.x - _loc6_.y * 10,
                _loc1_.y + _loc6_.x * 10,
            );
            this.graphics.lineTo(
                _loc1_.x + _loc6_.y * 10,
                _loc1_.y - _loc6_.x * 10,
            );
            this.graphics.moveTo(
                _loc2_.x - _loc6_.y * 10,
                _loc2_.y + _loc6_.x * 10,
            );
            this.graphics.lineTo(
                _loc2_.x + _loc6_.y * 10,
                _loc2_.y - _loc6_.x * 10,
            );
        }
        if (this.selected) {
            this.drawBoundingBox();
        }
    }

    public get axisAngle(): number {
        return this._axisAngle;
    }

    public set axisAngle(param1: number) {
        if (param1 > 180) {
            param1 = 180;
        }
        if (param1 < -180) {
            param1 = -180;
        }
        this._axisAngle = param1;
        this.inner.rotation = this._axisAngle;
        this.drawArms();
    }

    public set limit(param1: boolean) {
        this._limit = param1;
        this.drawArms();
    }

    public get limit(): boolean {
        return this._limit;
    }

    public set upperLimit(param1: number) {
        if (param1 > this.maxLimit) {
            param1 = this.maxLimit;
        }
        if (param1 < 0) {
            param1 = 0;
        }
        this._upperLimit = param1;
        this.drawArms();
    }

    public get upperLimit(): number {
        return this._upperLimit;
    }

    public set lowerLimit(param1: number) {
        if (param1 > 0) {
            param1 = -param1;
        }
        if (param1 < -this.maxLimit) {
            param1 = -this.maxLimit;
        }
        this._lowerLimit = param1;
        this.drawArms();
    }

    public get lowerLimit(): number {
        return this._lowerLimit;
    }

    public set motor(param1: boolean) {
        this._motor = param1;
    }

    public get motor(): boolean {
        return this._motor;
    }

    public set speed(param1: number) {
        if (param1 > this.maxSpeed) {
            param1 = this.maxSpeed;
        }
        if (param1 < -this.maxSpeed) {
            param1 = -this.maxSpeed;
        }
        this._speed = param1;
    }

    public get speed(): number {
        return this._speed;
    }

    public set force(param1: number) {
        if (param1 > this.maxForce) {
            param1 = this.maxForce;
        }
        this._force = param1;
    }

    public get force(): number {
        return this._force;
    }

    public override clone(): RefSprite {
        var _loc1_ = new PrisJoint();
        _loc1_.axisAngle = this.axisAngle;
        _loc1_.limit = this.limit;
        _loc1_.upperLimit = this.upperLimit;
        _loc1_.lowerLimit = this.lowerLimit;
        _loc1_.motor = this.motor;
        _loc1_.speed = this.speed;
        _loc1_.force = this.force;
        _loc1_.collideSelf = this.collideSelf;
        _loc1_.vehicleControlled = this.vehicleControlled;
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get triggerActionsPrisJoint(): Dictionary<any, any> {
        return this._triggerActions;
    }
}