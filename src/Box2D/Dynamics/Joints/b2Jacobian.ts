import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2Jacobian {
    public linear1 = new b2Vec2();
    public angular1: number;
    public linear2 = new b2Vec2();
    public angular2: number;

    public SetZero() {
        this.linear1.SetZero();
        this.angular1 = 0;
        this.linear2.SetZero();
        this.angular2 = 0;
    }

    public Set(param1: b2Vec2, param2: number, param3: b2Vec2, param4: number) {
        this.linear1.SetV(param1);
        this.angular1 = param2;
        this.linear2.SetV(param3);
        this.angular2 = param4;
    }

    public Compute(
        param1: b2Vec2,
        param2: number,
        param3: b2Vec2,
        param4: number,
    ): number {
        return (
            this.linear1.x * param1.x +
            this.linear1.y * param1.y +
            this.angular1 * param2 +
            (this.linear2.x * param3.x + this.linear2.y * param3.y) +
            this.angular2 * param4
        );
    }
}