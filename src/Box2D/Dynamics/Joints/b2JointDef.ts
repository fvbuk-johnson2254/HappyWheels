import b2Body from "@/Box2D/Dynamics/b2Body";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";

export default class b2JointDef {
    public type: number;
    public userData;
    public body1: b2Body;
    public body2: b2Body;
    public collideConnected: boolean;

    constructor() {
        this.type = b2Joint.e_unknownJoint;
        this.userData = null;
        this.body1 = null;
        this.body2 = null;
        this.collideConnected = false;
    }
}