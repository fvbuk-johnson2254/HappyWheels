import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2OBB {
    public R = new b2Mat22();
    public center = new b2Vec2();
    public extents = new b2Vec2();
}