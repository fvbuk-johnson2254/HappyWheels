import b2Manifold from "@/Box2D/Collision/b2Manifold";
import b2ManifoldPoint from "@/Box2D/Collision/b2ManifoldPoint";
import b2Settings from "@/Box2D/Common/b2Settings";
import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2ContactListener from "@/Box2D/Dynamics/b2ContactListener";
import b2TimeStep from "@/Box2D/Dynamics/b2TimeStep";
import b2Contact from "@/Box2D/Dynamics/Contacts/b2Contact";
import b2ContactConstraint from "@/Box2D/Dynamics/Contacts/b2ContactConstraint";
import b2ContactConstraintPoint from "@/Box2D/Dynamics/Contacts/b2ContactConstraintPoint";
import b2ContactResult from "@/Box2D/Dynamics/Contacts/b2ContactResult";
import b2ContactSolver from "@/Box2D/Dynamics/Contacts/b2ContactSolver";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";

export default class b2Island {
    private static s_reportCR = new b2ContactResult();
    public m_allocator;
    public m_listener: b2ContactListener;
    public m_bodies: any[];
    public m_contacts: any[];
    public m_joints: any[];
    public m_bodyCount: number;
    public m_jointCount: number;
    public m_contactCount: number;
    public m_bodyCapacity: number;
    public m_contactCapacity: number;
    public m_jointCapacity: number;
    public m_positionIterationCount: number;

    constructor(
        param1: number,
        param2: number,
        param3: number,
        param4,
        param5: b2ContactListener,
    ) {
        var _loc6_: number = 0;

        this.m_bodyCapacity = param1;
        this.m_contactCapacity = param2;
        this.m_jointCapacity = param3;
        this.m_bodyCount = 0;
        this.m_contactCount = 0;
        this.m_jointCount = 0;
        this.m_allocator = param4;
        this.m_listener = param5;
        this.m_bodies = new Array(param1);
        _loc6_ = 0;
        while (_loc6_ < param1) {
            this.m_bodies[_loc6_] = null;
            _loc6_++;
        }
        this.m_contacts = new Array(param2);
        _loc6_ = 0;
        while (_loc6_ < param2) {
            this.m_contacts[_loc6_] = null;
            _loc6_++;
        }
        this.m_joints = new Array(param3);
        _loc6_ = 0;
        while (_loc6_ < param3) {
            this.m_joints[_loc6_] = null;
            _loc6_++;
        }
        this.m_positionIterationCount = 0;
    }

    public Clear() {
        this.m_bodyCount = 0;
        this.m_contactCount = 0;
        this.m_jointCount = 0;
    }

