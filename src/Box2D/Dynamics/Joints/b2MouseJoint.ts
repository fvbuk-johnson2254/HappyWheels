import b2Settings from "@/Box2D/Common/b2Settings";
import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2TimeStep from "@/Box2D/Dynamics/b2TimeStep";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2MouseJointDef from "@/Box2D/Dynamics/Joints/b2MouseJointDef";

export default class b2MouseJoint extends b2Joint {
    private K: b2Mat22;
    private K1: b2Mat22;
    private K2: b2Mat22;
    public m_localAnchor: b2Vec2;
    public m_target: b2Vec2;
    public m_impulse: b2Vec2;
    public m_mass: b2Mat22;
    public m_C: b2Vec2;
    public m_maxForce: number;
    public m_beta: number;
    public m_gamma: number;

    constructor(param1: b2MouseJointDef) {
        super(param1);
        var _loc3_: number = NaN;
        this.K = new b2Mat22();
        this.K1 = new b2Mat22();
        this.K2 = new b2Mat22();
        this.m_localAnchor = new b2Vec2();
        this.m_target = new b2Vec2();
        this.m_impulse = new b2Vec2();
        this.m_mass = new b2Mat22();
        this.m_C = new b2Vec2();
        this.m_target.SetV(param1.target);
        var _loc2_: number = this.m_target.x - this.m_body2.m_xf.position.x;
        _loc3_ = this.m_target.y - this.m_body2.m_xf.position.y;
        var _loc4_: b2Mat22 = this.m_body2.m_xf.R;
        this.m_localAnchor.x = _loc2_ * _loc4_.col1.x + _loc3_ * _loc4_.col1.y;
        this.m_localAnchor.y = _loc2_ * _loc4_.col2.x + _loc3_ * _loc4_.col2.y;
        this.m_maxForce = param1.maxForce;
        this.m_impulse.SetZero();
        var _loc5_: number = this.m_body2.m_mass;
        var _loc6_: number = 2 * b2Settings.b2_pi * param1.frequencyHz;
        var _loc7_: number = 2 * _loc5_ * param1.dampingRatio * _loc6_;
        var _loc8_: number = param1.timeStep * _loc5_ * (_loc6_ * _loc6_);
        this.m_gamma = 1 / (_loc7_ + _loc8_);
        this.m_beta = _loc8_ / (_loc7_ + _loc8_);
    }

    public override GetAnchor1(): b2Vec2 {
        return this.m_target;
    }

    public override GetAnchor2(): b2Vec2 {
        return this.m_body2.GetWorldPoint(this.m_localAnchor);
    }

    public override GetReactionForce(): b2Vec2 {
        return this.m_impulse;
    }

    public override GetReactionTorque(): number {
        return 0;
    }

    public SetTarget(param1: b2Vec2) {
        if (this.m_body2.IsSleeping()) {
            this.m_body2.WakeUp();
        }
        this.m_target = param1;
    }

