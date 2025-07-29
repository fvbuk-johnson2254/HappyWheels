import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2JointDef from "@/Box2D/Dynamics/Joints/b2JointDef";

export default class b2DistanceJointDef extends b2JointDef {
    public localAnchor1 = new b2Vec2();
    public localAnchor2 = new b2Vec2();
    public length: number;
    public frequencyHz: number;
    public dampingRatio: number;

    constructor() {
        super();
        this.type = b2Joint.e_distanceJoint;
        this.length = 1;
        this.frequencyHz = 0;
        this.dampingRatio = 0;
    }

    public Initialize(
        param1: b2Body,
        param2: b2Body,
        param3: b2Vec2,
        param4: b2Vec2,
    ) {
        this.body1 = param1;
        this.body2 = param2;
        this.localAnchor1.SetV(this.body1.GetLocalPoint(param3));
        this.localAnchor2.SetV(this.body2.GetLocalPoint(param4));
        var _loc5_: number = param4.x - param3.x;
        var _loc6_: number = param4.y - param3.y;
        this.length = Math.sqrt(_loc5_ * _loc5_ + _loc6_ * _loc6_);
        this.frequencyHz = 0;
        this.dampingRatio = 0;
    }
}