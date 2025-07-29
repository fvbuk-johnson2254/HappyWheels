import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import BloodBurst from "@/com/totaljerkface/game/particles/BloodBurst";
import BloodParticle from "@/com/totaljerkface/game/particles/BloodParticle";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class BloodBurst2 extends BloodBurst {
    private offSet: b2Vec2;
    private targetBody: b2Body;
    private m_physScale: number = Settings.currentSession.m_physScale;
    private startVel: b2Vec2;
    private startPos: b2Vec2;

    constructor(
        param1: Sprite,
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
        var _loc3_: number =
            this.startPos.x * this.m_physScale +
            Math.random() * this.initialRange -
            this.halfInitialRange;
        var _loc4_: number =
            this.startPos.y * this.m_physScale +
            Math.random() * this.initialRange -
            this.halfInitialRange;
        var _loc5_: BloodParticle = new this.particleClass(
            this._container,
            _loc3_,
            _loc4_,
            _loc1_,
            _loc2_,
        );
        _loc5_.next = this.particleList;
        if (this.particleList) {
            this.particleList.prev = _loc5_;
        }
        this.particleList = _loc5_;
    }
}