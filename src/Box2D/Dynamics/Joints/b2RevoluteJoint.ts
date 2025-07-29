import b2Settings from "@/Box2D/Common/b2Settings";
import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2TimeStep from "@/Box2D/Dynamics/b2TimeStep";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";

export default class b2RevoluteJoint extends b2Joint {
    public static tImpulse = new b2Vec2();
    private K = new b2Mat22();
    private K1 = new b2Mat22();
    private K2 = new b2Mat22();
    private K3 = new b2Mat22();
    public m_localAnchor1 = new b2Vec2();
    public m_localAnchor2 = new b2Vec2();
    public m_pivotForce = new b2Vec2();
    public m_motorForce: number;
    public m_limitForce: number;
    public m_limitPositionImpulse: number;
    public m_pivotMass = new b2Mat22();
    public m_motorMass: number;
    public m_enableMotor: boolean;
    public m_maxMotorTorque: number;
    public m_motorSpeed: number;
    public m_enableLimit: boolean;
    public m_referenceAngle: number;
    public m_lowerAngle: number;
    public m_upperAngle: number;
    public m_limitState: number;

    constructor(param1: b2RevoluteJointDef) {
        super(param1);
        this.m_localAnchor1.SetV(param1.localAnchor1);
        this.m_localAnchor2.SetV(param1.localAnchor2);
        this.m_referenceAngle = param1.referenceAngle;
        this.m_pivotForce.Set(0, 0);
        this.m_motorForce = 0;
        this.m_limitForce = 0;
        this.m_limitPositionImpulse = 0;
        this.m_lowerAngle = param1.lowerAngle;
        this.m_upperAngle = param1.upperAngle;
        this.m_maxMotorTorque = param1.maxMotorTorque;
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
        return this.m_pivotForce;
    }

    public override GetReactionTorque(): number {
        return this.m_limitForce;
    }

    public GetJointAngle(): number {
        return (
            this.m_body2.m_sweep.a -
            this.m_body1.m_sweep.a -
            this.m_referenceAngle
        );
    }

    public GetJointSpeed(): number {
        return this.m_body2.m_angularVelocity - this.m_body1.m_angularVelocity;
    }

    public IsLimitEnabled(): boolean {
        return this.m_enableLimit;
    }

    public EnableLimit(param1: boolean) {
        this.m_enableLimit = param1;
    }

    public GetLowerLimit(): number {
        return this.m_lowerAngle;
    }

    public GetUpperLimit(): number {
        return this.m_upperAngle;
    }

