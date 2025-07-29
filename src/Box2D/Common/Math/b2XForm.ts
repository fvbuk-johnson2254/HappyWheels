import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2XForm {
    public position = new b2Vec2();
    public R = new b2Mat22();

    constructor(param1: b2Vec2 = null, param2: b2Mat22 = null) {
        if (param1) {
            this.position.SetV(param1);
            this.R.SetM(param2);
        }
    }

    public Initialize(param1: b2Vec2, param2: b2Mat22) {
        this.position.SetV(param1);
        this.R.SetM(param2);
    }

    public SetIdentity() {
        this.position.SetZero();
        this.R.SetIdentity();
    }

    public Set(param1: b2XForm) {
        this.position.SetV(param1.position);
        this.R.SetM(param1.R);
    }

    public GetAngle(): number {
        return Math.atan2(this.R.col1.y, this.R.col1.x);
    }
}