    public Solve(
        param1: b2TimeStep,
        param2: b2Vec2,
        param3: boolean,
        param4: boolean,
    ) {
        var _loc5_: number = 0;
        var _loc6_: b2Body = null;
        var _loc7_: b2Joint = null;
        var _loc9_: number = 0;
        var _loc10_: boolean = false;
        var _loc11_: boolean = false;
        var _loc12_: boolean = false;
        var _loc13_: number = NaN;
        var _loc14_: number = NaN;
        var _loc15_: number = NaN;
        _loc5_ = 0;
        while (_loc5_ < this.m_bodyCount) {
            _loc6_ = this.m_bodies[_loc5_];
            if (!_loc6_.IsStatic()) {
                _loc6_.m_linearVelocity.x +=
                    param1.dt *
                    (param2.x + _loc6_.m_invMass * _loc6_.m_force.x);
                _loc6_.m_linearVelocity.y +=
                    param1.dt *
                    (param2.y + _loc6_.m_invMass * _loc6_.m_force.y);
                _loc6_.m_angularVelocity +=
                    param1.dt * _loc6_.m_invI * _loc6_.m_torque;
                _loc6_.m_force.SetZero();
                _loc6_.m_torque = 0;
                _loc6_.m_linearVelocity.Multiply(
                    b2Math.b2Clamp(
                        1 - param1.dt * _loc6_.m_linearDamping,
                        0,
                        1,
                    ),
                );
                _loc6_.m_angularVelocity *= b2Math.b2Clamp(
                    1 - param1.dt * _loc6_.m_angularDamping,
                    0,
                    1,
                );
                if (
                    _loc6_.m_linearVelocity.LengthSquared() >
                    b2Settings.b2_maxLinearVelocitySquared
                ) {
                    _loc6_.m_linearVelocity.Normalize();
                    _loc6_.m_linearVelocity.x *=
                        b2Settings.b2_maxLinearVelocity;
                    _loc6_.m_linearVelocity.y *=
                        b2Settings.b2_maxLinearVelocity;
                }
                if (
                    _loc6_.m_angularVelocity * _loc6_.m_angularVelocity >
                    b2Settings.b2_maxAngularVelocitySquared
                ) {
                    if (_loc6_.m_angularVelocity < 0) {
                        _loc6_.m_angularVelocity =
                            -b2Settings.b2_maxAngularVelocity;
                    } else {
                        _loc6_.m_angularVelocity =
                            b2Settings.b2_maxAngularVelocity;
                    }
                }
            }
            _loc5_++;
        }
        var _loc8_ = new b2ContactSolver(
            param1,
            this.m_contacts,
            this.m_contactCount,
            this.m_allocator,
        );
        _loc8_.InitVelocityConstraints(param1);
        _loc5_ = 0;
        while (_loc5_ < this.m_jointCount) {
            _loc7_ = this.m_joints[_loc5_];
            _loc7_.InitVelocityConstraints(param1);
            _loc5_++;
        }
        _loc5_ = 0;
        while (_loc5_ < param1.maxIterations) {
            _loc8_.SolveVelocityConstraints();
            _loc9_ = 0;
            while (_loc9_ < this.m_jointCount) {
                _loc7_ = this.m_joints[_loc9_];
                _loc7_.SolveVelocityConstraints(param1);
                _loc9_++;
            }
            _loc5_++;
        }
        _loc8_.FinalizeVelocityConstraints();
        _loc5_ = 0;
        while (_loc5_ < this.m_bodyCount) {
            _loc6_ = this.m_bodies[_loc5_];
            if (!_loc6_.IsStatic()) {
                _loc6_.m_sweep.c0.SetV(_loc6_.m_sweep.c);
                _loc6_.m_sweep.a0 = _loc6_.m_sweep.a;
                _loc6_.m_sweep.c.x += param1.dt * _loc6_.m_linearVelocity.x;
                _loc6_.m_sweep.c.y += param1.dt * _loc6_.m_linearVelocity.y;
                _loc6_.m_sweep.a += param1.dt * _loc6_.m_angularVelocity;
                _loc6_.SynchronizeTransform();
            }
            _loc5_++;
        }
        if (param3) {
            _loc5_ = 0;
            while (_loc5_ < this.m_jointCount) {
                _loc7_ = this.m_joints[_loc5_];
                _loc7_.InitPositionConstraints();
                _loc5_++;
            }
            this.m_positionIterationCount = 0;
            while (this.m_positionIterationCount < param1.maxIterations) {
                _loc10_ = _loc8_.SolvePositionConstraints(
                    b2Settings.b2_contactBaumgarte,
                );
                _loc11_ = true;
                _loc5_ = 0;
                while (_loc5_ < this.m_jointCount) {
                    _loc7_ = this.m_joints[_loc5_];
                    _loc12_ = _loc7_.SolvePositionConstraints();
                    _loc11_ &&= _loc12_;
                    _loc5_++;
                }
                if (_loc10_ && _loc11_) {
                    break;
                }
                ++this.m_positionIterationCount;
            }
        }
        this.Report(_loc8_.m_constraints);
        if (param4) {
            _loc13_ = Number.MAX_VALUE;
            _loc14_ =
                b2Settings.b2_linearSleepTolerance *
                b2Settings.b2_linearSleepTolerance;
            _loc15_ =
                b2Settings.b2_angularSleepTolerance *
                b2Settings.b2_angularSleepTolerance;
            _loc5_ = 0;
            while (_loc5_ < this.m_bodyCount) {
                _loc6_ = this.m_bodies[_loc5_];
                if (_loc6_.m_invMass != 0) {
                    if ((_loc6_.m_flags & b2Body.e_allowSleepFlag) == 0) {
                        _loc6_.m_sleepTime = 0;
                        _loc13_ = 0;
                    }
                    if (
                        (_loc6_.m_flags & b2Body.e_allowSleepFlag) == 0 ||
                        _loc6_.m_angularVelocity * _loc6_.m_angularVelocity >
                        _loc15_ ||
                        b2Math.b2Dot(
                            _loc6_.m_linearVelocity,
                            _loc6_.m_linearVelocity,
                        ) > _loc14_
                    ) {
                        _loc6_.m_sleepTime = 0;
                        _loc13_ = 0;
                    } else {
                        _loc6_.m_sleepTime += param1.dt;
                        _loc13_ = b2Math.b2Min(_loc13_, _loc6_.m_sleepTime);
                    }
                }
                _loc5_++;
            }
            if (_loc13_ >= b2Settings.b2_timeToSleep) {
                _loc5_ = 0;
                while (_loc5_ < this.m_bodyCount) {
                    _loc6_ = this.m_bodies[_loc5_];
                    _loc6_.m_flags |= b2Body.e_sleepFlag;
                    _loc6_.m_linearVelocity.SetZero();
                    _loc6_.m_angularVelocity = 0;
                    _loc5_++;
                }
            }
        }
    }

