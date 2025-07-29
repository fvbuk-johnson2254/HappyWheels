import b2Collision from "@/Box2D/Collision/b2Collision";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Manifold from "@/Box2D/Collision/b2Manifold";
import b2ManifoldPoint from "@/Box2D/Collision/b2ManifoldPoint";
import b2CircleShape from "@/Box2D/Collision/Shapes/b2CircleShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2ContactListener from "@/Box2D/Dynamics/b2ContactListener";
import b2Contact from "@/Box2D/Dynamics/Contacts/b2Contact";

export default class b2CircleContact extends b2Contact {
    private static s_evalCP = new b2ContactPoint();
    private m_manifolds: any[] = [new b2Manifold()];
    public m_manifold: b2Manifold;
    private m0 = new b2Manifold();

    constructor(param1: b2Shape, param2: b2Shape) {
        super(param1, param2);
        this.m_manifold = this.m_manifolds[0];
        this.m_manifold.pointCount = 0;
        var _loc3_: b2ManifoldPoint = this.m_manifold.points[0];
        _loc3_.normalImpulse = 0;
        _loc3_.tangentImpulse = 0;
    }

    public static Create(param1: b2Shape, param2: b2Shape, param3): b2Contact {
        return new b2CircleContact(param1, param2);
    }

    public static Destroy(param1: b2Contact, param2) { }

    public override Evaluate(param1: b2ContactListener) {
        var _loc2_: b2Vec2 = null;
        var _loc3_: b2Vec2 = null;
        var _loc4_: b2ManifoldPoint = null;
        var _loc8_: b2ManifoldPoint = null;
        var _loc5_: b2Body = this.m_shape1.m_body;
        var _loc6_: b2Body = this.m_shape2.m_body;
        this.m0.Set(this.m_manifold);
        b2Collision.b2CollideCircles(
            this.m_manifold,
            this.m_shape1 as b2CircleShape,
            _loc5_.m_xf,
            this.m_shape2 as b2CircleShape,
            _loc6_.m_xf,
        );
        var _loc7_: b2ContactPoint = b2CircleContact.s_evalCP;
        _loc7_.shape1 = this.m_shape1;
        _loc7_.shape2 = this.m_shape2;
        _loc7_.friction = this.m_friction;
        _loc7_.restitution = this.m_restitution;
        if (this.m_manifold.pointCount > 0) {
            this.m_manifoldCount = 1;
            _loc8_ = this.m_manifold.points[0];
            if (this.m0.pointCount == 0) {
                _loc8_.normalImpulse = 0;
                _loc8_.tangentImpulse = 0;
                if (param1) {
                    _loc7_.position = _loc5_.GetWorldPoint(_loc8_.localPoint1);
                    _loc2_ = _loc5_.GetLinearVelocityFromLocalPoint(
                        _loc8_.localPoint1,
                    );
                    _loc3_ = _loc6_.GetLinearVelocityFromLocalPoint(
                        _loc8_.localPoint2,
                    );
                    _loc7_.velocity.Set(
                        _loc3_.x - _loc2_.x,
                        _loc3_.y - _loc2_.y,
                    );
                    _loc7_.normal.SetV(this.m_manifold.normal);
                    _loc7_.separation = _loc8_.separation;
                    _loc7_.id.key = _loc8_.id._key;
                    param1.Add(_loc7_);
                }
            } else {
                _loc4_ = this.m0.points[0];
                _loc8_.normalImpulse = _loc4_.normalImpulse;
                _loc8_.tangentImpulse = _loc4_.tangentImpulse;
                if (param1) {
                    _loc7_.position = _loc5_.GetWorldPoint(_loc8_.localPoint1);
                    _loc2_ = _loc5_.GetLinearVelocityFromLocalPoint(
                        _loc8_.localPoint1,
                    );
                    _loc3_ = _loc6_.GetLinearVelocityFromLocalPoint(
                        _loc8_.localPoint2,
                    );
                    _loc7_.velocity.Set(
                        _loc3_.x - _loc2_.x,
                        _loc3_.y - _loc2_.y,
                    );
                    _loc7_.normal.SetV(this.m_manifold.normal);
                    _loc7_.separation = _loc8_.separation;
                    _loc7_.id.key = _loc8_.id._key;
                    param1.Persist(_loc7_);
                }
            }
        } else {
            this.m_manifoldCount = 0;
            if (this.m0.pointCount > 0 && Boolean(param1)) {
                _loc4_ = this.m0.points[0];
                _loc7_.position = _loc5_.GetWorldPoint(_loc4_.localPoint1);
                _loc2_ = _loc5_.GetLinearVelocityFromLocalPoint(
                    _loc4_.localPoint1,
                );
                _loc3_ = _loc6_.GetLinearVelocityFromLocalPoint(
                    _loc4_.localPoint2,
                );
                _loc7_.velocity.Set(_loc3_.x - _loc2_.x, _loc3_.y - _loc2_.y);
                _loc7_.normal.SetV(this.m0.normal);
                _loc7_.separation = _loc4_.separation;
                _loc7_.id.key = _loc4_.id._key;
                param1.Remove(_loc7_);
            }
        }
    }

    public override GetManifolds(): any[] {
        return this.m_manifolds;
    }
}