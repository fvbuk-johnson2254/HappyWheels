import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import Settings from "@/com/totaljerkface/game/Settings";
import Flow from "@/com/totaljerkface/game/particles/Flow";
import Particle from "@/com/totaljerkface/game/particles/Particle";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Flow2 extends Flow {
    protected offSet: b2Vec2;
    protected targetBody: b2Body;
    protected m_physScale: number;

    constructor(
        param1: any[],
        param2: number,
        param3: number,
        param4: b2Body,
        param5: b2Vec2,
        param6: number,
        param7: number = 1000,
    ) {
        super(param1, 0, 0, param2, param3, param6, param7);
        this.offSet = param5;
        this.targetBody = param4;
        this.m_physScale = Settings.currentSession.m_physScale;
    }

    protected override createParticle() {
        if (this.count > this.total) {
            this.finished = true;
            return;
        }
        ++this.count;
        ParticleController.totalParticles += 1;
        var _loc1_: number =
            Math.random() * (this.yMaxSpeed - this.yMinSpeed) + this.yMinSpeed;
        var _loc2_: number = this.targetBody.GetAngle() + this.rot;
        var _loc3_: b2Vec2 = this.targetBody.GetLinearVelocityFromLocalPoint(
            this.offSet,
        );
        var _loc4_: number = Math.cos(_loc2_) * _loc1_ + _loc3_.x;
        var _loc5_: number = Math.sin(_loc2_) * _loc1_ + _loc3_.y;
        var _loc6_: number = Math.floor(Math.random() * this.bmdLength);
        var _loc7_ = new Particle(_loc5_, _loc4_, this.bmdArray[_loc6_]);
        this.addChildAt(_loc7_, 0);
        var _loc8_: b2Vec2 = this.targetBody.GetWorldPoint(this.offSet);
        _loc7_.x = _loc8_.x * this.m_physScale - _loc7_.width * 0.5;
        _loc7_.y = _loc8_.y * this.m_physScale - _loc7_.height * 0.5;
    }
}