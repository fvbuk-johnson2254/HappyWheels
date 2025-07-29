import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2JointDef from "@/Box2D/Dynamics/Joints/b2JointDef";

export default class b2PrismaticJointDef extends b2JointDef {
    public localAnchor1 = new b2Vec2();
    public localAnchor2 = new b2Vec2();
    public localAxis1 = new b2Vec2();
    public referenceAngle: number;
    public enableLimit: boolean;
    public lowerTranslation: number;
    public upperTranslation: number;
    public enableMotor: boolean;
    public maxMotorForce: number;
    public motorSpeed: number;

    constructor() {
        super();
        this.type = b2Joint.e_prismaticJoint;
        this.localAxis1.Set(1, 0);
        this.referenceAngle = 0;
        this.enableLimit = false;
        this.lowerTranslation = 0;
        this.upperTranslation = 0;
        this.enableMotor = false;
        this.maxMotorForce = 0;
        this.motorSpeed = 0;
    }

    public Initialize(
        param1: b2Body,
        param2: b2Body,
        param3: b2Vec2,
        param4: b2Vec2,
    ) {
        this.body1 = param1;
        this.body2 = param2;
        this.localAnchor1 = this.body1.GetLocalPoint(param3);
        this.localAnchor2 = this.body2.GetLocalPoint(param3);
        this.localAxis1 = this.body1.GetLocalVector(param4);
        this.referenceAngle = this.body2.GetAngle() - this.body1.GetAngle();
    }
}