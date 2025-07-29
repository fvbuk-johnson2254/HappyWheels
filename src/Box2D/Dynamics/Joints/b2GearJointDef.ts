import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2JointDef from "@/Box2D/Dynamics/Joints/b2JointDef";

export default class b2GearJointDef extends b2JointDef {
    public joint1: b2Joint;
    public joint2: b2Joint;
    public ratio: number;

    constructor() {
        super();
        this.type = b2Joint.e_gearJoint;
        this.joint1 = null;
        this.joint2 = null;
        this.ratio = 1;
    }
}