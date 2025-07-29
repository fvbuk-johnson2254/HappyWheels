import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2JointDef from "@/Box2D/Dynamics/Joints/b2JointDef";

export default class b2RevoluteJointDef extends b2JointDef {
    public localAnchor1 = new b2Vec2()
    public localAnchor2 = new b2Vec2();
    public referenceAngle: number;
    public enableLimit: boolean;
    public lowerAngle: number;
    public upperAngle: number;
    public enableMotor: boolean;
    public motorSpeed: number;
    public maxMotorTorque: number;

    constructor() {
        super();
        this.type = b2Joint.e_revoluteJoint;
        this.localAnchor1.Set(0, 0);
        this.localAnchor2.Set(0, 0);
        this.referenceAngle = 0;
        this.lowerAngle = 0;
        this.upperAngle = 0;
        this.maxMotorTorque = 0;
        this.motorSpeed = 0;
        this.enableLimit = false;
        this.enableMotor = false;
    }

    public Initialize(param1: b2Body, param2: b2Body, param3: b2Vec2) {
        this.body1 = param1;
        this.body2 = param2;
        this.localAnchor1 = this.body1.GetLocalPoint(param3);
        this.localAnchor2 = this.body2.GetLocalPoint(param3);
        this.referenceAngle = this.body2.GetAngle() - this.body1.GetAngle();
    }

    public clone(): b2RevoluteJointDef {
        var _loc1_ = new b2RevoluteJointDef();
        _loc1_.body1 = this.body1;
        _loc1_.body2 = this.body2;
        _loc1_.localAnchor1 = this.localAnchor1.Copy();
        _loc1_.localAnchor2 = this.localAnchor2.Copy();
        _loc1_.referenceAngle = this.referenceAngle;
        _loc1_.enableLimit = this.enableLimit;
        _loc1_.lowerAngle = this.lowerAngle;
        _loc1_.upperAngle = this.upperAngle;
        _loc1_.enableMotor = this.enableMotor;
        _loc1_.motorSpeed = this.motorSpeed;
        _loc1_.maxMotorTorque = this.maxMotorTorque;
        _loc1_.collideConnected = this.collideConnected;
        return _loc1_;
    }
}