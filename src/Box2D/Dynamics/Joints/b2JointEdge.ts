import b2Body from "@/Box2D/Dynamics/b2Body";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";

export default class b2JointEdge {
    public other: b2Body;
    public joint: b2Joint;
    public prev: b2JointEdge;
    public next: b2JointEdge;
}