import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";

export default class b2DestructionListener {
    public SayGoodbyeJoint(joint: b2Joint) {}
    public SayGoodbyeShape(joint: b2Shape) {}
}