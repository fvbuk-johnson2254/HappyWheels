import b2ContactID from "@/Box2D/Collision/b2ContactID";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class ClipVertex {
    public v = new b2Vec2();
    public id = new b2ContactID();
}