import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import VPoint from "@/com/totaljerkface/game/character/heli/VPoint";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class VSpring {
    public p1: VPoint;
    public p2: VPoint;
    public length: number;

    constructor(param1: VPoint, param2: VPoint) {
        this.p1 = param1;
        this.p2 = param2;
        this.length = b2Math.b2Distance(param1.currPos, param2.currPos);
    }

    public resolve() {
        var _loc1_ = new b2Vec2(
            this.p2.currPos.x - this.p1.currPos.x,
            this.p2.currPos.y - this.p1.currPos.y,
        );
        var _loc2_: number = Math.sqrt(
            _loc1_.x * _loc1_.x + _loc1_.y * _loc1_.y,
        );
        var _loc3_: number = (_loc2_ - this.length) / _loc2_;
        var _loc4_: b2Vec2 = _loc1_.Copy();
        _loc4_.Multiply(_loc3_);
        var _loc5_: number = this.p1.invMass + this.p2.invMass;
        var _loc6_: b2Vec2 = _loc4_.Copy();
        _loc6_.Multiply(this.p1.invMass / _loc5_);
        this.p1.currPos.Add(_loc6_);
        _loc6_ = _loc4_.Copy();
        _loc6_.Multiply(this.p2.invMass / _loc5_);
        this.p2.currPos.Subtract(_loc6_);
    }
}