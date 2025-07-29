import b2Collision from "@/Box2D/Collision/b2Collision";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Manifold from "@/Box2D/Collision/b2Manifold";
import b2ManifoldPoint from "@/Box2D/Collision/b2ManifoldPoint";
import b2CircleShape from "@/Box2D/Collision/Shapes/b2CircleShape";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Settings from "@/Box2D/Common/b2Settings";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2ContactListener from "@/Box2D/Dynamics/b2ContactListener";
import b2Contact from "@/Box2D/Dynamics/Contacts/b2Contact";

export default class b2PolyAndCircleContact extends b2Contact {
    private static s_evalCP = new b2ContactPoint();
    private m_manifolds: any[] = [new b2Manifold()];
    public m_manifold: b2Manifold;
    private m0 = new b2Manifold();

    constructor(param1: b2Shape, param2: b2Shape) {
        super(param1, param2);
        this.m_manifold = this.m_manifolds[0];
        b2Settings.b2Assert(this.m_shape1.m_type == b2Shape.e_polygonShape);
        b2Settings.b2Assert(this.m_shape2.m_type == b2Shape.e_circleShape);
        this.m_manifold.pointCount = 0;
        var _loc3_: b2ManifoldPoint = this.m_manifold.points[0];
        _loc3_.normalImpulse = 0;
        _loc3_.tangentImpulse = 0;
    }

    public static Create(param1: b2Shape, param2: b2Shape, param3): b2Contact {
        return new b2PolyAndCircleContact(param1, param2);
    }

    public static Destroy(param1: b2Contact, param2) { }

    public override Evaluate(param1: b2ContactListener) {
        var _loc2_: number = 0;
        var _loc3_: b2Vec2 = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: b2ManifoldPoint = null;
        var _loc10_: b2ManifoldPoint = null;
        var _loc11_: boolean = false;
        var _loc12_ = 0;
        var _loc13_: number = 0;
        var _loc6_: b2Body = this.m_shape1.m_body;
        var _loc7_: b2Body = this.m_shape2.m_body;
        this.m0.Set(this.m_manifold);
        b2Collision.b2CollidePolygonAndCircle(
            this.m_manifold,
            this.m_shape1 as b2PolygonShape,
            _loc6_.m_xf,
            this.m_shape2 as b2CircleShape,
            _loc7_.m_xf,
        );
        var _loc8_: any[] = [false, false];
        var _loc9_: b2ContactPoint = b2PolyAndCircleContact.s_evalCP;
        _loc9_.shape1 = this.m_shape1;
        _loc9_.shape2 = this.m_shape2;
        _loc9_.friction = this.m_friction;
        _loc9_.restitution = this.m_restitution;
        if (this.m_manifold.pointCount > 0) {
            _loc2_ = 0;
            while (_loc2_ < this.m_manifold.pointCount) {
                _loc10_ = this.m_manifold.points[_loc2_];
                _loc10_.normalImpulse = 0;
                _loc10_.tangentImpulse = 0;
                _loc11_ = false;
                _loc12_ = _loc10_.id._key;
                _loc13_ = 0;
                while (_loc13_ < this.m0.pointCount) {
                    if (_loc8_[_loc13_] != true) {
                        _loc5_ = this.m0.points[_loc13_];
                        if (_loc5_.id._key == _loc12_) {
                            _loc8_[_loc13_] = true;
                            _loc10_.normalImpulse = _loc5_.normalImpulse;
                            _loc10_.tangentImpulse = _loc5_.tangentImpulse;
                            _loc11_ = true;
                            if (param1 != null) {
                                _loc9_.position = _loc6_.GetWorldPoint(
                                    _loc10_.localPoint1,
                                );
                                _loc3_ = _loc6_.GetLinearVelocityFromLocalPoint(
                                    _loc10_.localPoint1,
                                );
                                _loc4_ = _loc7_.GetLinearVelocityFromLocalPoint(
                                    _loc10_.localPoint2,
                                );
                                _loc9_.velocity.Set(
                                    _loc4_.x - _loc3_.x,
                                    _loc4_.y - _loc3_.y,
                                );
                                _loc9_.normal.SetV(this.m_manifold.normal);
                                _loc9_.separation = _loc10_.separation;
                                _loc9_.id.key = _loc12_;
                                param1.Persist(_loc9_);
                            }
                            break;
                        }
                    }
                    _loc13_++;
                }
                if (_loc11_ == false && param1 != null) {
                    _loc9_.position = _loc6_.GetWorldPoint(_loc10_.localPoint1);
                    _loc3_ = _loc6_.GetLinearVelocityFromLocalPoint(
                        _loc10_.localPoint1,
                    );
                    _loc4_ = _loc7_.GetLinearVelocityFromLocalPoint(
                        _loc10_.localPoint2,
                    );
                    _loc9_.velocity.Set(
                        _loc4_.x - _loc3_.x,
                        _loc4_.y - _loc3_.y,
                    );
                    _loc9_.normal.SetV(this.m_manifold.normal);
                    _loc9_.separation = _loc10_.separation;
                    _loc9_.id.key = _loc12_;
                    param1.Add(_loc9_);
                }
                _loc2_++;
            }
            this.m_manifoldCount = 1;
        } else {
            this.m_manifoldCount = 0;
        }
        if (param1 == null) {
            return;
        }
        _loc2_ = 0;
        while (_loc2_ < this.m0.pointCount) {
            if (!_loc8_[_loc2_]) {
                _loc5_ = this.m0.points[_loc2_];
                _loc9_.position = _loc6_.GetWorldPoint(_loc5_.localPoint1);
                _loc3_ = _loc6_.GetLinearVelocityFromLocalPoint(
                    _loc5_.localPoint1,
                );
                _loc4_ = _loc7_.GetLinearVelocityFromLocalPoint(
                    _loc5_.localPoint2,
                );
                _loc9_.velocity.Set(_loc4_.x - _loc3_.x, _loc4_.y - _loc3_.y);
                _loc9_.normal.SetV(this.m0.normal);
                _loc9_.separation = _loc5_.separation;
                _loc9_.id.key = _loc5_.id._key;
                param1.Remove(_loc9_);
            }
            _loc2_++;
        }
    }

    public override GetManifolds(): any[] {
        return this.m_manifolds;
    }
}