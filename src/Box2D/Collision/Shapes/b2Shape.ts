import b2AABB from "@/Box2D/Collision/b2AABB";
import b2BroadPhase from "@/Box2D/Collision/b2BroadPhase";
import b2Pair from "@/Box2D/Collision/b2Pair";
import b2Segment from "@/Box2D/Collision/b2Segment";
import b2CircleShape from "@/Box2D/Collision/Shapes/b2CircleShape";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2MassData from "@/Box2D/Collision/Shapes/b2MassData";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2ShapeDef from "@/Box2D/Collision/Shapes/b2ShapeDef";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2XForm from "@/Box2D/Common/Math/b2XForm";
import b2Body from "@/Box2D/Dynamics/b2Body";

export default class b2Shape {
    private static s_proxyAABB = new b2AABB();
    private static s_syncAABB = new b2AABB();
    private static s_resetAABB = new b2AABB();
    public static e_unknownShape: number = -1;
    public static e_circleShape: number = 0;
    public static e_polygonShape: number = 1;
    public static e_shapeTypeCount: number = 2;
    public m_type: number;
    public m_next: b2Shape;
    public m_body: b2Body;
    public m_sweepRadius: number;
    public m_density: number;
    public m_friction: number;
    public m_restitution: number;
    public m_proxyId: number;
    public m_filter: b2FilterData;
    public m_isSensor: boolean;
    public m_userData;
    public m_material: number;

    constructor(param1: b2ShapeDef) {
        this.m_userData = param1.userData;
        this.m_friction = param1.friction;
        this.m_restitution = param1.restitution;
        this.m_density = param1.density;
        this.m_body = null;
        this.m_sweepRadius = 0;
        this.m_next = null;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_filter = param1.filter.Copy();
        this.m_isSensor = param1.isSensor;
    }

    public static Create(param1: b2ShapeDef, param2): b2Shape {
        switch (param1.type) {
            case b2Shape.e_circleShape:
                return new b2CircleShape(param1);
            case b2Shape.e_polygonShape:
                return new b2PolygonShape(param1);
            default:
                return null;
        }
    }

    public static Destroy(param1: b2Shape, param2) { }

    public GetType(): number {
        return this.m_type;
    }

    public IsSensor(): boolean {
        return this.m_isSensor;
    }

    public SetFilterData(param1: b2FilterData) {
        this.m_filter = param1.Copy();
    }

    public GetFilterData(): b2FilterData {
        return this.m_filter.Copy();
    }

    public GetBody(): b2Body {
        return this.m_body;
    }

    public GetNext(): b2Shape {
        return this.m_next;
    }

    public GetUserData() {
        return this.m_userData;
    }

    public SetUserData(param1) {
        this.m_userData = param1;
    }

    public GetMaterial(): number {
        return this.m_material;
    }

    public SetMaterial(param1: number) {
        this.m_material = param1;
    }

    public TestPoint(param1: b2XForm, param2: b2Vec2): boolean {
        return false;
    }

    public TestSegment(
        param1: b2XForm,
        param2: any[],
        param3: b2Vec2,
        param4: b2Segment,
        param5: number,
    ): boolean {
        return false;
    }

    public ComputeAABB(param1: b2AABB, param2: b2XForm) { }

    public ComputeSweptAABB(param1: b2AABB, param2: b2XForm, param3: b2XForm) { }

    public ComputeMass(param1: b2MassData) { }

    public GetSweepRadius(): number {
        return this.m_sweepRadius;
    }

    public GetFriction(): number {
        return this.m_friction;
    }

    public GetRestitution(): number {
        return this.m_restitution;
    }

    public CreateProxy(param1: b2BroadPhase, param2: b2XForm) {
        var _loc3_: b2AABB = b2Shape.s_proxyAABB;
        this.ComputeAABB(_loc3_, param2);
        var _loc4_: boolean = param1.InRange(_loc3_);
        if (_loc4_) {
            this.m_proxyId = param1.CreateProxy(_loc3_, this);
        } else {
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
    }

    public DestroyProxy(param1: b2BroadPhase) {
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            param1.DestroyProxy(this.m_proxyId);
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
    }

    public Synchronize(
        param1: b2BroadPhase,
        param2: b2XForm,
        param3: b2XForm,
    ): boolean {
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            return false;
        }
        var _loc4_: b2AABB = b2Shape.s_syncAABB;
        this.ComputeSweptAABB(_loc4_, param2, param3);
        if (param1.InRange(_loc4_)) {
            param1.MoveProxy(this.m_proxyId, _loc4_);
            return true;
        }
        return false;
    }

    public RefilterProxy(param1: b2BroadPhase, param2: b2XForm) {
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            return;
        }
        param1.DestroyProxy(this.m_proxyId);
        var _loc3_: b2AABB = b2Shape.s_resetAABB;
        this.ComputeAABB(_loc3_, param2);
        var _loc4_: boolean = param1.InRange(_loc3_);
        if (_loc4_) {
            this.m_proxyId = param1.CreateProxy(_loc3_, this);
        } else {
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
    }

    public UpdateSweepRadius(param1: b2Vec2) { }
}