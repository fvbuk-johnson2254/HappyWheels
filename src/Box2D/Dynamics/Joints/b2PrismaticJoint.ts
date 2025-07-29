import b2Settings from "@/Box2D/Common/b2Settings";
import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2TimeStep from "@/Box2D/Dynamics/b2TimeStep";
import b2Jacobian from "@/Box2D/Dynamics/Joints/b2Jacobian";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";

export default class b2PrismaticJoint extends b2Joint {
    public m_localAnchor1: b2Vec2;
    public m_localAnchor2: b2Vec2;
    public m_localXAxis1: b2Vec2;
    public m_localYAxis1: b2Vec2;
    public m_refAngle: number;
    public m_linearJacobian: b2Jacobian;
    public m_linearMass: number;
    public m_force: number;
    public m_angularMass: number;
    public m_torque: number;
    public m_motorJacobian: b2Jacobian;
    public m_motorMass: number;
    public m_motorForce: number;
    public m_limitForce: number;
    public m_limitPositionImpulse: number;
    public m_lowerTranslation: number;
    public m_upperTranslation: number;
    public m_maxMotorForce: number;
    public m_motorSpeed: number;
    public m_enableLimit: boolean;
    public m_enableMotor: boolean;
    public m_limitState: number;

    constructor(param1: b2PrismaticJointDef) {
        super(param1);
        var _loc2_: b2Mat22 = null;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        this.m_localAnchor1 = new b2Vec2();
        this.m_localAnchor2 = new b2Vec2();
        this.m_localXAxis1 = new b2Vec2();
        this.m_localYAxis1 = new b2Vec2();
        this.m_linearJacobian = new b2Jacobian();
        this.m_motorJacobian = new b2Jacobian();
        this.m_localAnchor1.SetV(param1.localAnchor1);
        this.m_localAnchor2.SetV(param1.localAnchor2);
        this.m_localXAxis1.SetV(param1.localAxis1);
        this.m_localYAxis1.x = -this.m_localXAxis1.y;
        this.m_localYAxis1.y = this.m_localXAxis1.x;
        this.m_refAngle = param1.referenceAngle;
        this.m_linearJacobian.SetZero();
        this.m_linearMass = 0;
        this.m_force = 0;
        this.m_angularMass = 0;
        this.m_torque = 0;
        this.m_motorJacobian.SetZero();
        this.m_motorMass = 0;
        this.m_motorForce = 0;
        this.m_limitForce = 0;
        this.m_limitPositionImpulse = 0;
        this.m_lowerTranslation = param1.lowerTranslation;
        this.m_upperTranslation = param1.upperTranslation;
        this.m_maxMotorForce = param1.maxMotorForce;
        this.m_motorSpeed = param1.motorSpeed;
        this.m_enableLimit = param1.enableLimit;
        this.m_enableMotor = param1.enableMotor;
    }

    public override GetAnchor1(): b2Vec2 {
        return this.m_body1.GetWorldPoint(this.m_localAnchor1);
    }

    public override GetAnchor2(): b2Vec2 {
        return this.m_body2.GetWorldPoint(this.m_localAnchor2);
    }

    public override GetReactionForce(): b2Vec2 {
        var _loc1_: b2Mat22 = this.m_body1.m_xf.R;
        var _loc2_: number =
            this.m_limitForce *
            (_loc1_.col1.x * this.m_localXAxis1.x +
                _loc1_.col2.x * this.m_localXAxis1.y);
        var _loc3_: number =
            this.m_limitForce *
            (_loc1_.col1.y * this.m_localXAxis1.x +
                _loc1_.col2.y * this.m_localXAxis1.y);
        var _loc4_: number =
            this.m_force *
            (_loc1_.col1.x * this.m_localYAxis1.x +
                _loc1_.col2.x * this.m_localYAxis1.y);
        var _loc5_: number =
            this.m_force *
            (_loc1_.col1.y * this.m_localYAxis1.x +
                _loc1_.col2.y * this.m_localYAxis1.y);
        return new b2Vec2(
            this.m_limitForce * _loc2_ + this.m_force * _loc4_,
            this.m_limitForce * _loc3_ + this.m_force * _loc5_,
        );
    }

