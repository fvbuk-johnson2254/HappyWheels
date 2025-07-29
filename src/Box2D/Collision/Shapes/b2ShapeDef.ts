import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2Shape from '@/Box2D/Collision/Shapes/b2Shape';

export default class b2ShapeDef {
    public type = b2Shape.e_unknownShape;
    public userData = null;
    public friction: number = 0.2;
    public restitution: number = 0;
    public density: number = 0;
    public isSensor: boolean = false;
    public filter = new b2FilterData();
}