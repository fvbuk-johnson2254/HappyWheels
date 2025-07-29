import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import Settings from "@/com/totaljerkface/game/Settings";
import EmitterBitmap from "@/com/totaljerkface/game/particles/EmitterBitmap";
import Particle from "@/com/totaljerkface/game/particles/Particle";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Spray extends EmitterBitmap {
    protected minSpeed: number;
    protected maxSpeed: number;
    protected rangeX: number;
    protected rangeY: number;
    protected perFrame: number;
    protected defaultAngle: number;
    protected rot: number;
    protected angleRange: number;
    protected targetBody: b2Body;
    protected m_physScale: number;

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
        super(param1, param9);
        this.targetBody = param2;
        this.minSpeed = param5;
        this.maxSpeed = param6;
        this.perFrame = param8;
        this.startX = param3.x;
        this.startY = param3.y;
        var _loc10_ = new b2Vec2(param4.x - param3.x, param4.y - param3.y);
        this.rangeX = _loc10_.x;
        this.rangeY = _loc10_.y;
        this.angleRange = (param7 * Math.PI) / 180;
        var _loc11_: number = Math.atan2(_loc10_.y, _loc10_.x);
        this.rot = _loc11_ + (Math.PI * 0.5 - this.angleRange * 0.5);
        this.m_physScale = Settings.currentSession.m_physScale;
    }

    protected override createParticle() {
        var _loc9_: Particle = null;
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
        _loc9_ = new Particle(_loc7_, _loc6_, this.bmdArray[_loc8_]);
        this.addChildAt(_loc9_, 0);
        var _loc10_: b2Vec2 = this.targetBody.GetWorldPoint(_loc2_);
        _loc9_.x = _loc10_.x * this.m_physScale - _loc9_.width * 0.5;
        _loc9_.y = _loc10_.y * this.m_physScale - _loc9_.height * 0.5;
    }

    public override step(): boolean {
        var _loc3_: Particle = null;
        var _loc1_: number = this.numChildren;
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.getChildAt(_loc2_) as Particle;
            if (_loc3_.step() == false) {
                _loc2_--;
                _loc1_--;
                --ParticleController.totalParticles;
                this.removeChild(_loc3_);
            }
            _loc2_++;
        }
        if (
            ParticleController.totalParticles < ParticleController.maxParticles
        ) {
            _loc2_ = 0;
            while (_loc2_ < this.perFrame) {
                this.createParticle();
                _loc2_++;
            }
        }
        if (this.finished && _loc1_ == 0) {
            return false;
        }
        return true;
    }
}