    public override GetReactionTorque(): number {
        return this.m_torque;
    }

    public GetJointTranslation(): number {
        var _loc3_: b2Mat22 = null;
        var _loc1_: b2Body = this.m_body1;
        var _loc2_: b2Body = this.m_body2;
        var _loc4_: b2Vec2 = _loc1_.GetWorldPoint(this.m_localAnchor1);
        var _loc5_: b2Vec2 = _loc2_.GetWorldPoint(this.m_localAnchor2);
        var _loc6_: number = _loc5_.x - _loc4_.x;
        var _loc7_: number = _loc5_.y - _loc4_.y;
        var _loc8_: b2Vec2 = _loc1_.GetWorldVector(this.m_localXAxis1);
        return _loc8_.x * _loc6_ + _loc8_.y * _loc7_;
    }

    public GetJointSpeed(): number {
        var _loc3_: b2Mat22 = null;
        var _loc1_: b2Body = this.m_body1;
        var _loc2_: b2Body = this.m_body2;
        _loc3_ = _loc1_.m_xf.R;
        var _loc4_: number =
            this.m_localAnchor1.x - _loc1_.m_sweep.localCenter.x;
        var _loc5_: number =
            this.m_localAnchor1.y - _loc1_.m_sweep.localCenter.y;
        var _loc6_: number = _loc3_.col1.x * _loc4_ + _loc3_.col2.x * _loc5_;
        _loc5_ = _loc3_.col1.y * _loc4_ + _loc3_.col2.y * _loc5_;
        _loc4_ = _loc6_;
        _loc3_ = _loc2_.m_xf.R;
        var _loc7_: number =
            this.m_localAnchor2.x - _loc2_.m_sweep.localCenter.x;
        var _loc8_: number =
            this.m_localAnchor2.y - _loc2_.m_sweep.localCenter.y;
        _loc6_ = _loc3_.col1.x * _loc7_ + _loc3_.col2.x * _loc8_;
        _loc8_ = _loc3_.col1.y * _loc7_ + _loc3_.col2.y * _loc8_;
        _loc7_ = _loc6_;
        var _loc9_: number = _loc1_.m_sweep.c.x + _loc4_;
        var _loc10_: number = _loc1_.m_sweep.c.y + _loc5_;
        var _loc11_: number = _loc2_.m_sweep.c.x + _loc7_;
        var _loc12_: number = _loc2_.m_sweep.c.y + _loc8_;
        var _loc13_: number = _loc11_ - _loc9_;
        var _loc14_: number = _loc12_ - _loc10_;
        var _loc15_: b2Vec2 = _loc1_.GetWorldVector(this.m_localXAxis1);
        var _loc16_: b2Vec2 = _loc1_.m_linearVelocity;
        var _loc17_: b2Vec2 = _loc2_.m_linearVelocity;
        var _loc18_: number = _loc1_.m_angularVelocity;
        var _loc19_: number = _loc2_.m_angularVelocity;
        return (
            _loc13_ * (-_loc18_ * _loc15_.y) +
            _loc14_ * (_loc18_ * _loc15_.x) +
            (_loc15_.x *
                (_loc17_.x +
                    -_loc19_ * _loc8_ -
                    _loc16_.x -
                    -_loc18_ * _loc5_) +
                _loc15_.y *
                (_loc17_.y +
                    _loc19_ * _loc7_ -
                    _loc16_.y -
                    _loc18_ * _loc4_))
        );
    }

    public IsLimitEnabled(): boolean {
        return this.m_enableLimit;
    }

    public EnableLimit(param1: boolean) {
        this.m_enableLimit = param1;
    }

    public GetLowerLimit(): number {
        return this.m_lowerTranslation;
    }

    public GetUpperLimit(): number {
        return this.m_upperTranslation;
    }

