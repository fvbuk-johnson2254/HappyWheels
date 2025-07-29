import b2World from "@/Box2D/Dynamics/b2World";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class TargetActionRevJoint extends LevelItem {
    protected _refSprite: RefSprite;
    protected _joint: b2RevoluteJoint;
    protected _action: string;
    protected _properties: any[];
    protected _instant: boolean;
    protected counter: number = 0;

    constructor(
        param1: RefSprite,
        param2: b2RevoluteJoint,
        param3: string,
        param4: any[],
    ) {
        super();
        this._refSprite = param1;
        this._joint = param2;
        this._action = param3;
        this._instant = param3 == "change motor speed" ? false : true;
        this._properties = param4;
    }

    public override singleAction() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: b2World = null;
        switch (this._action) {
            case "disable limits":
                if (this._joint) {
                    if (this._joint.m_body1.IsSleeping()) {
                        this._joint.m_body1.WakeUp();
                    }
                    if (this._joint.m_body2.IsSleeping()) {
                        this._joint.m_body2.WakeUp();
                    }
                    this._joint.EnableLimit(false);
                }
                break;
            case "change limits":
                if (this._joint) {
                    if (this._joint.m_body1.IsSleeping()) {
                        this._joint.m_body1.WakeUp();
                    }
                    if (this._joint.m_body2.IsSleeping()) {
                        this._joint.m_body2.WakeUp();
                    }
                    _loc1_ = (this._properties[0] * Math.PI) / 180;
                    _loc2_ = (this._properties[1] * Math.PI) / 180;
                    this._joint.SetLimits(_loc2_, _loc1_);
                    if (Settings.currentSession.levelVersion > 1.84) {
                        this._joint.EnableLimit(true);
                    }
                }
                break;
            case "disable motor":
                if (this._joint) {
                    this._joint.EnableMotor(false);
                    if (this._joint.m_body1.IsSleeping()) {
                        this._joint.m_body1.WakeUp();
                    }
                    if (this._joint.m_body2.IsSleeping()) {
                        this._joint.m_body2.WakeUp();
                    }
                }
                break;
            case "delete self":
                if (this._joint) {
                    _loc3_ = Settings.currentSession.m_world;
                    _loc3_.DestroyJoint(this._joint);
                    this._joint = null;
                }
        }
    }

    public override actions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        switch (this._action) {
            case "change motor speed":
                if (this._joint) {
                    if (this._joint.m_body1.IsSleeping()) {
                        this._joint.m_body1.WakeUp();
                    }
                    if (this._joint.m_body2.IsSleeping()) {
                        this._joint.m_body2.WakeUp();
                    }
                    if (!this._joint.IsMotorEnabled()) {
                        this._joint.EnableMotor(true);
                    }
                    _loc1_ = Number(this._properties[0]);
                    _loc2_ = Number(this._properties[1]);
                    _loc2_ = Math.round(_loc2_ * 30);
                    if (this.counter == _loc2_) {
                        if (Settings.currentSession.levelVersion > 1.8) {
                            this.counter = 0;
                        }
                        this._joint.SetMotorSpeed(_loc1_);
                        Settings.currentSession.level.removeFromActionsVector(
                            this,
                        );
                        return;
                    }
                    _loc3_ = this._joint.GetMotorSpeed();
                    _loc4_ = _loc1_ - _loc3_;
                    this._joint.SetMotorSpeed(
                        _loc3_ + _loc4_ / (_loc2_ - this.counter),
                    );
                }
        }
        this.counter += 1;
    }

    public get joint(): b2RevoluteJoint {
        return this._joint;
    }

    public set joint(param1: b2RevoluteJoint) {
        this._joint = param1;
    }

    public get instant(): boolean {
        return this._instant;
    }
}