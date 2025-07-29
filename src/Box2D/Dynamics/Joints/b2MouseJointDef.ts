import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2JointDef from "@/Box2D/Dynamics/Joints/b2JointDef";

export default class b2MouseJointDef extends b2JointDef {
    public target = new b2Vec2();
    public maxForce: number;
    public frequencyHz: number;
    public dampingRatio: number;
    public timeStep: number;

    constructor() {
        super();
        this.type = b2Joint.e_mouseJoint;
        this.maxForce = 0;
        this.frequencyHz = 5;
        this.dampingRatio = 0.7;
        this.timeStep = 0.016666666666666666;
    }
}