import b2ManifoldPoint from "@/Box2D/Collision/b2ManifoldPoint";
import b2Settings from "@/Box2D/Common/b2Settings";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2Manifold {
    public points: any[];
    public normal: b2Vec2;
    public pointCount: number = 0;

    constructor() {
        this.points = new Array(b2Settings.b2_maxManifoldPoints);
        var _loc1_: number = 0;
        while (_loc1_ < b2Settings.b2_maxManifoldPoints) {
            this.points[_loc1_] = new b2ManifoldPoint();
            _loc1_++;
        }
        this.normal = new b2Vec2();
    }

    public Reset() {
        var _loc1_: number = 0;
        while (_loc1_ < b2Settings.b2_maxManifoldPoints) {
            (this.points[_loc1_] as b2ManifoldPoint).Reset();
            _loc1_++;
        }
        this.normal.SetZero();
        this.pointCount = 0;
    }

    public Set(param1: b2Manifold) {
        this.pointCount = param1.pointCount;
        var _loc2_: number = 0;
        while (_loc2_ < b2Settings.b2_maxManifoldPoints) {
            (this.points[_loc2_] as b2ManifoldPoint).Set(param1.points[_loc2_]);
            _loc2_++;
        }
        this.normal.SetV(param1.normal);
    }
}