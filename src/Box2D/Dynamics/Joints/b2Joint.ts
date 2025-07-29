import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2TimeStep from "@/Box2D/Dynamics/b2TimeStep";
import b2DistanceJoint from "@/Box2D/Dynamics/Joints/b2DistanceJoint";
import b2DistanceJointDef from "@/Box2D/Dynamics/Joints/b2DistanceJointDef";
import b2GearJoint from "@/Box2D/Dynamics/Joints/b2GearJoint";
import b2GearJointDef from "@/Box2D/Dynamics/Joints/b2GearJointDef";
import b2JointDef from "@/Box2D/Dynamics/Joints/b2JointDef";
import b2JointEdge from "@/Box2D/Dynamics/Joints/b2JointEdge";
import b2MouseJoint from "@/Box2D/Dynamics/Joints/b2MouseJoint";
import b2MouseJointDef from "@/Box2D/Dynamics/Joints/b2MouseJointDef";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import b2PulleyJoint from "@/Box2D/Dynamics/Joints/b2PulleyJoint";
import b2PulleyJointDef from "@/Box2D/Dynamics/Joints/b2PulleyJointDef";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import b2RopeJoint from "@/Box2D/Dynamics/Joints/b2RopeJoint";
import b2RopeJointDef from "@/Box2D/Dynamics/Joints/b2RopeJointDef";

export default class b2Joint {
    public static e_unknownJoint: number = 0;
    public static e_revoluteJoint: number = 1;
    public static e_prismaticJoint: number = 2;
    public static e_distanceJoint: number = 3;
    public static e_pulleyJoint: number = 4;
    public static e_mouseJoint: number = 5;
    public static e_gearJoint: number = 6;
    public static e_ropeJoint: number = 7;
    public static e_inactiveLimit: number = 0;
    public static e_atLowerLimit: number = 1;
    public static e_atUpperLimit: number = 2;
    public static e_equalLimits: number = 3;
    public m_type: number;
    public m_prev: b2Joint;
    public m_next: b2Joint;
    public m_node1 = new b2JointEdge();
    public m_node2 = new b2JointEdge();
    public m_body1: b2Body;
    public m_body2: b2Body;
    public m_inv_dt: number;
    public m_islandFlag: boolean;
    public m_collideConnected: boolean;
    public m_userData;
    public broken: boolean;

    constructor(param1: b2JointDef) {
        this.m_type = param1.type;
        this.m_prev = null;
        this.m_next = null;
        this.m_body1 = param1.body1;
        this.m_body2 = param1.body2;
        this.m_collideConnected = param1.collideConnected;
        this.m_islandFlag = false;
        this.m_userData = param1.userData;
    }

    public static Create(param1: b2JointDef, param2): b2Joint {
        var _loc3_: b2Joint = null;
        switch (param1.type) {
            case b2Joint.e_distanceJoint:
                _loc3_ = new b2DistanceJoint(param1 as b2DistanceJointDef);
                break;
            case b2Joint.e_mouseJoint:
                _loc3_ = new b2MouseJoint(param1 as b2MouseJointDef);
                break;
            case b2Joint.e_prismaticJoint:
                _loc3_ = new b2PrismaticJoint(param1 as b2PrismaticJointDef);
                break;
            case b2Joint.e_revoluteJoint:
                _loc3_ = new b2RevoluteJoint(param1 as b2RevoluteJointDef);
                break;
            case b2Joint.e_pulleyJoint:
                _loc3_ = new b2PulleyJoint(param1 as b2PulleyJointDef);
                break;
            case b2Joint.e_gearJoint:
                _loc3_ = new b2GearJoint(param1 as b2GearJointDef);
                break;
            case b2Joint.e_ropeJoint:
                _loc3_ = new b2RopeJoint(param1 as b2RopeJointDef);
        }
        return _loc3_;
    }

    public static Destroy(param1: b2Joint, param2) { }

    public GetType(): number {
        return this.m_type;
    }

    public GetAnchor1(): b2Vec2 {
        return null;
    }

    public GetAnchor2(): b2Vec2 {
        return null;
    }

    public GetReactionForce(): b2Vec2 {
        return null;
    }

    public GetReactionTorque(): number {
        return 0;
    }

    public GetBody1(): b2Body {
        return this.m_body1;
    }

    public GetBody2(): b2Body {
        return this.m_body2;
    }

    public GetNext(): b2Joint {
        return this.m_next;
    }

    public GetUserData() {
        return this.m_userData;
    }

    public SetUserData(param1) {
        this.m_userData = param1;
    }

    public InitVelocityConstraints(param1: b2TimeStep) { }

    public SolveVelocityConstraints(param1: b2TimeStep) { }

    public InitPositionConstraints() { }

    public SolvePositionConstraints(): boolean {
        return false;
    }
}