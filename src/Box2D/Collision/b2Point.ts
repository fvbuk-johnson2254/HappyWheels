import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2XForm from "@/Box2D/Common/Math/b2XForm";

export default class b2Point {
    public p = new b2Vec2();;

    public Support(xf: b2XForm, vX: number, vY: number): b2Vec2 {
        return this.p;
    }

    public GetFirstVertex(xf: b2XForm): b2Vec2 {
        return this.p;
    }
}