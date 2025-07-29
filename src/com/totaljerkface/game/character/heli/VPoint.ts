import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class VPoint {
    private static gravityIncrement: number;
    public currPos: b2Vec2;
    public prevPos: b2Vec2;
    public mass: number;
    public invMass: number;

    constructor(param1: b2Vec2, param2: boolean) {
        this.currPos = new b2Vec2(param1.x, param1.y);
        this.prevPos = new b2Vec2(param1.x, param1.y);
        this.mass = param2 ? 0 : 1;
        this.invMass = param2 ? 0 : 1 / this.mass;
    }

    public step() {
        var _loc1_: b2Vec2 = null;
        if (this.mass > 0) {
            _loc1_ = new b2Vec2(
                this.currPos.x - this.prevPos.x,
                this.currPos.y - this.prevPos.y,
            );
            this.prevPos.Set(this.currPos.x, this.currPos.y);
            this.currPos.x += _loc1_.x;
            this.currPos.y += _loc1_.y + (VPoint.gravityIncrement * 1) / 30;
        }
    }

    public setPosition(param1: b2Vec2) {
        this.currPos.Set(param1.x, param1.y);
        this.prevPos.Set(param1.x, param1.y);
    }

    public set fixed(param1: boolean) {
        this.mass = param1 ? 0 : 1;
        this.invMass = param1 ? 0 : 1 / this.mass;
    }
}