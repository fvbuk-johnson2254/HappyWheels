import b2Settings from "@/Box2D/Common/b2Settings";
import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2TimeStep from "@/Box2D/Dynamics/b2TimeStep";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2PulleyJointDef from "@/Box2D/Dynamics/Joints/b2PulleyJointDef";

export default class b2PulleyJoint extends b2Joint {
    public static b2_minPulleyLength = 2.0;
    public m_ground: b2Body;
    public m_groundAnchor1: b2Vec2;
    public m_groundAnchor2: b2Vec2;
    public m_localAnchor1: b2Vec2;
    public m_localAnchor2: b2Vec2;
    public m_u1: b2Vec2;
    public m_u2: b2Vec2;
    public m_constant: number;
    public m_ratio: number;
    public m_maxLength1: number;
    public m_maxLength2: number;
    public m_pulleyMass: number;
    public m_limitMass1: number;
    public m_limitMass2: number;
    public m_force: number;
    public m_limitForce1: number;
    public m_limitForce2: number;
    public m_positionImpulse: number;
    public m_limitPositionImpulse1: number;
    public m_limitPositionImpulse2: number;
    public m_state: number;
    public m_limitState1: number;
    public m_limitState2: number;

    constructor(param1: b2PulleyJointDef) {
        super(param1);
        var _loc2_: b2Mat22 = null;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        this.m_groundAnchor1 = new b2Vec2();
        this.m_groundAnchor2 = new b2Vec2();
        this.m_localAnchor1 = new b2Vec2();
        this.m_localAnchor2 = new b2Vec2();
        this.m_u1 = new b2Vec2();
        this.m_u2 = new b2Vec2();
        this.m_ground = this.m_body1.m_world.m_groundBody;
        this.m_groundAnchor1.x =
            param1.groundAnchor1.x - this.m_ground.m_xf.position.x;
        this.m_groundAnchor1.y =
            param1.groundAnchor1.y - this.m_ground.m_xf.position.y;
        this.m_groundAnchor2.x =
            param1.groundAnchor2.x - this.m_ground.m_xf.position.x;
        this.m_groundAnchor2.y =
            param1.groundAnchor2.y - this.m_ground.m_xf.position.y;
        this.m_localAnchor1.SetV(param1.localAnchor1);
        this.m_localAnchor2.SetV(param1.localAnchor2);
        this.m_ratio = param1.ratio;
        this.m_constant = param1.length1 + this.m_ratio * param1.length2;
        this.m_maxLength1 = b2Math.b2Min(
            param1.maxLength1,
            this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength,
        );
        this.m_maxLength2 = b2Math.b2Min(
            param1.maxLength2,
            (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio,
        );
        this.m_force = 0;
        this.m_limitForce1 = 0;
        this.m_limitForce2 = 0;
    }

    public override GetAnchor1(): b2Vec2 {
        return this.m_body1.GetWorldPoint(this.m_localAnchor1);
    }

    public override GetAnchor2(): b2Vec2 {
        return this.m_body2.GetWorldPoint(this.m_localAnchor2);
    }

    public override GetReactionForce(): b2Vec2 {
        var _loc1_: b2Vec2 = this.m_u2.Copy();
        _loc1_.Multiply(this.m_force);
        return _loc1_;
    }

    public override GetReactionTorque(): number {
        return 0;
    }

    public GetGroundAnchor1(): b2Vec2 {
        var _loc1_: b2Vec2 = this.m_ground.m_xf.position.Copy();
        _loc1_.Add(this.m_groundAnchor1);
        return _loc1_;
    }

    public GetGroundAnchor2(): b2Vec2 {
        var _loc1_: b2Vec2 = this.m_ground.m_xf.position.Copy();
        _loc1_.Add(this.m_groundAnchor2);
        return _loc1_;
    }

    public GetLength1(): number {
        var _loc1_: b2Vec2 = this.m_body1.GetWorldPoint(this.m_localAnchor1);
        var _loc2_: number =
            this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
        var _loc3_: number =
            this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
        var _loc4_: number = _loc1_.x - _loc2_;
        var _loc5_: number = _loc1_.y - _loc3_;
        return Math.sqrt(_loc4_ * _loc4_ + _loc5_ * _loc5_);
    }

    public GetLength2(): number {
        var _loc1_: b2Vec2 = this.m_body2.GetWorldPoint(this.m_localAnchor2);
        var _loc2_: number =
            this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
        var _loc3_: number =
            this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
        var _loc4_: number = _loc1_.x - _loc2_;
        var _loc5_: number = _loc1_.y - _loc3_;
        return Math.sqrt(_loc4_ * _loc4_ + _loc5_ * _loc5_);
    }

    public GetRatio(): number {
        return this.m_ratio;
    }

    public override InitVelocityConstraints(param1: b2TimeStep) {
        var _loc4_: b2Mat22 = null;
        var _loc23_: number = NaN;
        var _loc24_: number = NaN;
        var _loc25_: number = NaN;
        var _loc26_: number = NaN;
        var _loc2_: b2Body = this.m_body1;
        var _loc3_: b2Body = this.m_body2;
        _loc4_ = _loc2_.m_xf.R;
        var _loc5_: number =
            this.m_localAnchor1.x - _loc2_.m_sweep.localCenter.x;
        var _loc6_: number =
            this.m_localAnchor1.y - _loc2_.m_sweep.localCenter.y;
        var _loc7_: number = _loc4_.col1.x * _loc5_ + _loc4_.col2.x * _loc6_;
        _loc6_ = _loc4_.col1.y * _loc5_ + _loc4_.col2.y * _loc6_;
        _loc5_ = _loc7_;
        _loc4_ = _loc3_.m_xf.R;
        var _loc8_: number =
            this.m_localAnchor2.x - _loc3_.m_sweep.localCenter.x;
        var _loc9_: number =
            this.m_localAnchor2.y - _loc3_.m_sweep.localCenter.y;
        _loc7_ = _loc4_.col1.x * _loc8_ + _loc4_.col2.x * _loc9_;
        _loc9_ = _loc4_.col1.y * _loc8_ + _loc4_.col2.y * _loc9_;
        _loc8_ = _loc7_;
        var _loc10_: number = _loc2_.m_sweep.c.x + _loc5_;
        var _loc11_: number = _loc2_.m_sweep.c.y + _loc6_;
        var _loc12_: number = _loc3_.m_sweep.c.x + _loc8_;
        var _loc13_: number = _loc3_.m_sweep.c.y + _loc9_;
        var _loc14_: number =
            this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
        var _loc15_: number =
            this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
        var _loc16_: number =
            this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
        var _loc17_: number =
            this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
        this.m_u1.Set(_loc10_ - _loc14_, _loc11_ - _loc15_);
        this.m_u2.Set(_loc12_ - _loc16_, _loc13_ - _loc17_);
        var _loc18_: number = this.m_u1.Length();
        var _loc19_: number = this.m_u2.Length();
        if (_loc18_ > b2Settings.b2_linearSlop) {
            this.m_u1.Multiply(1 / _loc18_);
        } else {
            this.m_u1.SetZero();
        }
        if (_loc19_ > b2Settings.b2_linearSlop) {
            this.m_u2.Multiply(1 / _loc19_);
        } else {
            this.m_u2.SetZero();
        }
        var _loc20_: number =
            this.m_constant - _loc18_ - this.m_ratio * _loc19_;
        if (_loc20_ > 0) {
            this.m_state = b2Joint.e_inactiveLimit;
            this.m_force = 0;
        } else {
            this.m_state = b2Joint.e_atUpperLimit;
            this.m_positionImpulse = 0;
        }
        if (_loc18_ < this.m_maxLength1) {
            this.m_limitState1 = b2Joint.e_inactiveLimit;
            this.m_limitForce1 = 0;
        } else {
            this.m_limitState1 = b2Joint.e_atUpperLimit;
            this.m_limitPositionImpulse1 = 0;
        }
        if (_loc19_ < this.m_maxLength2) {
            this.m_limitState2 = b2Joint.e_inactiveLimit;
            this.m_limitForce2 = 0;
        } else {
            this.m_limitState2 = b2Joint.e_atUpperLimit;
            this.m_limitPositionImpulse2 = 0;
        }
        var _loc21_: number = _loc5_ * this.m_u1.y - _loc6_ * this.m_u1.x;
        var _loc22_: number = _loc8_ * this.m_u2.y - _loc9_ * this.m_u2.x;
        this.m_limitMass1 =
            _loc2_.m_invMass + _loc2_.m_invI * _loc21_ * _loc21_;
        this.m_limitMass2 =
            _loc3_.m_invMass + _loc3_.m_invI * _loc22_ * _loc22_;
        this.m_pulleyMass =
            this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
        this.m_limitMass1 = 1 / this.m_limitMass1;
        this.m_limitMass2 = 1 / this.m_limitMass2;
        this.m_pulleyMass = 1 / this.m_pulleyMass;
        if (param1.warmStarting) {
            _loc23_ =
                param1.dt * (-this.m_force - this.m_limitForce1) * this.m_u1.x;
            _loc24_ =
                param1.dt * (-this.m_force - this.m_limitForce1) * this.m_u1.y;
            _loc25_ =
                param1.dt *
                (-this.m_ratio * this.m_force - this.m_limitForce2) *
                this.m_u2.x;
            _loc26_ =
                param1.dt *
                (-this.m_ratio * this.m_force - this.m_limitForce2) *
                this.m_u2.y;
            _loc2_.m_linearVelocity.x += _loc2_.m_invMass * _loc23_;
            _loc2_.m_linearVelocity.y += _loc2_.m_invMass * _loc24_;
            _loc2_.m_angularVelocity +=
                _loc2_.m_invI * (_loc5_ * _loc24_ - _loc6_ * _loc23_);
            _loc3_.m_linearVelocity.x += _loc3_.m_invMass * _loc25_;
            _loc3_.m_linearVelocity.y += _loc3_.m_invMass * _loc26_;
            _loc3_.m_angularVelocity +=
                _loc3_.m_invI * (_loc8_ * _loc26_ - _loc9_ * _loc25_);
        } else {
            this.m_force = 0;
            this.m_limitForce1 = 0;
            this.m_limitForce2 = 0;
        }
    }

    public override SolveVelocityConstraints(param1: b2TimeStep) {
        var _loc4_: b2Mat22 = null;
        var _loc10_: number = NaN;
        var _loc11_: number = NaN;
        var _loc12_: number = NaN;
        var _loc13_: number = NaN;
        var _loc14_: number = NaN;
        var _loc15_: number = NaN;
        var _loc16_: number = NaN;
        var _loc17_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        var _loc20_: number = NaN;
        var _loc2_: b2Body = this.m_body1;
        var _loc3_: b2Body = this.m_body2;
        _loc4_ = _loc2_.m_xf.R;
        var _loc5_: number =
            this.m_localAnchor1.x - _loc2_.m_sweep.localCenter.x;
        var _loc6_: number =
            this.m_localAnchor1.y - _loc2_.m_sweep.localCenter.y;
        var _loc7_: number = _loc4_.col1.x * _loc5_ + _loc4_.col2.x * _loc6_;
        _loc6_ = _loc4_.col1.y * _loc5_ + _loc4_.col2.y * _loc6_;
        _loc5_ = _loc7_;
        _loc4_ = _loc3_.m_xf.R;
        var _loc8_: number =
            this.m_localAnchor2.x - _loc3_.m_sweep.localCenter.x;
        var _loc9_: number =
            this.m_localAnchor2.y - _loc3_.m_sweep.localCenter.y;
        _loc7_ = _loc4_.col1.x * _loc8_ + _loc4_.col2.x * _loc9_;
        _loc9_ = _loc4_.col1.y * _loc8_ + _loc4_.col2.y * _loc9_;
        _loc8_ = _loc7_;
        if (this.m_state == b2Joint.e_atUpperLimit) {
            _loc10_ =
                _loc2_.m_linearVelocity.x + -_loc2_.m_angularVelocity * _loc6_;
            _loc11_ =
                _loc2_.m_linearVelocity.y + _loc2_.m_angularVelocity * _loc5_;
            _loc12_ =
                _loc3_.m_linearVelocity.x + -_loc3_.m_angularVelocity * _loc9_;
            _loc13_ =
                _loc3_.m_linearVelocity.y + _loc3_.m_angularVelocity * _loc8_;
            _loc18_ =
                -(this.m_u1.x * _loc10_ + this.m_u1.y * _loc11_) -
                this.m_ratio * (this.m_u2.x * _loc12_ + this.m_u2.y * _loc13_);
            _loc19_ = -param1.inv_dt * this.m_pulleyMass * _loc18_;
            _loc20_ = this.m_force;
            this.m_force = b2Math.b2Max(0, this.m_force + _loc19_);
            _loc19_ = this.m_force - _loc20_;
            _loc14_ = -param1.dt * _loc19_ * this.m_u1.x;
            _loc15_ = -param1.dt * _loc19_ * this.m_u1.y;
            _loc16_ = -param1.dt * this.m_ratio * _loc19_ * this.m_u2.x;
            _loc17_ = -param1.dt * this.m_ratio * _loc19_ * this.m_u2.y;
            _loc2_.m_linearVelocity.x += _loc2_.m_invMass * _loc14_;
            _loc2_.m_linearVelocity.y += _loc2_.m_invMass * _loc15_;
            _loc2_.m_angularVelocity +=
                _loc2_.m_invI * (_loc5_ * _loc15_ - _loc6_ * _loc14_);
            _loc3_.m_linearVelocity.x += _loc3_.m_invMass * _loc16_;
            _loc3_.m_linearVelocity.y += _loc3_.m_invMass * _loc17_;
            _loc3_.m_angularVelocity +=
                _loc3_.m_invI * (_loc8_ * _loc17_ - _loc9_ * _loc16_);
        }
        if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
            _loc10_ =
                _loc2_.m_linearVelocity.x + -_loc2_.m_angularVelocity * _loc6_;
            _loc11_ =
                _loc2_.m_linearVelocity.y + _loc2_.m_angularVelocity * _loc5_;
            _loc18_ = -(this.m_u1.x * _loc10_ + this.m_u1.y * _loc11_);
            _loc19_ = -param1.inv_dt * this.m_limitMass1 * _loc18_;
            _loc20_ = this.m_limitForce1;
            this.m_limitForce1 = b2Math.b2Max(0, this.m_limitForce1 + _loc19_);
            _loc19_ = this.m_limitForce1 - _loc20_;
            _loc14_ = -param1.dt * _loc19_ * this.m_u1.x;
            _loc15_ = -param1.dt * _loc19_ * this.m_u1.y;
            _loc2_.m_linearVelocity.x += _loc2_.m_invMass * _loc14_;
            _loc2_.m_linearVelocity.y += _loc2_.m_invMass * _loc15_;
            _loc2_.m_angularVelocity +=
                _loc2_.m_invI * (_loc5_ * _loc15_ - _loc6_ * _loc14_);
        }
        if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
            _loc12_ =
                _loc3_.m_linearVelocity.x + -_loc3_.m_angularVelocity * _loc9_;
            _loc13_ =
                _loc3_.m_linearVelocity.y + _loc3_.m_angularVelocity * _loc8_;
            _loc18_ = -(this.m_u2.x * _loc12_ + this.m_u2.y * _loc13_);
            _loc19_ = -param1.inv_dt * this.m_limitMass2 * _loc18_;
            _loc20_ = this.m_limitForce2;
            this.m_limitForce2 = b2Math.b2Max(0, this.m_limitForce2 + _loc19_);
            _loc19_ = this.m_limitForce2 - _loc20_;
            _loc16_ = -param1.dt * _loc19_ * this.m_u2.x;
            _loc17_ = -param1.dt * _loc19_ * this.m_u2.y;
            _loc3_.m_linearVelocity.x += _loc3_.m_invMass * _loc16_;
            _loc3_.m_linearVelocity.y += _loc3_.m_invMass * _loc17_;
            _loc3_.m_angularVelocity +=
                _loc3_.m_invI * (_loc8_ * _loc17_ - _loc9_ * _loc16_);
        }
    }

    public override SolvePositionConstraints(): boolean {
        var _loc3_: b2Mat22 = null;
        var _loc8_: number = NaN;
        var _loc9_: number = NaN;
        var _loc10_: number = NaN;
        var _loc11_: number = NaN;
        var _loc12_: number = NaN;
        var _loc13_: number = NaN;
        var _loc14_: number = NaN;
        var _loc15_: number = NaN;
        var _loc16_: number = NaN;
        var _loc17_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        var _loc20_: number = NaN;
        var _loc21_: number = NaN;
        var _loc22_: number = NaN;
        var _loc1_: b2Body = this.m_body1;
        var _loc2_: b2Body = this.m_body2;
        var _loc4_: number =
            this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
        var _loc5_: number =
            this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
        var _loc6_: number =
            this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
        var _loc7_: number =
            this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
        var _loc23_: number = 0;
        if (this.m_state == b2Joint.e_atUpperLimit) {
            _loc3_ = _loc1_.m_xf.R;
            _loc8_ = this.m_localAnchor1.x - _loc1_.m_sweep.localCenter.x;
            _loc9_ = this.m_localAnchor1.y - _loc1_.m_sweep.localCenter.y;
            _loc22_ = _loc3_.col1.x * _loc8_ + _loc3_.col2.x * _loc9_;
            _loc9_ = _loc3_.col1.y * _loc8_ + _loc3_.col2.y * _loc9_;
            _loc8_ = _loc22_;
            _loc3_ = _loc2_.m_xf.R;
            _loc10_ = this.m_localAnchor2.x - _loc2_.m_sweep.localCenter.x;
            _loc11_ = this.m_localAnchor2.y - _loc2_.m_sweep.localCenter.y;
            _loc22_ = _loc3_.col1.x * _loc10_ + _loc3_.col2.x * _loc11_;
            _loc11_ = _loc3_.col1.y * _loc10_ + _loc3_.col2.y * _loc11_;
            _loc10_ = _loc22_;
            _loc12_ = _loc1_.m_sweep.c.x + _loc8_;
            _loc13_ = _loc1_.m_sweep.c.y + _loc9_;
            _loc14_ = _loc2_.m_sweep.c.x + _loc10_;
            _loc15_ = _loc2_.m_sweep.c.y + _loc11_;
            this.m_u1.Set(_loc12_ - _loc4_, _loc13_ - _loc5_);
            this.m_u2.Set(_loc14_ - _loc6_, _loc15_ - _loc7_);
            _loc16_ = this.m_u1.Length();
            _loc17_ = this.m_u2.Length();
            if (_loc16_ > b2Settings.b2_linearSlop) {
                this.m_u1.Multiply(1 / _loc16_);
            } else {
                this.m_u1.SetZero();
            }
            if (_loc17_ > b2Settings.b2_linearSlop) {
                this.m_u2.Multiply(1 / _loc17_);
            } else {
                this.m_u2.SetZero();
            }
            _loc18_ = this.m_constant - _loc16_ - this.m_ratio * _loc17_;
            _loc23_ = b2Math.b2Max(_loc23_, -_loc18_);
            _loc18_ = b2Math.b2Clamp(
                _loc18_ + b2Settings.b2_linearSlop,
                -b2Settings.b2_maxLinearCorrection,
                0,
            );
            _loc19_ = -this.m_pulleyMass * _loc18_;
            _loc20_ = this.m_positionImpulse;
            this.m_positionImpulse = b2Math.b2Max(
                0,
                this.m_positionImpulse + _loc19_,
            );
            _loc19_ = this.m_positionImpulse - _loc20_;
            _loc12_ = -_loc19_ * this.m_u1.x;
            _loc13_ = -_loc19_ * this.m_u1.y;
            _loc14_ = -this.m_ratio * _loc19_ * this.m_u2.x;
            _loc15_ = -this.m_ratio * _loc19_ * this.m_u2.y;
            _loc1_.m_sweep.c.x += _loc1_.m_invMass * _loc12_;
            _loc1_.m_sweep.c.y += _loc1_.m_invMass * _loc13_;
            _loc1_.m_sweep.a +=
                _loc1_.m_invI * (_loc8_ * _loc13_ - _loc9_ * _loc12_);
            _loc2_.m_sweep.c.x += _loc2_.m_invMass * _loc14_;
            _loc2_.m_sweep.c.y += _loc2_.m_invMass * _loc15_;
            _loc2_.m_sweep.a +=
                _loc2_.m_invI * (_loc10_ * _loc15_ - _loc11_ * _loc14_);
            _loc1_.SynchronizeTransform();
            _loc2_.SynchronizeTransform();
        }
        if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
            _loc3_ = _loc1_.m_xf.R;
            _loc8_ = this.m_localAnchor1.x - _loc1_.m_sweep.localCenter.x;
            _loc9_ = this.m_localAnchor1.y - _loc1_.m_sweep.localCenter.y;
            _loc22_ = _loc3_.col1.x * _loc8_ + _loc3_.col2.x * _loc9_;
            _loc9_ = _loc3_.col1.y * _loc8_ + _loc3_.col2.y * _loc9_;
            _loc8_ = _loc22_;
            _loc12_ = _loc1_.m_sweep.c.x + _loc8_;
            _loc13_ = _loc1_.m_sweep.c.y + _loc9_;
            this.m_u1.Set(_loc12_ - _loc4_, _loc13_ - _loc5_);
            _loc16_ = this.m_u1.Length();
            if (_loc16_ > b2Settings.b2_linearSlop) {
                this.m_u1.x *= 1 / _loc16_;
                this.m_u1.y *= 1 / _loc16_;
            } else {
                this.m_u1.SetZero();
            }
            _loc18_ = this.m_maxLength1 - _loc16_;
            _loc23_ = b2Math.b2Max(_loc23_, -_loc18_);
            _loc18_ = b2Math.b2Clamp(
                _loc18_ + b2Settings.b2_linearSlop,
                -b2Settings.b2_maxLinearCorrection,
                0,
            );
            _loc19_ = -this.m_limitMass1 * _loc18_;
            _loc21_ = this.m_limitPositionImpulse1;
            this.m_limitPositionImpulse1 = b2Math.b2Max(
                0,
                this.m_limitPositionImpulse1 + _loc19_,
            );
            _loc19_ = this.m_limitPositionImpulse1 - _loc21_;
            _loc12_ = -_loc19_ * this.m_u1.x;
            _loc13_ = -_loc19_ * this.m_u1.y;
            _loc1_.m_sweep.c.x += _loc1_.m_invMass * _loc12_;
            _loc1_.m_sweep.c.y += _loc1_.m_invMass * _loc13_;
            _loc1_.m_sweep.a +=
                _loc1_.m_invI * (_loc8_ * _loc13_ - _loc9_ * _loc12_);
            _loc1_.SynchronizeTransform();
        }
        if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
            _loc3_ = _loc2_.m_xf.R;
            _loc10_ = this.m_localAnchor2.x - _loc2_.m_sweep.localCenter.x;
            _loc11_ = this.m_localAnchor2.y - _loc2_.m_sweep.localCenter.y;
            _loc22_ = _loc3_.col1.x * _loc10_ + _loc3_.col2.x * _loc11_;
            _loc11_ = _loc3_.col1.y * _loc10_ + _loc3_.col2.y * _loc11_;
            _loc10_ = _loc22_;
            _loc14_ = _loc2_.m_sweep.c.x + _loc10_;
            _loc15_ = _loc2_.m_sweep.c.y + _loc11_;
            this.m_u2.Set(_loc14_ - _loc6_, _loc15_ - _loc7_);
            _loc17_ = this.m_u2.Length();
            if (_loc17_ > b2Settings.b2_linearSlop) {
                this.m_u2.x *= 1 / _loc17_;
                this.m_u2.y *= 1 / _loc17_;
            } else {
                this.m_u2.SetZero();
            }
            _loc18_ = this.m_maxLength2 - _loc17_;
            _loc23_ = b2Math.b2Max(_loc23_, -_loc18_);
            _loc18_ = b2Math.b2Clamp(
                _loc18_ + b2Settings.b2_linearSlop,
                -b2Settings.b2_maxLinearCorrection,
                0,
            );
            _loc19_ = -this.m_limitMass2 * _loc18_;
            _loc21_ = this.m_limitPositionImpulse2;
            this.m_limitPositionImpulse2 = b2Math.b2Max(
                0,
                this.m_limitPositionImpulse2 + _loc19_,
            );
            _loc19_ = this.m_limitPositionImpulse2 - _loc21_;
            _loc14_ = -_loc19_ * this.m_u2.x;
            _loc15_ = -_loc19_ * this.m_u2.y;
            _loc2_.m_sweep.c.x += _loc2_.m_invMass * _loc14_;
            _loc2_.m_sweep.c.y += _loc2_.m_invMass * _loc15_;
            _loc2_.m_sweep.a +=
                _loc2_.m_invI * (_loc10_ * _loc15_ - _loc11_ * _loc14_);
            _loc2_.SynchronizeTransform();
        }
        return _loc23_ < b2Settings.b2_linearSlop;
    }
}