    public SetLimits(param1: number, param2: number) {
        this.m_lowerTranslation = param1;
        this.m_upperTranslation = param2;
    }

    public IsMotorEnabled(): boolean {
        return this.m_enableMotor;
    }

    public EnableMotor(param1: boolean) {
        this.m_enableMotor = param1;
    }

    public SetMotorSpeed(param1: number) {
        this.m_motorSpeed = param1;
    }

    public GetMotorSpeed(): number {
        return this.m_motorSpeed;
    }

    public SetMaxMotorForce(param1: number) {
        this.m_maxMotorForce = param1;
    }

    public GetMotorForce(): number {
        return this.m_motorForce;
    }

    public override InitVelocityConstraints(param1: b2TimeStep) {
        var _loc4_: b2Mat22 = null;
        var _loc5_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        var _loc20_: number = NaN;
        var _loc21_: number = NaN;
        var _loc22_: number = NaN;
        var _loc23_: number = NaN;
        var _loc24_: number = NaN;
        var _loc25_: number = NaN;
        var _loc26_: number = NaN;
        var _loc27_: number = NaN;
        var _loc28_: number = NaN;
        var _loc2_: b2Body = this.m_body1;
        var _loc3_: b2Body = this.m_body2;
        _loc4_ = _loc2_.m_xf.R;
        var _loc6_: number =
            this.m_localAnchor1.x - _loc2_.m_sweep.localCenter.x;
        var _loc7_: number =
            this.m_localAnchor1.y - _loc2_.m_sweep.localCenter.y;
        _loc5_ = _loc4_.col1.x * _loc6_ + _loc4_.col2.x * _loc7_;
        _loc7_ = _loc4_.col1.y * _loc6_ + _loc4_.col2.y * _loc7_;
        _loc6_ = _loc5_;
        _loc4_ = _loc3_.m_xf.R;
        var _loc8_: number =
            this.m_localAnchor2.x - _loc3_.m_sweep.localCenter.x;
        var _loc9_: number =
            this.m_localAnchor2.y - _loc3_.m_sweep.localCenter.y;
        _loc5_ = _loc4_.col1.x * _loc8_ + _loc4_.col2.x * _loc9_;
        _loc9_ = _loc4_.col1.y * _loc8_ + _loc4_.col2.y * _loc9_;
        _loc8_ = _loc5_;
        var _loc10_: number = _loc2_.m_invMass;
        var _loc11_: number = _loc3_.m_invMass;
        var _loc12_: number = _loc2_.m_invI;
        var _loc13_: number = _loc3_.m_invI;
        _loc4_ = _loc2_.m_xf.R;
        var _loc14_: number =
            _loc4_.col1.x * this.m_localYAxis1.x +
            _loc4_.col2.x * this.m_localYAxis1.y;
        var _loc15_: number =
            _loc4_.col1.y * this.m_localYAxis1.x +
            _loc4_.col2.y * this.m_localYAxis1.y;
        var _loc16_: number = _loc3_.m_sweep.c.x + _loc8_ - _loc2_.m_sweep.c.x;
        var _loc17_: number = _loc3_.m_sweep.c.y + _loc9_ - _loc2_.m_sweep.c.y;
        this.m_linearJacobian.linear1.x = -_loc14_;
        this.m_linearJacobian.linear1.y = -_loc15_;
        this.m_linearJacobian.linear2.x = _loc14_;
        this.m_linearJacobian.linear2.y = _loc15_;
        this.m_linearJacobian.angular1 = -(
            _loc16_ * _loc15_ -
            _loc17_ * _loc14_
        );
        this.m_linearJacobian.angular2 = _loc8_ * _loc15_ - _loc9_ * _loc14_;
        this.m_linearMass =
            _loc10_ +
            _loc12_ *
            this.m_linearJacobian.angular1 *
            this.m_linearJacobian.angular1 +
            _loc11_ +
            _loc13_ *
            this.m_linearJacobian.angular2 *
            this.m_linearJacobian.angular2;
        this.m_linearMass = 1 / this.m_linearMass;
        this.m_angularMass = _loc12_ + _loc13_;
        if (this.m_angularMass > Number.MIN_VALUE) {
            this.m_angularMass = 1 / this.m_angularMass;
        }
        if (this.m_enableLimit || this.m_enableMotor) {
            _loc4_ = _loc2_.m_xf.R;
            _loc18_ =
                _loc4_.col1.x * this.m_localXAxis1.x +
                _loc4_.col2.x * this.m_localXAxis1.y;
            _loc19_ =
                _loc4_.col1.y * this.m_localXAxis1.x +
                _loc4_.col2.y * this.m_localXAxis1.y;
            this.m_motorJacobian.linear1.x = -_loc18_;
            this.m_motorJacobian.linear1.y = -_loc19_;
            this.m_motorJacobian.linear2.x = _loc18_;
            this.m_motorJacobian.linear2.y = _loc19_;
            this.m_motorJacobian.angular1 = -(
                _loc16_ * _loc19_ -
                _loc17_ * _loc18_
            );
            this.m_motorJacobian.angular2 = _loc8_ * _loc19_ - _loc9_ * _loc18_;
            this.m_motorMass =
                _loc10_ +
                _loc12_ *
                this.m_motorJacobian.angular1 *
                this.m_motorJacobian.angular1 +
                _loc11_ +
                _loc13_ *
                this.m_motorJacobian.angular2 *
                this.m_motorJacobian.angular2;
            this.m_motorMass = 1 / this.m_motorMass;
            if (this.m_enableLimit) {
                _loc20_ = _loc16_ - _loc6_;
                _loc21_ = _loc17_ - _loc7_;
                _loc22_ = _loc18_ * _loc20_ + _loc19_ * _loc21_;
                if (
                    b2Math.b2Abs(
                        this.m_upperTranslation - this.m_lowerTranslation,
                    ) <
                    2 * b2Settings.b2_linearSlop
                ) {
                    this.m_limitState = b2Joint.e_equalLimits;
                } else if (_loc22_ <= this.m_lowerTranslation) {
                    if (this.m_limitState != b2Joint.e_atLowerLimit) {
                        this.m_limitForce = 0;
                    }
                    this.m_limitState = b2Joint.e_atLowerLimit;
                } else if (_loc22_ >= this.m_upperTranslation) {
                    if (this.m_limitState != b2Joint.e_atUpperLimit) {
                        this.m_limitForce = 0;
                    }
                    this.m_limitState = b2Joint.e_atUpperLimit;
                } else {
                    this.m_limitState = b2Joint.e_inactiveLimit;
                    this.m_limitForce = 0;
                }
            }
        }
        if (this.m_enableMotor == false) {
            this.m_motorForce = 0;
        }
        if (this.m_enableLimit == false) {
            this.m_limitForce = 0;
        }
        if (param1.warmStarting) {
            _loc23_ =
                param1.dt *
                (this.m_force * this.m_linearJacobian.linear1.x +
                    (this.m_motorForce + this.m_limitForce) *
                    this.m_motorJacobian.linear1.x);
            _loc24_ =
                param1.dt *
                (this.m_force * this.m_linearJacobian.linear1.y +
                    (this.m_motorForce + this.m_limitForce) *
                    this.m_motorJacobian.linear1.y);
            _loc25_ =
                param1.dt *
                (this.m_force * this.m_linearJacobian.linear2.x +
                    (this.m_motorForce + this.m_limitForce) *
                    this.m_motorJacobian.linear2.x);
            _loc26_ =
                param1.dt *
                (this.m_force * this.m_linearJacobian.linear2.y +
                    (this.m_motorForce + this.m_limitForce) *
                    this.m_motorJacobian.linear2.y);
            _loc27_ =
                param1.dt *
                (this.m_force * this.m_linearJacobian.angular1 -
                    this.m_torque +
                    (this.m_motorForce + this.m_limitForce) *
                    this.m_motorJacobian.angular1);
            _loc28_ =
                param1.dt *
                (this.m_force * this.m_linearJacobian.angular2 +
                    this.m_torque +
                    (this.m_motorForce + this.m_limitForce) *
                    this.m_motorJacobian.angular2);
            _loc2_.m_linearVelocity.x += _loc10_ * _loc23_;
            _loc2_.m_linearVelocity.y += _loc10_ * _loc24_;
            _loc2_.m_angularVelocity += _loc12_ * _loc27_;
            _loc3_.m_linearVelocity.x += _loc11_ * _loc25_;
            _loc3_.m_linearVelocity.y += _loc11_ * _loc26_;
            _loc3_.m_angularVelocity += _loc13_ * _loc28_;
        } else {
            this.m_force = 0;
            this.m_torque = 0;
            this.m_limitForce = 0;
            this.m_motorForce = 0;
        }
        this.m_limitPositionImpulse = 0;
    }