    public override InitVelocityConstraints(param1: b2TimeStep) {
        var _loc2_: b2Body = null;
        var _loc3_: b2Mat22 = null;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        _loc2_ = this.m_body2;
        _loc3_ = _loc2_.m_xf.R;
        _loc4_ = this.m_localAnchor.x - _loc2_.m_sweep.localCenter.x;
        _loc5_ = this.m_localAnchor.y - _loc2_.m_sweep.localCenter.y;
        var _loc6_: number = _loc3_.col1.x * _loc4_ + _loc3_.col2.x * _loc5_;
        _loc5_ = _loc3_.col1.y * _loc4_ + _loc3_.col2.y * _loc5_;
        _loc4_ = _loc6_;
        _loc7_ = _loc2_.m_invMass;
        _loc8_ = _loc2_.m_invI;
        this.K1.col1.x = _loc7_;
        this.K1.col2.x = 0;
        this.K1.col1.y = 0;
        this.K1.col2.y = _loc7_;
        this.K2.col1.x = _loc8_ * _loc5_ * _loc5_;
        this.K2.col2.x = -_loc8_ * _loc4_ * _loc5_;
        this.K2.col1.y = -_loc8_ * _loc4_ * _loc5_;
        this.K2.col2.y = _loc8_ * _loc4_ * _loc4_;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.col1.x += this.m_gamma;
        this.K.col2.y += this.m_gamma;
        this.K.Invert(this.m_mass);
        this.m_C.x = _loc2_.m_sweep.c.x + _loc4_ - this.m_target.x;
        this.m_C.y = _loc2_.m_sweep.c.y + _loc5_ - this.m_target.y;
        _loc2_.m_angularVelocity *= 0.98;
        var _loc9_: number = param1.dt * this.m_impulse.x;
        var _loc10_: number = param1.dt * this.m_impulse.y;
        _loc2_.m_linearVelocity.x += _loc7_ * _loc9_;
        _loc2_.m_linearVelocity.y += _loc7_ * _loc10_;
        _loc2_.m_angularVelocity +=
            _loc8_ * (_loc4_ * _loc10_ - _loc5_ * _loc9_);
    }

    public override SolveVelocityConstraints(param1: b2TimeStep) {
        var _loc3_: b2Mat22 = null;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc2_: b2Body = this.m_body2;
        _loc3_ = _loc2_.m_xf.R;
        var _loc6_: number =
            this.m_localAnchor.x - _loc2_.m_sweep.localCenter.x;
        var _loc7_: number =
            this.m_localAnchor.y - _loc2_.m_sweep.localCenter.y;
        _loc4_ = _loc3_.col1.x * _loc6_ + _loc3_.col2.x * _loc7_;
        _loc7_ = _loc3_.col1.y * _loc6_ + _loc3_.col2.y * _loc7_;
        _loc6_ = _loc4_;
        var _loc8_: number =
            _loc2_.m_linearVelocity.x + -_loc2_.m_angularVelocity * _loc7_;
        var _loc9_: number =
            _loc2_.m_linearVelocity.y + _loc2_.m_angularVelocity * _loc6_;
        _loc3_ = this.m_mass;
        _loc4_ =
            _loc8_ +
            this.m_beta * param1.inv_dt * this.m_C.x +
            this.m_gamma * param1.dt * this.m_impulse.x;
        _loc5_ =
            _loc9_ +
            this.m_beta * param1.inv_dt * this.m_C.y +
            this.m_gamma * param1.dt * this.m_impulse.y;
        var _loc10_: number =
            -param1.inv_dt * (_loc3_.col1.x * _loc4_ + _loc3_.col2.x * _loc5_);
        var _loc11_: number =
            -param1.inv_dt * (_loc3_.col1.y * _loc4_ + _loc3_.col2.y * _loc5_);
        var _loc12_: number = this.m_impulse.x;
        var _loc13_: number = this.m_impulse.y;
        this.m_impulse.x += _loc10_;
        this.m_impulse.y += _loc11_;
        var _loc14_: number = this.m_impulse.Length();
        if (_loc14_ > this.m_maxForce) {
            this.m_impulse.Multiply(this.m_maxForce / _loc14_);
        }
        _loc10_ = this.m_impulse.x - _loc12_;
        _loc11_ = this.m_impulse.y - _loc13_;
        var _loc15_: number = param1.dt * _loc10_;
        var _loc16_: number = param1.dt * _loc11_;
        _loc2_.m_linearVelocity.x += _loc2_.m_invMass * _loc15_;
        _loc2_.m_linearVelocity.y += _loc2_.m_invMass * _loc16_;
        _loc2_.m_angularVelocity +=
            _loc2_.m_invI * (_loc6_ * _loc16_ - _loc7_ * _loc15_);
    }

    public override SolvePositionConstraints(): boolean {
        return true;
    }
}