import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol755")] */
@boundClass
export default class PinJoint extends RefJoint {
    protected _limit: boolean;
    protected _motor: boolean;
    protected _speed: number = 3;
    protected _torque: number = 50;
    protected _upperAngle: number = 90;
    protected _lowerAngle: number = -90;
    protected maxTorque: number = 100000;
    protected maxSpeed: number = 20;
    protected maxAngle: number = 180;

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
            ["newMotorSpeeds", "motorSpeedTimes"],
            null,
            null,
            ["newUpperAngles", "newLowerAngles"],
        ];

        this.name = "pin joint";
        this.triggerable = true;
        this._triggerString = "triggerActionsPinJoint";
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
    }

    public override setAttributes() {
        this._attributes = ["x", "y", "limit", "motor", "collideSelf"];
        if (this._vehicleAttached) {
            this._attributes.push("vehicleControlled");
        }
        this.addTriggerProperties();
    }

    public set limit(param1: boolean) {
        this._limit = param1;
    }

    public get limit(): boolean {
        return this._limit;
    }

    public set upperAngle(param1: number) {
        if (param1 > this.maxAngle) {
            param1 = this.maxAngle;
        }
        if (param1 < 0) {
            param1 = 0;
        }
        this._upperAngle = param1;
    }

    public get upperAngle(): number {
        return this._upperAngle;
    }

    public set lowerAngle(param1: number) {
        if (param1 > 0) {
            param1 = -param1;
        }
        if (param1 < -this.maxAngle) {
            param1 = -this.maxAngle;
        }
        this._lowerAngle = param1;
    }

    public get lowerAngle(): number {
        return this._lowerAngle;
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

    public set torque(param1: number) {
        if (param1 > this.maxTorque) {
            param1 = this.maxTorque;
        }
        this._torque = param1;
    }

    public get torque(): number {
        return this._torque;
    }

    public override clone(): RefSprite {
        var _loc1_: PinJoint = null;
        _loc1_ = new PinJoint();
        _loc1_.limit = this.limit;
        _loc1_.upperAngle = this.upperAngle;
        _loc1_.lowerAngle = this.lowerAngle;
        _loc1_.motor = this.motor;
        _loc1_.speed = this.speed;
        _loc1_.torque = this.torque;
        _loc1_.collideSelf = this.collideSelf;
        _loc1_.vehicleControlled = this.vehicleControlled;
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get triggerActionsPinJoint(): Dictionary<any, any> {
        return this._triggerActions;
    }
}