import b2MassData from "@/Box2D/Collision/Shapes/b2MassData";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ShapeDef from "@/Box2D/Collision/Shapes/b2ShapeDef";
import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Sweep from "@/Box2D/Common/Math/b2Sweep";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2XForm from "@/Box2D/Common/Math/b2XForm";
import b2ContactEdge from "@/Box2D/Dynamics/Contacts/b2ContactEdge";
import b2JointEdge from "@/Box2D/Dynamics/Joints/b2JointEdge";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";

export default class b2Body {
    private static s_massData = new b2MassData();
    private static s_xf1 = new b2XForm();
    public static e_frozenFlag: number = 2;
    public static e_islandFlag: number = 4;
    public static e_sleepFlag: number = 8;
    public static e_allowSleepFlag: number = 16;
    public static e_bulletFlag: number = 32;
    public static e_fixedRotationFlag: number = 64;
    public static e_staticType: number = 1;
    public static e_dynamicType: number = 2;
    public static e_maxTypes: number = 3;
    public m_flags: number;
    public m_type: number;
    public m_xf = new b2XForm();
    public m_sweep = new b2Sweep();
    public m_linearVelocity = new b2Vec2();
    public m_angularVelocity: number;
    public m_force = new b2Vec2();
    public m_torque: number;
    public m_world: b2World;
    public m_prev: b2Body;
    public m_next: b2Body;
    public m_shapeList: b2Shape;
    public m_shapeCount: number;
    public m_jointList: b2JointEdge;
    public m_contactList: b2ContactEdge;
    public m_mass: number;
    public m_invMass: number;
    public m_I: number;
    public m_invI: number;
    public m_linearDamping: number;
    public m_angularDamping: number;
    public m_sleepTime: number;
    public m_userData;
    public destroyed: boolean;

