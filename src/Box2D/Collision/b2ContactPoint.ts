import b2ContactID from "@/Box2D/Collision/b2ContactID";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2ContactPoint {
    public shape1: b2Shape;
    public shape2: b2Shape;
    public position = new b2Vec2();
    public velocity = new b2Vec2();
    public normal = new b2Vec2();
    public separation: number;
    public friction: number;
    public restitution: number;
    public id = new b2ContactID();
    public swap: boolean = false;

    public toString() {
        trace("position " + this.position.x + ", " + this.position.y);
        var _loc1_: b2Vec2 = this.shape1.GetBody().GetLocalPoint(this.position);
        trace("local_p1 " + _loc1_.x + ", " + _loc1_.y);
        var _loc2_: b2Vec2 = this.shape2.GetBody().GetLocalPoint(this.position);
        trace("local_p2 " + _loc2_.x + ", " + _loc2_.y);
        trace("normal " + this.normal.x + ", " + this.normal.y);
        trace("separation " + this.separation);
        trace("id.key " + this.id.key.toString(16));
        trace("flip " + this.id.features.flip);
        trace("swap " + this.swap);
    }
}