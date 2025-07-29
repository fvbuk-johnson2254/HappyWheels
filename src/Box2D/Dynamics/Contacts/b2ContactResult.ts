import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactID from "@/Box2D/Collision/b2ContactID";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2ContactResult {
    public shape1: b2Shape;
    public shape2: b2Shape;
    public position = new b2Vec2();
    public normal = new b2Vec2();
    public normalImpulse: number;
    public tangentImpulse: number;
    public id = new b2ContactID();
}