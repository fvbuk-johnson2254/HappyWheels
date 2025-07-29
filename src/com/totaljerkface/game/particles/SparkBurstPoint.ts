import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import Settings from "@/com/totaljerkface/game/Settings";
import Emitter from "@/com/totaljerkface/game/particles/Emitter";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import Spark from "@/com/totaljerkface/game/particles/Spark";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class SparkBurstPoint extends Emitter {
    protected initialRange: number;
    protected speedRange: number;
    protected halfInitialRange: number;
    protected halfSpeedRange: number;
    protected offSet: b2Vec2;
    protected targetBody: b2Body;
    protected m_physScale: number;
    protected startVel: b2Vec2;
    protected startPos: b2Vec2;

    constructor(
        param1: b2Vec2,
        param2: b2Vec2,
        param3: number,
        param4: number,
        param5: number = 100,
    ) {
        super(param5);
        this.initialRange = param3;
        this.halfInitialRange = param3 / 2;
        this.speedRange = param4;
        this.halfSpeedRange = param4 / 2;
        this.m_physScale = Settings.currentSession.m_physScale;
        this.startVel = param2;
        this.startPos = param1;
        this.createParticles();
    }

    private createParticles() {
        var _loc1_: number = 0;
        while (_loc1_ < this.total) {
            if (
                ParticleController.totalParticles >=
                ParticleController.maxParticles
            ) {
                this.finished = true;
                return;
            }
            this.createParticle();
            ParticleController.totalParticles += 1;
            _loc1_++;
        }
        this.finished = true;
    }

    protected override createParticle() {
        var _loc1_: number =
            this.startVel.x +
            Math.random() *
            (Math.random() * this.speedRange - this.halfSpeedRange);
        var _loc2_: number =
            this.startVel.y +
            Math.random() *
            (Math.random() * this.speedRange - this.halfSpeedRange);
        var _loc3_ = new Spark(_loc2_, _loc1_);
        this.addChildAt(_loc3_, 0);
        _loc3_.x =
            this.startPos.x * this.m_physScale +
            Math.random() * this.initialRange -
            this.halfInitialRange;
        _loc3_.y =
            this.startPos.y * this.m_physScale +
            Math.random() * this.initialRange -
            this.halfInitialRange;
    }

    public override step(): boolean {
        var _loc3_: Spark = null;
        var _loc1_: number = this.numChildren;
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.getChildAt(_loc2_) as Spark;
            if (_loc3_.step() == false) {
                _loc2_--;
                _loc1_--;
                --ParticleController.totalParticles;
                this.removeChild(_loc3_);
            }
            _loc2_++;
        }
        if (this.finished && _loc1_ == 0) {
            return false;
        }
        return true;
    }
}