    public SetLimits(param1: number, param2: number) {
        this.m_lowerAngle = param1;
        this.m_upperAngle = param2;
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

    public SetMaxMotorTorque(param1: number) {
        this.m_maxMotorTorque = param1;
    }

    public GetMotorTorque(): number {
        return this.m_motorForce;
    }

    public override InitVelocityConstraints(param1: b2TimeStep) {
        var _loc2_: b2Body = null;
        var _loc3_: b2Body = null;
        var _loc4_: b2Mat22 = null;
        var _loc5_: number = NaN;
        var _loc7_: number = NaN;
        var _loc14_: number = NaN;
        _loc2_ = this.m_body1;
        _loc3_ = this.m_body2;
        _loc4_ = _loc2_.m_xf.R;
        var _loc6_: number =
            this.m_localAnchor1.x - _loc2_.m_sweep.localCenter.x;
        _loc7_ = this.m_localAnchor1.y - _loc2_.m_sweep.localCenter.y;
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
        this.K1.col1.x = _loc10_ + _loc11_;
        this.K1.col2.x = 0;
        this.K1.col1.y = 0;
        this.K1.col2.y = _loc10_ + _loc11_;
        this.K2.col1.x = _loc12_ * _loc7_ * _loc7_;
        this.K2.col2.x = -_loc12_ * _loc6_ * _loc7_;
        this.K2.col1.y = -_loc12_ * _loc6_ * _loc7_;
        this.K2.col2.y = _loc12_ * _loc6_ * _loc6_;
        this.K3.col1.x = _loc13_ * _loc9_ * _loc9_;
        this.K3.col2.x = -_loc13_ * _loc8_ * _loc9_;
        this.K3.col1.y = -_loc13_ * _loc8_ * _loc9_;
        this.K3.col2.y = _loc13_ * _loc8_ * _loc8_;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.AddM(this.K3);
        this.K.Invert(this.m_pivotMass);
        this.m_motorMass = 1 / (_loc12_ + _loc13_);
        if (this.m_enableMotor == false) {
            this.m_motorForce = 0;
        }
        if (this.m_enableLimit) {
            _loc14_ =
                _loc3_.m_sweep.a - _loc2_.m_sweep.a - this.m_referenceAngle;
            if (
                b2Math.b2Abs(this.m_upperAngle - this.m_lowerAngle) <
                2 * b2Settings.b2_angularSlop
            ) {
                this.m_limitState = b2Joint.e_equalLimits;
            } else if (_loc14_ <= this.m_lowerAngle) {
                if (this.m_limitState != b2Joint.e_atLowerLimit) {
                    this.m_limitForce = 0;
                }
                this.m_limitState = b2Joint.e_atLowerLimit;
            } else if (_loc14_ >= this.m_upperAngle) {
                if (this.m_limitState != b2Joint.e_atUpperLimit) {
                    this.m_limitForce = 0;
                }
                this.m_limitState = b2Joint.e_atUpperLimit;
            } else {
                this.m_limitState = b2Joint.e_inactiveLimit;
                this.m_limitForce = 0;
            }
        } else {
            this.m_limitForce = 0;
        }
        if (param1.warmStarting) {
            _loc2_.m_linearVelocity.x -=
                param1.dt * _loc10_ * this.m_pivotForce.x;
            _loc2_.m_linearVelocity.y -=
                param1.dt * _loc10_ * this.m_pivotForce.y;
            _loc2_.m_angularVelocity -=
                param1.dt *
                _loc12_ *
                (_loc6_ * this.m_pivotForce.y -
                    _loc7_ * this.m_pivotForce.x +
                    this.m_motorForce +
                    this.m_limitForce);
            _loc3_.m_linearVelocity.x +=
                param1.dt * _loc11_ * this.m_pivotForce.x;
            _loc3_.m_linearVelocity.y +=
                param1.dt * _loc11_ * this.m_pivotForce.y;
            _loc3_.m_angularVelocity +=
                param1.dt *
                _loc13_ *
                (_loc8_ * this.m_pivotForce.y -
                    _loc9_ * this.m_pivotForce.x +
                    this.m_motorForce +
                    this.m_limitForce);
        } else {
            this.m_pivotForce.SetZero();
            this.m_motorForce = 0;
            this.m_limitForce = 0;
        }
        this.m_limitPositionImpulse = 0;
    }

    public override SolveVelocityConstraints(param1: b2TimeStep) {
        var _loc4_: b2Mat22 = null;
        var _loc5_: number = NaN;
        var _loc10_: number = NaN;
        var _loc16_: number = NaN;
        var _loc17_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        var _loc20_: number = NaN;
        var _loc21_: number = NaN;
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
        var _loc11_: number =
            _loc3_.m_linearVelocity.x +
            -_loc3_.m_angularVelocity * _loc9_ -
            _loc2_.m_linearVelocity.x -
            -_loc2_.m_angularVelocity * _loc7_;
        var _loc12_: number =
            _loc3_.m_linearVelocity.y +
            _loc3_.m_angularVelocity * _loc8_ -
            _loc2_.m_linearVelocity.y -
            _loc2_.m_angularVelocity * _loc6_;
        var _loc13_: number =
            -param1.inv_dt *
            (this.m_pivotMass.col1.x * _loc11_ +
                this.m_pivotMass.col2.x * _loc12_);
        var _loc14_: number =
            -param1.inv_dt *
            (this.m_pivotMass.col1.y * _loc11_ +
                this.m_pivotMass.col2.y * _loc12_);
        this.m_pivotForce.x += _loc13_;
        this.m_pivotForce.y += _loc14_;
        var _loc15_: number = param1.dt * _loc13_;
        _loc16_ = param1.dt * _loc14_;
        _loc2_.m_linearVelocity.x -= _loc2_.m_invMass * _loc15_;
        _loc2_.m_linearVelocity.y -= _loc2_.m_invMass * _loc16_;
        _loc2_.m_angularVelocity -=
            _loc2_.m_invI * (_loc6_ * _loc16_ - _loc7_ * _loc15_);
        _loc3_.m_linearVelocity.x += _loc3_.m_invMass * _loc15_;
        _loc3_.m_linearVelocity.y += _loc3_.m_invMass * _loc16_;
        _loc3_.m_angularVelocity +=
            _loc3_.m_invI * (_loc8_ * _loc16_ - _loc9_ * _loc15_);
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
            _loc17_ =
                _loc3_.m_angularVelocity -
                _loc2_.m_angularVelocity -
                this.m_motorSpeed;
            _loc18_ = -param1.inv_dt * this.m_motorMass * _loc17_;
            _loc19_ = this.m_motorForce;
            this.m_motorForce = b2Math.b2Clamp(
                this.m_motorForce + _loc18_,
                -this.m_maxMotorTorque,
                this.m_maxMotorTorque,
            );
            _loc18_ = this.m_motorForce - _loc19_;
            _loc2_.m_angularVelocity -= _loc2_.m_invI * param1.dt * _loc18_;
            _loc3_.m_angularVelocity += _loc3_.m_invI * param1.dt * _loc18_;
        }
        if (
            this.m_enableLimit &&
            this.m_limitState != b2Joint.e_inactiveLimit
        ) {
            _loc20_ = _loc3_.m_angularVelocity - _loc2_.m_angularVelocity;
            _loc21_ = -param1.inv_dt * this.m_motorMass * _loc20_;
            if (this.m_limitState == b2Joint.e_equalLimits) {
                this.m_limitForce += _loc21_;
            } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
                _loc10_ = this.m_limitForce;
                this.m_limitForce = b2Math.b2Max(
                    this.m_limitForce + _loc21_,
                    0,
                );
                _loc21_ = this.m_limitForce - _loc10_;
            } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                _loc10_ = this.m_limitForce;
                this.m_limitForce = b2Math.b2Min(
                    this.m_limitForce + _loc21_,
                    0,
                );
                _loc21_ = this.m_limitForce - _loc10_;
            }
            _loc2_.m_angularVelocity -= _loc2_.m_invI * param1.dt * _loc21_;
            _loc3_.m_angularVelocity += _loc3_.m_invI * param1.dt * _loc21_;
        }
    }

    public override SolvePositionConstraints(): boolean {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc6_: b2Mat22 = null;
        var _loc25_: number = NaN;
        var _loc26_: number = NaN;
        var _loc3_: b2Body = this.m_body1;
        var _loc4_: b2Body = this.m_body2;
        var _loc5_: number = 0;
        _loc6_ = _loc3_.m_xf.R;
        var _loc7_: number =
            this.m_localAnchor1.x - _loc3_.m_sweep.localCenter.x;
        var _loc8_: number =
            this.m_localAnchor1.y - _loc3_.m_sweep.localCenter.y;
        var _loc9_: number = _loc6_.col1.x * _loc7_ + _loc6_.col2.x * _loc8_;
        _loc8_ = _loc6_.col1.y * _loc7_ + _loc6_.col2.y * _loc8_;
        _loc7_ = _loc9_;
        _loc6_ = _loc4_.m_xf.R;
        var _loc10_: number =
            this.m_localAnchor2.x - _loc4_.m_sweep.localCenter.x;
        var _loc11_: number =
            this.m_localAnchor2.y - _loc4_.m_sweep.localCenter.y;
        _loc9_ = _loc6_.col1.x * _loc10_ + _loc6_.col2.x * _loc11_;
        _loc11_ = _loc6_.col1.y * _loc10_ + _loc6_.col2.y * _loc11_;
        _loc10_ = _loc9_;
        var _loc12_: number = _loc3_.m_sweep.c.x + _loc7_;
        var _loc13_: number = _loc3_.m_sweep.c.y + _loc8_;
        var _loc14_: number = _loc4_.m_sweep.c.x + _loc10_;
        var _loc15_: number = _loc4_.m_sweep.c.y + _loc11_;
        var _loc16_: number = _loc14_ - _loc12_;
        var _loc17_: number = _loc15_ - _loc13_;
        _loc5_ = Math.sqrt(_loc16_ * _loc16_ + _loc17_ * _loc17_);
        var _loc18_: number = _loc3_.m_invMass;
        var _loc19_: number = _loc4_.m_invMass;
        var _loc20_: number = _loc3_.m_invI;
        var _loc21_: number = _loc4_.m_invI;
        this.K1.col1.x = _loc18_ + _loc19_;
        this.K1.col2.x = 0;
        this.K1.col1.y = 0;
        this.K1.col2.y = _loc18_ + _loc19_;
        this.K2.col1.x = _loc20_ * _loc8_ * _loc8_;
        this.K2.col2.x = -_loc20_ * _loc7_ * _loc8_;
        this.K2.col1.y = -_loc20_ * _loc7_ * _loc8_;
        this.K2.col2.y = _loc20_ * _loc7_ * _loc7_;
        this.K3.col1.x = _loc21_ * _loc11_ * _loc11_;
        this.K3.col2.x = -_loc21_ * _loc10_ * _loc11_;
        this.K3.col1.y = -_loc21_ * _loc10_ * _loc11_;
        this.K3.col2.y = _loc21_ * _loc10_ * _loc10_;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.AddM(this.K3);
        this.K.Solve(b2RevoluteJoint.tImpulse, -_loc16_, -_loc17_);
        var _loc22_: number = b2RevoluteJoint.tImpulse.x;
        var _loc23_: number = b2RevoluteJoint.tImpulse.y;
        _loc3_.m_sweep.c.x -= _loc3_.m_invMass * _loc22_;
        _loc3_.m_sweep.c.y -= _loc3_.m_invMass * _loc23_;
        _loc3_.m_sweep.a -=
            _loc3_.m_invI * (_loc7_ * _loc23_ - _loc8_ * _loc22_);
        _loc4_.m_sweep.c.x += _loc4_.m_invMass * _loc22_;
        _loc4_.m_sweep.c.y += _loc4_.m_invMass * _loc23_;
        _loc4_.m_sweep.a +=
            _loc4_.m_invI * (_loc10_ * _loc23_ - _loc11_ * _loc22_);
        _loc3_.SynchronizeTransform();
        _loc4_.SynchronizeTransform();
        var _loc24_: number = 0;
        if (
            this.m_enableLimit &&
            this.m_limitState != b2Joint.e_inactiveLimit
        ) {
            _loc25_ =
                _loc4_.m_sweep.a - _loc3_.m_sweep.a - this.m_referenceAngle;
            _loc26_ = 0;
            if (this.m_limitState == b2Joint.e_equalLimits) {
                _loc2_ = b2Math.b2Clamp(
                    _loc25_,
                    -b2Settings.b2_maxAngularCorrection,
                    b2Settings.b2_maxAngularCorrection,
                );
                _loc26_ = -this.m_motorMass * _loc2_;
                _loc24_ = b2Math.b2Abs(_loc2_);
            } else if (this.m_limitState == b2Joint.e_atLowerLimit) {
                _loc2_ = _loc25_ - this.m_lowerAngle;
                _loc24_ = b2Math.b2Max(0, -_loc2_);
                _loc2_ = b2Math.b2Clamp(
                    _loc2_ + b2Settings.b2_angularSlop,
                    -b2Settings.b2_maxAngularCorrection,
                    0,
                );
                _loc26_ = -this.m_motorMass * _loc2_;
                _loc1_ = this.m_limitPositionImpulse;
                this.m_limitPositionImpulse = b2Math.b2Max(
                    this.m_limitPositionImpulse + _loc26_,
                    0,
                );
                _loc26_ = this.m_limitPositionImpulse - _loc1_;
            } else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                _loc2_ = _loc25_ - this.m_upperAngle;
                _loc24_ = b2Math.b2Max(0, _loc2_);
                _loc2_ = b2Math.b2Clamp(
                    _loc2_ - b2Settings.b2_angularSlop,
                    0,
                    b2Settings.b2_maxAngularCorrection,
                );
                _loc26_ = -this.m_motorMass * _loc2_;
                _loc1_ = this.m_limitPositionImpulse;
                this.m_limitPositionImpulse = b2Math.b2Min(
                    this.m_limitPositionImpulse + _loc26_,
                    0,
                );
                _loc26_ = this.m_limitPositionImpulse - _loc1_;
            }
            _loc3_.m_sweep.a -= _loc3_.m_invI * _loc26_;
            _loc4_.m_sweep.a += _loc4_.m_invI * _loc26_;
            _loc3_.SynchronizeTransform();
            _loc4_.SynchronizeTransform();
        }
        return (
            _loc5_ <= b2Settings.b2_linearSlop &&
            _loc24_ <= b2Settings.b2_angularSlop
        );
    }
}