    public override SolveVelocityConstraints(param1: b2TimeStep) {
        var _loc8_: number = NaN;
        var _loc15_: number = NaN;
        var _loc16_: number = NaN;
        var _loc17_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        var _loc2_: b2Body = this.m_body1;
        var _loc3_: b2Body = this.m_body2;
        var _loc4_: number = _loc2_.m_invMass;
        var _loc5_: number = _loc3_.m_invMass;
        var _loc6_: number = _loc2_.m_invI;
        var _loc7_: number = _loc3_.m_invI;
        var _loc9_: number = this.m_linearJacobian.Compute(
            _loc2_.m_linearVelocity,
            _loc2_.m_angularVelocity,
            _loc3_.m_linearVelocity,
            _loc3_.m_angularVelocity,
        );
        var _loc10_: number = -param1.inv_dt * this.m_linearMass * _loc9_;
        this.m_force += _loc10_;
        var _loc11_: number = param1.dt * _loc10_;
        _loc2_.m_linearVelocity.x +=
            _loc4_ * _loc11_ * this.m_linearJacobian.linear1.x;
        _loc2_.m_linearVelocity.y +=
            _loc4_ * _loc11_ * this.m_linearJacobian.linear1.y;
        _loc2_.m_angularVelocity +=
            _loc6_ * _loc11_ * this.m_linearJacobian.angular1;
        _loc3_.m_linearVelocity.x +=
            _loc5_ * _loc11_ * this.m_linearJacobian.linear2.x;
        _loc3_.m_linearVelocity.y +=
            _loc5_ * _loc11_ * this.m_linearJacobian.linear2.y;
        _loc3_.m_angularVelocity +=
            _loc7_ * _loc11_ * this.m_linearJacobian.angular2;
        var _loc12_: number =
            _loc3_.m_angularVelocity - _loc2_.m_angularVelocity;
        var _loc13_: number = -param1.inv_dt * this.m_angularMass * _loc12_;
        this.m_torque += _loc13_;
        var _loc14_: number = param1.dt * _loc13_;
        _loc2_.m_angularVelocity -= _loc6_ * _loc14_;
        _loc3_.m_angularVelocity += _loc7_ * _loc14_;
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
            _loc15_ =
                this.m_motorJacobian.Compute(
                    _loc2_.m_linearVelocity,
                    _loc2_.m_angularVelocity,
                    _loc3_.m_linearVelocity,
                    _loc3_.m_angularVelocity,
                ) - this.m_motorSpeed;
            _loc16_ = -param1.inv_dt * this.m_motorMass * _loc15_;
            _loc17_ = this.m_motorForce;
            this.m_motorForce = b2Math.b2Clamp(
                this.m_motorForce + _loc16_,
                -this.m_maxMotorForce,
                this.m_maxMotorForce,
            );
            _loc16_ = this.m_motorForce - _loc17_;
            _loc11_ = param1.dt * _loc16_;
            _loc2_.m_linearVelocity.x +=
                _loc4_ * _loc11_ * this.m_motorJacobian.linear1.x;
            _loc2_.m_linearVelocity.y +=
                _loc4_ * _loc11_ * this.m_motorJacobian.linear1.y;
            _loc2_.m_angularVelocity +=
                _loc6_ * _loc11_ * this.m_motorJacobian.angular1;
            _loc3_.m_linearVelocity.x +=
                _loc5_ * _loc11_ * this.m_motorJacobian.linear2.x;
            _loc3_.m_linearVelocity.y +=
                _loc5_ * _loc11_ * this.m_motorJacobian.linear2.y;
            _loc3_.m_angularVelocity +=
                _loc7_ * _loc11_ * this.m_motorJacobian.angular2;
        }
        if (
            this.m_enableLimit &&
            this.m_limitState != b2Joint.e_inactiveLimit
        ) {
            _loc18_ = this.m_motorJacobian.Compute(
                _loc2_.m_linearVelocity,
                _loc2_.m_angularVelocity,
                _loc3_.m_linearVelocity,
                _loc3_.m_angularVelocity,
            );
            _loc19_ = -param1.inv_dt * this.m_motorMass * _loc18_;
            if (this.m_limitState == b2Joint.e_equalLimits) {
                this.m_limitForce += _loc19_;
            } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
                _loc8_ = this.m_limitForce;
                this.m_limitForce = b2Math.b2Max(
                    this.m_limitForce + _loc19_,
                    0,
                );
                _loc19_ = this.m_limitForce - _loc8_;
            } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                _loc8_ = this.m_limitForce;
                this.m_limitForce = b2Math.b2Min(
                    this.m_limitForce + _loc19_,
                    0,
                );
                _loc19_ = this.m_limitForce - _loc8_;
            }
            _loc11_ = param1.dt * _loc19_;
            _loc2_.m_linearVelocity.x +=
                _loc4_ * _loc11_ * this.m_motorJacobian.linear1.x;
            _loc2_.m_linearVelocity.y +=
                _loc4_ * _loc11_ * this.m_motorJacobian.linear1.y;
            _loc2_.m_angularVelocity +=
                _loc6_ * _loc11_ * this.m_motorJacobian.angular1;
            _loc3_.m_linearVelocity.x +=
                _loc5_ * _loc11_ * this.m_motorJacobian.linear2.x;
            _loc3_.m_linearVelocity.y +=
                _loc5_ * _loc11_ * this.m_motorJacobian.linear2.y;
            _loc3_.m_angularVelocity +=
                _loc7_ * _loc11_ * this.m_motorJacobian.angular2;
        }
    }

    public override SolvePositionConstraints(): boolean {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc9_: b2Mat22 = null;
        var _loc10_: number = NaN;
        var _loc29_: number = NaN;
        var _loc30_: number = NaN;
        var _loc31_: number = NaN;
        var _loc32_: number = NaN;
        var _loc3_: b2Body = this.m_body1;
        var _loc4_: b2Body = this.m_body2;
        var _loc5_: number = _loc3_.m_invMass;
        var _loc6_: number = _loc4_.m_invMass;
        var _loc7_: number = _loc3_.m_invI;
        var _loc8_: number = _loc4_.m_invI;
        _loc9_ = _loc3_.m_xf.R;
        var _loc11_: number =
            this.m_localAnchor1.x - _loc3_.m_sweep.localCenter.x;
        var _loc12_: number =
            this.m_localAnchor1.y - _loc3_.m_sweep.localCenter.y;
        _loc10_ = _loc9_.col1.x * _loc11_ + _loc9_.col2.x * _loc12_;
        _loc12_ = _loc9_.col1.y * _loc11_ + _loc9_.col2.y * _loc12_;
        _loc11_ = _loc10_;
        _loc9_ = _loc4_.m_xf.R;
        var _loc13_: number =
            this.m_localAnchor2.x - _loc4_.m_sweep.localCenter.x;
        var _loc14_: number =
            this.m_localAnchor2.y - _loc4_.m_sweep.localCenter.y;
        _loc10_ = _loc9_.col1.x * _loc13_ + _loc9_.col2.x * _loc14_;
        _loc14_ = _loc9_.col1.y * _loc13_ + _loc9_.col2.y * _loc14_;
        _loc13_ = _loc10_;
        var _loc15_: number = _loc3_.m_sweep.c.x + _loc11_;
        var _loc16_: number = _loc3_.m_sweep.c.y + _loc12_;
        var _loc17_: number = _loc4_.m_sweep.c.x + _loc13_;
        var _loc18_: number = _loc4_.m_sweep.c.y + _loc14_;
        var _loc19_: number = _loc17_ - _loc15_;
        var _loc20_: number = _loc18_ - _loc16_;
        _loc9_ = _loc3_.m_xf.R;
        var _loc21_: number =
            _loc9_.col1.x * this.m_localYAxis1.x +
            _loc9_.col2.x * this.m_localYAxis1.y;
        var _loc22_: number =
            _loc9_.col1.y * this.m_localYAxis1.x +
            _loc9_.col2.y * this.m_localYAxis1.y;
        var _loc23_: number = _loc21_ * _loc19_ + _loc22_ * _loc20_;
        _loc23_ = b2Math.b2Clamp(
            _loc23_,
            -b2Settings.b2_maxLinearCorrection,
            b2Settings.b2_maxLinearCorrection,
        );
        var _loc24_: number = -this.m_linearMass * _loc23_;
        _loc3_.m_sweep.c.x +=
            _loc5_ * _loc24_ * this.m_linearJacobian.linear1.x;
        _loc3_.m_sweep.c.y +=
            _loc5_ * _loc24_ * this.m_linearJacobian.linear1.y;
        _loc3_.m_sweep.a += _loc7_ * _loc24_ * this.m_linearJacobian.angular1;
        _loc4_.m_sweep.c.x +=
            _loc6_ * _loc24_ * this.m_linearJacobian.linear2.x;
        _loc4_.m_sweep.c.y +=
            _loc6_ * _loc24_ * this.m_linearJacobian.linear2.y;
        _loc4_.m_sweep.a += _loc8_ * _loc24_ * this.m_linearJacobian.angular2;
        var _loc25_: number = b2Math.b2Abs(_loc23_);
        var _loc26_: number =
            _loc4_.m_sweep.a - _loc3_.m_sweep.a - this.m_refAngle;
        _loc26_ = b2Math.b2Clamp(
            _loc26_,
            -b2Settings.b2_maxAngularCorrection,
            b2Settings.b2_maxAngularCorrection,
        );
        var _loc27_: number = -this.m_angularMass * _loc26_;
        _loc3_.m_sweep.a -= _loc3_.m_invI * _loc27_;
        _loc4_.m_sweep.a += _loc4_.m_invI * _loc27_;
        _loc3_.SynchronizeTransform();
        _loc4_.SynchronizeTransform();
        var _loc28_: number = b2Math.b2Abs(_loc26_);
        if (
            this.m_enableLimit &&
            this.m_limitState != b2Joint.e_inactiveLimit
        ) {
            _loc9_ = _loc3_.m_xf.R;
            _loc11_ = this.m_localAnchor1.x - _loc3_.m_sweep.localCenter.x;
            _loc12_ = this.m_localAnchor1.y - _loc3_.m_sweep.localCenter.y;
            _loc10_ = _loc9_.col1.x * _loc11_ + _loc9_.col2.x * _loc12_;
            _loc12_ = _loc9_.col1.y * _loc11_ + _loc9_.col2.y * _loc12_;
            _loc11_ = _loc10_;
            _loc9_ = _loc4_.m_xf.R;
            _loc13_ = this.m_localAnchor2.x - _loc4_.m_sweep.localCenter.x;
            _loc14_ = this.m_localAnchor2.y - _loc4_.m_sweep.localCenter.y;
            _loc10_ = _loc9_.col1.x * _loc13_ + _loc9_.col2.x * _loc14_;
            _loc14_ = _loc9_.col1.y * _loc13_ + _loc9_.col2.y * _loc14_;
            _loc13_ = _loc10_;
            _loc15_ = _loc3_.m_sweep.c.x + _loc11_;
            _loc16_ = _loc3_.m_sweep.c.y + _loc12_;
            _loc17_ = _loc4_.m_sweep.c.x + _loc13_;
            _loc18_ = _loc4_.m_sweep.c.y + _loc14_;
            _loc19_ = _loc17_ - _loc15_;
            _loc20_ = _loc18_ - _loc16_;
            _loc9_ = _loc3_.m_xf.R;
            _loc29_ =
                _loc9_.col1.x * this.m_localXAxis1.x +
                _loc9_.col2.x * this.m_localXAxis1.y;
            _loc30_ =
                _loc9_.col1.y * this.m_localXAxis1.x +
                _loc9_.col2.y * this.m_localXAxis1.y;
            _loc31_ = _loc29_ * _loc19_ + _loc30_ * _loc20_;
            _loc32_ = 0;
            if (this.m_limitState == b2Joint.e_equalLimits) {
                _loc1_ = b2Math.b2Clamp(
                    _loc31_,
                    -b2Settings.b2_maxLinearCorrection,
                    b2Settings.b2_maxLinearCorrection,
                );
                _loc32_ = -this.m_motorMass * _loc1_;
                _loc25_ = b2Math.b2Max(_loc25_, b2Math.b2Abs(_loc26_));
            } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
                _loc1_ = _loc31_ - this.m_lowerTranslation;
                _loc25_ = b2Math.b2Max(_loc25_, -_loc1_);
                _loc1_ = b2Math.b2Clamp(
                    _loc1_ + b2Settings.b2_linearSlop,
                    -b2Settings.b2_maxLinearCorrection,
                    0,
                );
                _loc32_ = -this.m_motorMass * _loc1_;
                _loc2_ = this.m_limitPositionImpulse;
                this.m_limitPositionImpulse = b2Math.b2Max(
                    this.m_limitPositionImpulse + _loc32_,
                    0,
                );
                _loc32_ = this.m_limitPositionImpulse - _loc2_;
            } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                _loc1_ = _loc31_ - this.m_upperTranslation;
                _loc25_ = b2Math.b2Max(_loc25_, _loc1_);
                _loc1_ = b2Math.b2Clamp(
                    _loc1_ - b2Settings.b2_linearSlop,
                    0,
                    b2Settings.b2_maxLinearCorrection,
                );
                _loc32_ = -this.m_motorMass * _loc1_;
                _loc2_ = this.m_limitPositionImpulse;
                this.m_limitPositionImpulse = b2Math.b2Min(
                    this.m_limitPositionImpulse + _loc32_,
                    0,
                );
                _loc32_ = this.m_limitPositionImpulse - _loc2_;
            }
            _loc3_.m_sweep.c.x +=
                _loc5_ * _loc32_ * this.m_motorJacobian.linear1.x;
            _loc3_.m_sweep.c.y +=
                _loc5_ * _loc32_ * this.m_motorJacobian.linear1.y;
            _loc3_.m_sweep.a +=
                _loc7_ * _loc32_ * this.m_motorJacobian.angular1;
            _loc4_.m_sweep.c.x +=
                _loc6_ * _loc32_ * this.m_motorJacobian.linear2.x;
            _loc4_.m_sweep.c.y +=
                _loc6_ * _loc32_ * this.m_motorJacobian.linear2.y;
            _loc4_.m_sweep.a +=
                _loc8_ * _loc32_ * this.m_motorJacobian.angular2;
            _loc3_.SynchronizeTransform();
            _loc4_.SynchronizeTransform();
        }
        return (
            _loc25_ <= b2Settings.b2_linearSlop &&
            _loc28_ <= b2Settings.b2_angularSlop
        );
    }
}