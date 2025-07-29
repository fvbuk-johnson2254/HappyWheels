import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import Settings from "@/com/totaljerkface/game/Settings";
import ArrowPiece from "@/com/totaljerkface/game/particles/ArrowPiece";
import Emitter from "@/com/totaljerkface/game/particles/Emitter";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ArrowSnap extends Emitter {
    private static oneEightyOverPI: number;
    protected speedRange: number;
    protected halfSpeedRange: number;
    protected targetBody: b2Body;
    protected m_physScale: number;
    protected startVel: b2Vec2;
    protected startPos: b2Vec2;
    protected tip: boolean;
    protected arrowFrame: number;

    constructor(param1: b2Body, param2: number, param3: number = 10) {
        super(2);
        this.targetBody = param1;
        this.speedRange = param3;
        this.halfSpeedRange = param3 / 2;
        this.m_physScale = Settings.currentSession.m_physScale;
        this.arrowFrame = param2;
        this.createParticles();
    }

    private createParticles() {
        var _loc1_: number = 0;
        while (_loc1_ < 2) {
            this.tip = _loc1_ < 1 ? true : false;
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
        var _loc3_: ArrowPiece = null;
        var _loc4_: b2Vec2 = null;
        if (this.tip) {
            _loc4_ = new b2Vec2(13.25 / this.m_physScale, 0);
            this.startVel =
                this.targetBody.GetLinearVelocityFromLocalPoint(_loc4_);
            this.startPos = this.targetBody.GetWorldPoint(_loc4_);
        } else {
            _loc4_ = new b2Vec2(-13.25 / this.m_physScale, 0);
            this.startVel =
                this.targetBody.GetLinearVelocityFromLocalPoint(_loc4_);
            this.startPos = this.targetBody.GetWorldPoint(_loc4_);
        }
        var _loc1_: number =
            this.startVel.x +
            Math.random() *
            (Math.random() * this.speedRange - this.halfSpeedRange);
        var _loc2_: number =
            this.startVel.y +
            Math.random() *
            (Math.random() * this.speedRange - this.halfSpeedRange);
        _loc3_ = new ArrowPiece(_loc2_, _loc1_, this.tip, this.arrowFrame);
        _loc3_.rotation =
            (this.targetBody.GetAngle() * ArrowSnap.oneEightyOverPI) % 360;
        this.addChildAt(_loc3_, 0);
        _loc3_.x = this.startPos.x * this.m_physScale;
        _loc3_.y = this.startPos.y * this.m_physScale;
    }

    public override step(): boolean {
        var _loc3_: ArrowPiece = null;
        var _loc1_: number = this.numChildren;
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.getChildAt(_loc2_) as ArrowPiece;
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