import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import SnowFlake from "@/com/totaljerkface/game/particles/SnowFlake";
import Spray from "@/com/totaljerkface/game/particles/Spray";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class SnowSpray extends Spray {
    constructor(
        param1: any[],
        param2: b2Body,
        param3: b2Vec2,
        param4: b2Vec2,
        param5: number,
        param6: number,
        param7: number,
        param8: number,
        param9: number = 1000,
    ) {
        super(
            param1,
            param2,
            param3,
            param4,
            param5,
            param6,
            param7,
            param8,
            param9,
        );
    }

    protected override createParticle() {
        if (this.count > this.total) {
            this.finished = true;
            return;
        }
        ++this.count;
        ParticleController.totalParticles += 1;
        var _loc1_: number = Math.random();
        var _loc2_ = new b2Vec2(
            this.startX + this.rangeX * _loc1_,
            this.startY + this.rangeY * _loc1_,
        );
        var _loc3_: number =
            Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
        var _loc4_: number =
            this.targetBody.GetAngle() +
            this.rot +
            this.angleRange * Math.random();
        var _loc5_: b2Vec2 =
            this.targetBody.GetLinearVelocityFromLocalPoint(_loc2_);
        var _loc6_: number = Math.cos(_loc4_) * _loc3_ + _loc5_.x;
        var _loc7_: number = Math.sin(_loc4_) * _loc3_ + _loc5_.y;
        var _loc8_: number = Math.floor(Math.random() * this.bmdLength);
        var _loc9_ = new SnowFlake(_loc7_, _loc6_, this.bmdArray[_loc8_]);
        this.addChildAt(_loc9_, 0);
        var _loc10_: b2Vec2 = this.targetBody.GetWorldPoint(_loc2_);
        _loc9_.x = _loc10_.x * this.m_physScale - _loc9_.width * 0.5;
        _loc9_.y = _loc10_.y * this.m_physScale - _loc9_.height * 0.5;
    }
}