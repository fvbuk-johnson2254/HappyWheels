import b2Manifold from "@/Box2D/Collision/b2Manifold";
import b2Settings from "@/Box2D/Common/b2Settings";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2ContactConstraintPoint from "@/Box2D/Dynamics/Contacts/b2ContactConstraintPoint";

export default class b2ContactConstraint {
    public points: any[];
    public normal = new b2Vec2();
    public manifold: b2Manifold;
    public body1: b2Body;
    public body2: b2Body;
    public friction: number;
    public restitution: number;
    public pointCount: number;

    constructor() {
        this.points = new Array(b2Settings.b2_maxManifoldPoints);
        var _loc1_: number = 0;
        while (_loc1_ < b2Settings.b2_maxManifoldPoints) {
            this.points[_loc1_] = new b2ContactConstraintPoint();
            _loc1_++;
        }
    }
}