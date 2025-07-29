import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import BloodParticle from "@/com/totaljerkface/game/particles/BloodParticle";
import BloodParticleLine from "@/com/totaljerkface/game/particles/BloodParticleLine";
import Emitter from "@/com/totaljerkface/game/particles/Emitter";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class BloodFlow extends Emitter {
    private angle: number;
    private minSpeed: number;
    private maxSpeed: number;
    private speedRange: number;
    private m_physScale: number;
    private offSet: b2Vec2;
    private targetBody: b2Body;
    private _container: Sprite;
    private particleClass;
    private particleList: BloodParticle;
    private particleList2: BloodParticleLine;

    constructor(
        param1: Sprite,
        param2: b2Body,
        param3: b2Vec2,
        param4: number,
        param5: number,
        param6: number,
        param7: number = 1000,
    ) {
        super(param7);
        this.targetBody = param2;
        this.offSet = param3;
        this.angle = (param4 * Math.PI) / 180;
        this.minSpeed = param5;
        this.maxSpeed = param6;
        this.speedRange = param6 - param5;
        this.m_physScale = Settings.currentSession.m_physScale;
        if (param1) {
            this._container = param1;
        } else {
            this._container = this;
        }
        var _loc8_: string =
            Settings.bloodSetting == 2 ? "BloodParticleLine" : "BloodParticle";
        this.particleClass = getDefinitionByName(
            "com.totaljerkface.game.particles." + _loc8_,
        );
    }

    protected override createParticle() {
        if (this.count > this.total) {
            this.finished = true;
            return;
        }
        ++this.count;
        ParticleController.totalParticles += 1;
        var _loc1_: number = Math.random() * this.speedRange + this.minSpeed;
        var _loc2_: number = this.targetBody.GetAngle() + this.angle;
        var _loc3_: b2Vec2 = this.targetBody.GetLinearVelocityFromLocalPoint(
            this.offSet,
        );
        var _loc4_: number = Math.cos(_loc2_) * _loc1_ + _loc3_.x;
        var _loc5_: number = Math.sin(_loc2_) * _loc1_ + _loc3_.y;
        var _loc6_: b2Vec2 = this.targetBody.GetWorldPoint(this.offSet);
        var _loc7_: BloodParticle = new this.particleClass(
            this._container,
            _loc6_.x * this.m_physScale,
            _loc6_.y * this.m_physScale,
            _loc4_,
            _loc5_,
        );
        _loc7_.next = this.particleList;
        if (this.particleList) {
            this.particleList.prev = _loc7_;
        }
        this.particleList = _loc7_;
    }

    public override step(): boolean {
        var _loc1_: number = 0;
        if (this._container == this) {
            this._container.graphics.clear();
        }
        var _loc2_: Rectangle = Settings.currentSession.camera.screenBounds;
        var _loc3_: number = _loc2_.x - 50;
        var _loc4_: number = _loc2_.x + 950;
        var _loc5_: number = _loc2_.y - 50;
        var _loc6_: number = _loc2_.y + 550;
        var _loc7_: BloodParticle = this.particleList;
        while (_loc7_) {
            _loc1_ += 1;
            if (_loc7_.step(_loc3_, _loc4_, _loc5_, _loc6_) == false) {
                if (_loc7_.prev) {
                    _loc7_.prev.next = _loc7_.next;
                }
                if (_loc7_.next) {
                    _loc7_.next.prev = _loc7_.prev;
                }
                if (_loc7_ == this.particleList) {
                    this.particleList = _loc7_.next;
                }
                _loc7_.removeFrom(this._container);
                --ParticleController.totalParticles;
                _loc1_--;
            }
            _loc7_ = _loc7_.next;
        }
        if (
            ParticleController.totalParticles < ParticleController.maxParticles
        ) {
            this.createParticle();
        }
        if (this.finished && _loc1_ == 0) {
            return false;
        }
        return true;
    }

    public get container(): Sprite {
        return this._container;
    }

    public override die() {
        if (this._container == this) {
            this._container.graphics.clear();
        }
    }
}