import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ShapeDef from "@/Box2D/Collision/Shapes/b2ShapeDef";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2CircleDef extends b2ShapeDef {
    public localPosition = new b2Vec2();
    public radius: number;

    constructor() {
        super();
        this.type = b2Shape.e_circleShape;
        this.radius = 1;
    }
}