    public SolveTOI(param1: b2TimeStep) {
        var _loc2_: number = 0;
        var _loc5_: b2Body = null;
        var _loc6_: boolean = false;
        var _loc3_ = new b2ContactSolver(
            param1,
            this.m_contacts,
            this.m_contactCount,
            this.m_allocator,
        );
        _loc2_ = 0;
        while (_loc2_ < param1.maxIterations) {
            _loc3_.SolveVelocityConstraints();
            _loc2_++;
        }
        _loc2_ = 0;
        while (_loc2_ < this.m_bodyCount) {
            _loc5_ = this.m_bodies[_loc2_];
            if (!_loc5_.IsStatic()) {
                _loc5_.m_sweep.c0.SetV(_loc5_.m_sweep.c);
                _loc5_.m_sweep.a0 = _loc5_.m_sweep.a;
                _loc5_.m_sweep.c.x += param1.dt * _loc5_.m_linearVelocity.x;
                _loc5_.m_sweep.c.y += param1.dt * _loc5_.m_linearVelocity.y;
                _loc5_.m_sweep.a += param1.dt * _loc5_.m_angularVelocity;
                _loc5_.SynchronizeTransform();
            }
            _loc2_++;
        }
        var _loc4_: number = 0.75;
        _loc2_ = 0;
        while (_loc2_ < param1.maxIterations) {
            _loc6_ = _loc3_.SolvePositionConstraints(_loc4_);
            if (_loc6_) {
                break;
            }
            _loc2_++;
        }
        this.Report(_loc3_.m_constraints);
    }

    public Report(param1: any[]) {
        var _loc2_: b2Mat22 = null;
        var _loc3_: b2Vec2 = null;
        var _loc5_: b2Contact = null;
        var _loc6_: b2ContactConstraint = null;
        var _loc7_: b2ContactResult = null;
        var _loc8_: b2Body = null;
        var _loc9_: number = 0;
        var _loc10_: any[] = null;
        var _loc11_: number = 0;
        var _loc12_: b2Manifold = null;
        var _loc13_: number = 0;
        var _loc14_: b2ManifoldPoint = null;
        var _loc15_: b2ContactConstraintPoint = null;
        if (this.m_listener == null) {
            return;
        }
        var _loc4_: number = 0;
        while (_loc4_ < this.m_contactCount) {
            _loc5_ = this.m_contacts[_loc4_];
            _loc6_ = param1[_loc4_];
            _loc7_ = b2Island.s_reportCR;
            _loc7_.shape1 = _loc5_.m_shape1;
            _loc7_.shape2 = _loc5_.m_shape2;
            _loc8_ = _loc7_.shape1.m_body;
            _loc9_ = _loc5_.m_manifoldCount;
            _loc10_ = _loc5_.GetManifolds();
            _loc11_ = 0;
            while (_loc11_ < _loc9_) {
                _loc12_ = _loc10_[_loc11_];
                _loc7_.normal.SetV(_loc12_.normal);
                _loc13_ = 0;
                while (_loc13_ < _loc12_.pointCount) {
                    _loc14_ = _loc12_.points[_loc13_];
                    _loc15_ = _loc6_.points[_loc13_];
                    _loc7_.position = _loc8_.GetWorldPoint(_loc14_.localPoint1);
                    _loc7_.normalImpulse = _loc15_.normalImpulse;
                    _loc7_.tangentImpulse = _loc15_.tangentImpulse;
                    _loc7_.id.key = _loc14_.id.key;
                    this.m_listener.Result(_loc7_);
                    _loc13_++;
                }
                _loc11_++;
            }
            _loc4_++;
        }
    }

    public AddBody(param1: b2Body) {
        var _loc2_ = this.m_bodyCount++;
        this.m_bodies[_loc2_] = param1;
    }

    public AddContact(param1: b2Contact) {
        var _loc2_ = this.m_contactCount++;
        this.m_contacts[_loc2_] = param1;
    }

    public AddJoint(param1: b2Joint) {
        var _loc2_ = this.m_jointCount++;
        this.m_joints[_loc2_] = param1;
    }
}