import b2ContactID from "@/Box2D/Collision/b2ContactID";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2ManifoldPoint {
    public localPoint1 = new b2Vec2();
    public localPoint2 = new b2Vec2();
    public separation: number;
    public normalImpulse: number;
    public tangentImpulse: number;
    public id = new b2ContactID();

    public Reset() {
        this.localPoint1.SetZero();
        this.localPoint2.SetZero();
        this.separation = 0;
        this.normalImpulse = 0;
        this.tangentImpulse = 0;
        this.id.key = 0;
    }

    public Set(param1: b2ManifoldPoint) {
        this.localPoint1.SetV(param1.localPoint1);
        this.localPoint2.SetV(param1.localPoint2);
        this.separation = param1.separation;
        this.normalImpulse = param1.normalImpulse;
        this.tangentImpulse = param1.tangentImpulse;
        this.id.key = param1.id.key;
    }
}