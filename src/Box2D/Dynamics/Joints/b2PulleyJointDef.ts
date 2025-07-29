import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2JointDef from "@/Box2D/Dynamics/Joints/b2JointDef";
import b2PulleyJoint from "@/Box2D/Dynamics/Joints/b2PulleyJoint";

export default class b2PulleyJointDef extends b2JointDef {
    public groundAnchor1 = new b2Vec2();
    public groundAnchor2 = new b2Vec2();
    public localAnchor1 = new b2Vec2();
    public localAnchor2 = new b2Vec2();
    public length1: number;
    public maxLength1: number;
    public length2: number;
    public maxLength2: number;
    public ratio: number;

    constructor() {
        super();
        this.type = b2Joint.e_pulleyJoint;
        this.groundAnchor1.Set(-1, 1);
        this.groundAnchor2.Set(1, 1);
        this.localAnchor1.Set(-1, 0);
        this.localAnchor2.Set(1, 0);
        this.length1 = 0;
        this.maxLength1 = 0;
        this.length2 = 0;
        this.maxLength2 = 0;
        this.ratio = 1;
        this.collideConnected = true;
    }

    public Initialize(
        param1: b2Body,
        param2: b2Body,
        param3: b2Vec2,
        param4: b2Vec2,
        param5: b2Vec2,
        param6: b2Vec2,
        param7: number,
    ) {
        this.body1 = param1;
        this.body2 = param2;
        this.groundAnchor1.SetV(param3);
        this.groundAnchor2.SetV(param4);
        this.localAnchor1 = this.body1.GetLocalPoint(param5);
        this.localAnchor2 = this.body2.GetLocalPoint(param6);
        var _loc8_: number = param5.x - param3.x;
        var _loc9_: number = param5.y - param3.y;
        this.length1 = Math.sqrt(_loc8_ * _loc8_ + _loc9_ * _loc9_);
        var _loc10_: number = param6.x - param4.x;
        var _loc11_: number = param6.y - param4.y;
        this.length2 = Math.sqrt(_loc10_ * _loc10_ + _loc11_ * _loc11_);
        this.ratio = param7;
        var _loc12_: number = this.length1 + this.ratio * this.length2;
        this.maxLength1 =
            _loc12_ - this.ratio * b2PulleyJoint.b2_minPulleyLength;
        this.maxLength2 =
            (_loc12_ - b2PulleyJoint.b2_minPulleyLength) / this.ratio;
    }
}