    constructor(param1: b2BodyDef, param2: b2World) {
        this.m_flags = 0;
        if (param1.isBullet) {
            this.m_flags |= b2Body.e_bulletFlag;
        }
        if (param1.fixedRotation) {
            this.m_flags |= b2Body.e_fixedRotationFlag;
        }
        if (param1.allowSleep) {
            this.m_flags |= b2Body.e_allowSleepFlag;
        }
        if (param1.isSleeping) {
            this.m_flags |= b2Body.e_sleepFlag;
        }
        this.m_world = param2;
        this.m_xf.position.SetV(param1.position);
        this.m_xf.R.Set(param1.angle);
        this.m_sweep.localCenter.SetV(param1.massData.center);
        this.m_sweep.t0 = 1;
        this.m_sweep.a0 = this.m_sweep.a = param1.angle;
        var _loc3_: b2Mat22 = this.m_xf.R;
        var _loc4_: b2Vec2 = this.m_sweep.localCenter;
        this.m_sweep.c.x = _loc3_.col1.x * _loc4_.x + _loc3_.col2.x * _loc4_.y;
        this.m_sweep.c.y = _loc3_.col1.y * _loc4_.x + _loc3_.col2.y * _loc4_.y;
        this.m_sweep.c.x += this.m_xf.position.x;
        this.m_sweep.c.y += this.m_xf.position.y;
        this.m_sweep.c0.SetV(this.m_sweep.c);
        this.m_jointList = null;
        this.m_contactList = null;
        this.m_prev = null;
        this.m_next = null;
        this.m_linearDamping = param1.linearDamping;
        this.m_angularDamping = param1.angularDamping;
        this.m_force.Set(0, 0);
        this.m_torque = 0;
        this.m_linearVelocity.SetZero();
        this.m_angularVelocity = 0;
        this.m_sleepTime = 0;
        this.m_invMass = 0;
        this.m_I = 0;
        this.m_invI = 0;
        this.m_mass = param1.massData.mass;
        if (this.m_mass > 0) {
            this.m_invMass = 1 / this.m_mass;
        }
        if ((this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
            this.m_I = param1.massData.I;
        }
        if (this.m_I > 0) {
            this.m_invI = 1 / this.m_I;
        }
        if (this.m_invMass == 0 && this.m_invI == 0) {
            this.m_type = b2Body.e_staticType;
        } else {
            this.m_type = b2Body.e_dynamicType;
        }
        this.m_userData = param1.userData;
        this.m_shapeList = null;
        this.m_shapeCount = 0;
    }

    public CreateShape(param1: b2ShapeDef): b2Shape {
        if (this.m_world.m_lock == true) {
            return null;
        }
        var _loc2_ = b2Shape.Create(param1, this.m_world.m_blockAllocator);
        _loc2_.m_next = this.m_shapeList;
        this.m_shapeList = _loc2_;
        ++this.m_shapeCount;
        _loc2_.m_body = this;
        _loc2_.CreateProxy(this.m_world.m_broadPhase, this.m_xf);
        _loc2_.UpdateSweepRadius(this.m_sweep.localCenter);
        return _loc2_;
    }

    public DestroyShape(param1: b2Shape) {
        if (this.m_world.m_lock == true) {
            return;
        }
        param1.DestroyProxy(this.m_world.m_broadPhase);
        var _loc2_: b2Shape = this.m_shapeList;
        var _loc3_: b2Shape = null;
        var _loc4_: boolean = false;
        while (_loc2_ != null) {
            if (_loc2_ == param1) {
                if (_loc3_) {
                    _loc3_.m_next = param1.m_next;
                } else {
                    this.m_shapeList = param1.m_next;
                }
                _loc4_ = true;
                break;
            }
            _loc3_ = _loc2_;
            _loc2_ = _loc2_.m_next;
        }
        param1.m_body = null;
        param1.m_next = null;
        --this.m_shapeCount;
        b2Shape.Destroy(param1, this.m_world.m_blockAllocator);
    }

    public SetMass(param1: b2MassData) {
        var _loc2_: b2Shape = null;
        if (this.m_world.m_lock == true) {
            return;
        }
        this.m_invMass = 0;
        this.m_I = 0;
        this.m_invI = 0;
        this.m_mass = param1.mass;
        if (this.m_mass > 0) {
            this.m_invMass = 1 / this.m_mass;
        }
        if ((this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
            this.m_I = param1.I;
        }
        if (this.m_I > 0) {
            this.m_invI = 1 / this.m_I;
        }
        this.m_sweep.localCenter.SetV(param1.center);
        var _loc3_: b2Mat22 = this.m_xf.R;
        var _loc4_: b2Vec2 = this.m_sweep.localCenter;
        this.m_sweep.c.x = _loc3_.col1.x * _loc4_.x + _loc3_.col2.x * _loc4_.y;
        this.m_sweep.c.y = _loc3_.col1.y * _loc4_.x + _loc3_.col2.y * _loc4_.y;
        this.m_sweep.c.x += this.m_xf.position.x;
        this.m_sweep.c.y += this.m_xf.position.y;
        this.m_sweep.c0.SetV(this.m_sweep.c);
        _loc2_ = this.m_shapeList;
        while (_loc2_) {
            _loc2_.UpdateSweepRadius(this.m_sweep.localCenter);
            _loc2_ = _loc2_.m_next;
        }
        var _loc5_: number = this.m_type;
        if (this.m_invMass == 0 && this.m_invI == 0) {
            this.m_type = b2Body.e_staticType;
        } else {
            this.m_type = b2Body.e_dynamicType;
        }
        if (_loc5_ != this.m_type) {
            _loc2_ = this.m_shapeList;
            while (_loc2_) {
                _loc2_.RefilterProxy(this.m_world.m_broadPhase, this.m_xf);
                _loc2_ = _loc2_.m_next;
            }
        }
    }

    public SetMassFromShapes() {
        var _loc1_: b2Shape = null;
        if (this.m_world.m_lock == true) {
            return;
        }
        this.m_mass = 0;
        this.m_invMass = 0;
        this.m_I = 0;
        this.m_invI = 0;
        var _loc2_: number = 0;
        var _loc3_: number = 0;
        var _loc4_: b2MassData = b2Body.s_massData;
        _loc1_ = this.m_shapeList;
        while (_loc1_) {
            _loc1_.ComputeMass(_loc4_);
            this.m_mass += _loc4_.mass;
            _loc2_ += _loc4_.mass * _loc4_.center.x;
            _loc3_ += _loc4_.mass * _loc4_.center.y;
            this.m_I += _loc4_.I;
            _loc1_ = _loc1_.m_next;
        }
        if (this.m_mass > 0) {
            this.m_invMass = 1 / this.m_mass;
            _loc2_ *= this.m_invMass;
            _loc3_ *= this.m_invMass;
        }
        if (this.m_I > 0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
            this.m_I -= this.m_mass * (_loc2_ * _loc2_ + _loc3_ * _loc3_);
            this.m_invI = 1 / this.m_I;
        } else {
            this.m_I = 0;
            this.m_invI = 0;
        }
        this.m_sweep.localCenter.Set(_loc2_, _loc3_);
        var _loc5_: b2Mat22 = this.m_xf.R;
        var _loc6_: b2Vec2 = this.m_sweep.localCenter;
        this.m_sweep.c.x = _loc5_.col1.x * _loc6_.x + _loc5_.col2.x * _loc6_.y;
        this.m_sweep.c.y = _loc5_.col1.y * _loc6_.x + _loc5_.col2.y * _loc6_.y;
        this.m_sweep.c.x += this.m_xf.position.x;
        this.m_sweep.c.y += this.m_xf.position.y;
        this.m_sweep.c0.SetV(this.m_sweep.c);
        _loc1_ = this.m_shapeList;
        while (_loc1_) {
            _loc1_.UpdateSweepRadius(this.m_sweep.localCenter);
            _loc1_ = _loc1_.m_next;
        }
        var _loc7_: number = this.m_type;
        if (this.m_invMass == 0 && this.m_invI == 0) {
            this.m_type = b2Body.e_staticType;
        } else {
            this.m_type = b2Body.e_dynamicType;
        }
        if (_loc7_ != this.m_type) {
            _loc1_ = this.m_shapeList;
            while (_loc1_) {
                _loc1_.RefilterProxy(this.m_world.m_broadPhase, this.m_xf);
                _loc1_ = _loc1_.m_next;
            }
        }
    }

    public SetXForm(param1: b2Vec2, param2: number): boolean {
        var _loc3_: b2Shape = null;
        var _loc7_: boolean = false;
        if (this.m_world.m_lock == true) {
            return true;
        }
        if (this.IsFrozen()) {
            return false;
        }
        this.m_xf.R.Set(param2);
        this.m_xf.position.SetV(param1);
        var _loc4_: b2Mat22 = this.m_xf.R;
        var _loc5_: b2Vec2 = this.m_sweep.localCenter;
        this.m_sweep.c.x = _loc4_.col1.x * _loc5_.x + _loc4_.col2.x * _loc5_.y;
        this.m_sweep.c.y = _loc4_.col1.y * _loc5_.x + _loc4_.col2.y * _loc5_.y;
        this.m_sweep.c.x += this.m_xf.position.x;
        this.m_sweep.c.y += this.m_xf.position.y;
        this.m_sweep.c0.SetV(this.m_sweep.c);
        this.m_sweep.a0 = this.m_sweep.a = param2;
        var _loc6_: boolean = false;
        _loc3_ = this.m_shapeList;
        while (_loc3_) {
            _loc7_ = _loc3_.Synchronize(
                this.m_world.m_broadPhase,
                this.m_xf,
                this.m_xf,
            );
            if (_loc7_ == false) {
                _loc6_ = true;
                break;
            }
            _loc3_ = _loc3_.m_next;
        }
        if (_loc6_ == true) {
            this.m_flags |= b2Body.e_frozenFlag;
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0;
            _loc3_ = this.m_shapeList;
            while (_loc3_) {
                _loc3_.DestroyProxy(this.m_world.m_broadPhase);
                _loc3_ = _loc3_.m_next;
            }
            return false;
        }
        this.m_world.m_broadPhase.Commit();
        return true;
    }

    public GetXForm(): b2XForm {
        return this.m_xf;
    }

    public GetPosition(): b2Vec2 {
        return this.m_xf.position;
    }

    public GetAngle(): number {
        return this.m_sweep.a;
    }

    public GetWorldCenter(): b2Vec2 {
        return this.m_sweep.c;
    }

    public GetLocalCenter(): b2Vec2 {
        return this.m_sweep.localCenter;
    }

    public SetLinearVelocity(param1: b2Vec2) {
        this.m_linearVelocity.SetV(param1);
    }

    public GetLinearVelocity(): b2Vec2 {
        return this.m_linearVelocity;
    }

    public SetAngularVelocity(param1: number) {
        this.m_angularVelocity = param1;
    }

    public GetAngularVelocity(): number {
        return this.m_angularVelocity;
    }

    public ApplyForce(param1: b2Vec2, param2: b2Vec2) {
        if (this.IsSleeping()) {
            this.WakeUp();
        }
        this.m_force.x += param1.x;
        this.m_force.y += param1.y;
        this.m_torque +=
            (param2.x - this.m_sweep.c.x) * param1.y -
            (param2.y - this.m_sweep.c.y) * param1.x;
    }

    public ApplyTorque(param1: number) {
        if (this.IsSleeping()) {
            this.WakeUp();
        }
        this.m_torque += param1;
    }

    public ApplyImpulse(param1: b2Vec2, param2: b2Vec2) {
        if (this.IsSleeping()) {
            this.WakeUp();
        }
        this.m_linearVelocity.x += this.m_invMass * param1.x;
        this.m_linearVelocity.y += this.m_invMass * param1.y;
        this.m_angularVelocity +=
            this.m_invI *
            ((param2.x - this.m_sweep.c.x) * param1.y -
                (param2.y - this.m_sweep.c.y) * param1.x);
    }

    public GetMass(): number {
        return this.m_mass;
    }

    public GetInertia(): number {
        return this.m_I;
    }

    public GetWorldPoint(param1: b2Vec2): b2Vec2 {
        var _loc2_: b2Mat22 = this.m_xf.R;
        var _loc3_ = new b2Vec2(
            _loc2_.col1.x * param1.x + _loc2_.col2.x * param1.y,
            _loc2_.col1.y * param1.x + _loc2_.col2.y * param1.y,
        );
        _loc3_.x += this.m_xf.position.x;
        _loc3_.y += this.m_xf.position.y;
        return _loc3_;
    }

    public GetWorldVector(param1: b2Vec2): b2Vec2 {
        return b2Math.b2MulMV(this.m_xf.R, param1);
    }

    public GetLocalPoint(param1: b2Vec2): b2Vec2 {
        return b2Math.b2MulXT(this.m_xf, param1);
    }

    public GetLocalVector(param1: b2Vec2): b2Vec2 {
        return b2Math.b2MulTMV(this.m_xf.R, param1);
    }

    public GetLinearVelocityFromWorldPoint(param1: b2Vec2): b2Vec2 {
        return new b2Vec2(
            this.m_linearVelocity.x +
            this.m_angularVelocity * (param1.y - this.m_sweep.c.y),
            this.m_linearVelocity.y -
            this.m_angularVelocity * (param1.x - this.m_sweep.c.x),
        );
    }

    public GetLinearVelocityFromLocalPoint(param1: b2Vec2): b2Vec2 {
        var _loc2_: b2Mat22 = this.m_xf.R;
        var _loc3_ = new b2Vec2(
            _loc2_.col1.x * param1.x + _loc2_.col2.x * param1.y,
            _loc2_.col1.y * param1.x + _loc2_.col2.y * param1.y,
        );
        _loc3_.x += this.m_xf.position.x;
        _loc3_.y += this.m_xf.position.y;
        return new b2Vec2(
            this.m_linearVelocity.x +
            this.m_angularVelocity * (_loc3_.y - this.m_sweep.c.y),
            this.m_linearVelocity.y -
            this.m_angularVelocity * (_loc3_.x - this.m_sweep.c.x),
        );
    }

    public IsBullet(): boolean {
        return (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
    }

    public SetBullet(param1: boolean) {
        if (param1) {
            this.m_flags |= b2Body.e_bulletFlag;
        } else {
            this.m_flags &= ~b2Body.e_bulletFlag;
        }
    }

    public IsStatic(): boolean {
        return this.m_type == b2Body.e_staticType;
    }

    public IsDynamic(): boolean {
        return this.m_type == b2Body.e_dynamicType;
    }

    public IsFrozen(): boolean {
        return (this.m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag;
    }

    public IsSleeping(): boolean {
        return (this.m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag;
    }

    public AllowSleeping(param1: boolean) {
        if (param1) {
            this.m_flags |= b2Body.e_allowSleepFlag;
        } else {
            this.m_flags &= ~b2Body.e_allowSleepFlag;
            this.WakeUp();
        }
    }

    public WakeUp() {
        this.m_flags &= ~b2Body.e_sleepFlag;
        this.m_sleepTime = 0;
    }

    public PutToSleep() {
        this.m_flags |= b2Body.e_sleepFlag;
        this.m_sleepTime = 0;
        this.m_linearVelocity.SetZero();
        this.m_angularVelocity = 0;
        this.m_force.SetZero();
        this.m_torque = 0;
    }

    public GetShapeList(): b2Shape {
        return this.m_shapeList;
    }

    public GetJointList(): b2JointEdge {
        return this.m_jointList;
    }

    public GetNext(): b2Body {
        return this.m_next;
    }

    public GetUserData() {
        return this.m_userData;
    }

    public SetUserData(param1) {
        this.m_userData = param1;
    }

    public GetWorld(): b2World {
        return this.m_world;
    }

    public SynchronizeShapes(): boolean {
        var _loc4_: b2Shape = null;
        var _loc1_: b2XForm = b2Body.s_xf1;
        _loc1_.R.Set(this.m_sweep.a0);
        var _loc2_: b2Mat22 = _loc1_.R;
        var _loc3_: b2Vec2 = this.m_sweep.localCenter;
        _loc1_.position.x =
            this.m_sweep.c0.x -
            (_loc2_.col1.x * _loc3_.x + _loc2_.col2.x * _loc3_.y);
        _loc1_.position.y =
            this.m_sweep.c0.y -
            (_loc2_.col1.y * _loc3_.x + _loc2_.col2.y * _loc3_.y);
        var _loc5_: boolean = true;
        _loc4_ = this.m_shapeList;
        while (_loc4_) {
            _loc5_ = _loc4_.Synchronize(
                this.m_world.m_broadPhase,
                _loc1_,
                this.m_xf,
            );
            if (_loc5_ == false) {
                break;
            }
            _loc4_ = _loc4_.m_next;
        }
        if (_loc5_ == false) {
            this.m_flags |= b2Body.e_frozenFlag;
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0;
            _loc4_ = this.m_shapeList;
            while (_loc4_) {
                _loc4_.DestroyProxy(this.m_world.m_broadPhase);
                _loc4_ = _loc4_.m_next;
            }
            return false;
        }
        return true;
    }

    public SynchronizeTransform() {
        this.m_xf.R.Set(this.m_sweep.a);
        var _loc1_: b2Mat22 = this.m_xf.R;
        var _loc2_: b2Vec2 = this.m_sweep.localCenter;
        this.m_xf.position.x =
            this.m_sweep.c.x -
            (_loc1_.col1.x * _loc2_.x + _loc1_.col2.x * _loc2_.y);
        this.m_xf.position.y =
            this.m_sweep.c.y -
            (_loc1_.col1.y * _loc2_.x + _loc1_.col2.y * _loc2_.y);
    }

    public IsConnected(param1: b2Body): boolean {
        var _loc2_: b2JointEdge = this.m_jointList;
        while (_loc2_) {
            if (_loc2_.other == param1) {
                return _loc2_.joint.m_collideConnected == false;
            }
            _loc2_ = _loc2_.next;
        }
        return false;
    }

    public Advance(param1: number) {
        this.m_sweep.Advance(param1);
        this.m_sweep.c.SetV(this.m_sweep.c0);
        this.m_sweep.a = this.m_sweep.a0;
        this.SynchronizeTransform();
    }
}