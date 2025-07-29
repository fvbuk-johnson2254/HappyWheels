import b2Manifold from "@/Box2D/Collision/b2Manifold";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2ContactListener from "@/Box2D/Dynamics/b2ContactListener";
import b2CircleContact from "@/Box2D/Dynamics/Contacts/b2CircleContact";
import b2ContactEdge from "@/Box2D/Dynamics/Contacts/b2ContactEdge";
import b2ContactRegister from "@/Box2D/Dynamics/Contacts/b2ContactRegister";
import b2PolyAndCircleContact from "@/Box2D/Dynamics/Contacts/b2PolyAndCircleContact";
import b2PolygonContact from "@/Box2D/Dynamics/Contacts/b2PolygonContact";

export default class b2Contact {
    public static s_registers: any[];
    public static e_nonSolidFlag: number = 1;
    public static e_slowFlag: number = 2;
    public static e_islandFlag: number = 4;
    public static e_toiFlag: number = 8;
    public static s_initialized: boolean = false;
    public m_flags: number;
    public m_prev: b2Contact;
    public m_next: b2Contact;
    public m_node1 = new b2ContactEdge();
    public m_node2 = new b2ContactEdge();
    public m_shape1: b2Shape;
    public m_shape2: b2Shape;
    public m_manifoldCount: number;
    public m_friction: number;
    public m_restitution: number;
    public m_toi: number;

    constructor(param1: b2Shape = null, param2: b2Shape = null) {
        this.m_flags = 0;
        if (!param1 || !param2) {
            this.m_shape1 = null;
            this.m_shape2 = null;
            return;
        }
        if (param1.IsSensor() || param2.IsSensor()) {
            this.m_flags |= b2Contact.e_nonSolidFlag;
        }
        this.m_shape1 = param1;
        this.m_shape2 = param2;
        this.m_manifoldCount = 0;
        this.m_friction = Math.sqrt(
            this.m_shape1.m_friction * this.m_shape2.m_friction,
        );
        this.m_restitution = b2Math.b2Max(
            this.m_shape1.m_restitution,
            this.m_shape2.m_restitution,
        );
        this.m_prev = null;
        this.m_next = null;
        this.m_node1.contact = null;
        this.m_node1.prev = null;
        this.m_node1.next = null;
        this.m_node1.other = null;
        this.m_node2.contact = null;
        this.m_node2.prev = null;
        this.m_node2.next = null;
        this.m_node2.other = null;
    }

    public static AddType(
        param1: Function,
        param2: Function,
        param3: number,
        param4: number,
    ) {
        b2Contact.s_registers[param3][param4].createFcn = param1;
        b2Contact.s_registers[param3][param4].destroyFcn = param2;
        b2Contact.s_registers[param3][param4].primary = true;
        if (param3 != param4) {
            b2Contact.s_registers[param4][param3].createFcn = param1;
            b2Contact.s_registers[param4][param3].destroyFcn = param2;
            b2Contact.s_registers[param4][param3].primary = false;
        }
    }

    public static InitializeRegisters() {
        var _loc2_: number = 0;
        b2Contact.s_registers = new Array(b2Shape.e_shapeTypeCount);
        var _loc1_: number = 0;
        while (_loc1_ < b2Shape.e_shapeTypeCount) {
            b2Contact.s_registers[_loc1_] = new Array(b2Shape.e_shapeTypeCount);
            _loc2_ = 0;
            while (_loc2_ < b2Shape.e_shapeTypeCount) {
                b2Contact.s_registers[_loc1_][_loc2_] = new b2ContactRegister();
                _loc2_++;
            }
            _loc1_++;
        }
        b2Contact.AddType(
            b2CircleContact.Create,
            b2CircleContact.Destroy,
            b2Shape.e_circleShape,
            b2Shape.e_circleShape,
        );
        b2Contact.AddType(
            b2PolyAndCircleContact.Create,
            b2PolyAndCircleContact.Destroy,
            b2Shape.e_polygonShape,
            b2Shape.e_circleShape,
        );
        b2Contact.AddType(
            b2PolygonContact.Create,
            b2PolygonContact.Destroy,
            b2Shape.e_polygonShape,
            b2Shape.e_polygonShape,
        );
    }

    public static Create(param1: b2Shape, param2: b2Shape, param3): b2Contact {
        var _loc8_: b2Contact = null;
        var _loc9_: number = 0;
        var _loc10_: b2Manifold = null;
        if (b2Contact.s_initialized == false) {
            b2Contact.InitializeRegisters();
            b2Contact.s_initialized = true;
        }
        var _loc4_: number = param1.m_type;
        var _loc5_: number = param2.m_type;
        var _loc6_: b2ContactRegister = b2Contact.s_registers[_loc4_][_loc5_];
        var _loc7_: Function = _loc6_.createFcn;
        if (_loc7_ != null) {
            if (_loc6_.primary) {
                return _loc7_(param1, param2, param3);
            }
            _loc8_ = _loc7_(param2, param1, param3);
            _loc9_ = 0;
            while (_loc9_ < _loc8_.m_manifoldCount) {
                _loc10_ = _loc8_.GetManifolds()[_loc9_];
                _loc10_.normal = _loc10_.normal.Negative();
                _loc9_++;
            }
            return _loc8_;
        }
        return null;
    }

    public static Destroy(param1: b2Contact, param2) {
        if (param1.m_manifoldCount > 0) {
            param1.m_shape1.m_body.WakeUp();
            param1.m_shape2.m_body.WakeUp();
        }
        var _loc3_: number = param1.m_shape1.m_type;
        var _loc4_: number = param1.m_shape2.m_type;
        var _loc5_: b2ContactRegister = b2Contact.s_registers[_loc3_][_loc4_];
        var _loc6_: Function = _loc5_.destroyFcn;
        _loc6_(param1, param2);
    }

    public GetManifolds(): any[] {
        return null;
    }

    public GetManifoldCount(): number {
        return this.m_manifoldCount;
    }

    public IsSolid(): boolean {
        return (this.m_flags & b2Contact.e_nonSolidFlag) == 0;
    }

    public GetNext(): b2Contact {
        return this.m_next;
    }

    public GetShape1(): b2Shape {
        return this.m_shape1;
    }

    public GetShape2(): b2Shape {
        return this.m_shape2;
    }

    public Update(param1: b2ContactListener) {
        var _loc2_: number = this.m_manifoldCount;
        this.Evaluate(param1);
        var _loc3_: number = this.m_manifoldCount;
        var _loc4_: b2Body = this.m_shape1.m_body;
        var _loc5_: b2Body = this.m_shape2.m_body;
        if (_loc3_ == 0 && _loc2_ > 0) {
            _loc4_.WakeUp();
            _loc5_.WakeUp();
        }
        if (
            _loc4_.IsStatic() ||
            _loc4_.IsBullet() ||
            _loc5_.IsStatic() ||
            _loc5_.IsBullet()
        ) {
            this.m_flags &= ~b2Contact.e_slowFlag;
        } else {
            this.m_flags |= b2Contact.e_slowFlag;
        }
    }

    public Evaluate(param1: b2ContactListener) { }
}