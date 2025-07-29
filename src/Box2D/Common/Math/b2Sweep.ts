import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2XForm from "@/Box2D/Common/Math/b2XForm";

export default class b2Sweep {
	public localCenter = new b2Vec2();
    public c0 = new b2Vec2();
    public c = new b2Vec2();
    public a0: number;
    public a: number;
    public t0: number;

    public GetXForm(xf: b2XForm, t: number) {
        if (1 - this.t0 > Number.MIN_VALUE) {
            var alpha = (t - this.t0) / (1 - this.t0);
            xf.position.x = (1 - alpha) * this.c0.x + alpha * this.c.x;
            xf.position.y = (1 - alpha) * this.c0.y + alpha * this.c.y;
            var angle = (1 - alpha) * this.a0 + alpha * this.a;
            xf.R.Set(angle);
        } else {
            xf.position.SetV(this.c);
            xf.R.Set(this.a);
        }
        var tMat = xf.R;
        xf.position.x -= tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y;
        xf.position.y -= tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y;
    }

    public Advance(param1: number) {
        if (this.t0 < param1 && 1 - this.t0 > Number.MIN_VALUE) {
            var alpha = (param1 - this.t0) / (1 - this.t0);
            this.c0.x = (1 - alpha) * this.c0.x + alpha * this.c.x;
            this.c0.y = (1 - alpha) * this.c0.y + alpha * this.c.y;
            this.a0 = (1 - alpha) * this.a0 + alpha * this.a;
            this.t0 = param1;
        }
    }
}