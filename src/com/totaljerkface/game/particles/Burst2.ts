import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import Settings from "@/com/totaljerkface/game/Settings";
import Burst from "@/com/totaljerkface/game/particles/Burst";
import Particle from "@/com/totaljerkface/game/particles/Particle";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Burst2 extends Burst {
    private offSet: b2Vec2;
    private targetBody: b2Body;
    private m_physScale: number = Settings.currentSession.m_physScale;
    private startVel: b2Vec2;
    private startPos: b2Vec2;

    constructor(
        param1: any[],
        param2: number,
        param3: number,
        param4: b2Body,
        param5: b2Vec2,
        param6: number = 100,
    ) {
        super(param1, 0, 0, param2, param3, param6);
        this.targetBody = param4;
        this.offSet = param5;
        var _loc7_: b2Vec2 = param4.GetWorldCenter();
        this.startPos = new b2Vec2(_loc7_.x + param5.x, _loc7_.y + param5.y);
        _loc7_ = param4.GetLocalCenter().Copy();
        _loc7_.Add(param5);
        this.startVel = param4.GetLinearVelocityFromLocalPoint(_loc7_);
    }

    protected override createParticle() {
        var _loc1_: number =
            this.startVel.x +
            Math.random() *
            (Math.random() * this.speedRange - this.halfSpeedRange);
        var _loc2_: number =
            this.startVel.y +
            Math.random() *
            (Math.random() * this.speedRange - this.threeQuarterSpeedRange);
        var _loc3_: number = Math.floor(Math.random() * this.bmdLength);
        var _loc4_ = new Particle(_loc2_, _loc1_, this.bmdArray[_loc3_]);
        this.addChildAt(_loc4_, 0);
        _loc4_.x =
            this.startPos.x * this.m_physScale -
            _loc4_.width * 0.5 +
            Math.random() * this.initialRange -
            this.halfInitialRange;
        _loc4_.y =
            this.startPos.y * this.m_physScale -
            _loc4_.height * 0.5 +
            Math.random() * this.initialRange -
            this.halfInitialRange;
    }
}