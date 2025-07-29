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
export default class BloodSpray extends Emitter {
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
    protected _container: Sprite;
    protected particleClass;
    protected particleList: BloodParticle;
    protected particleList2: BloodParticleLine;

    constructor(
        param1: Sprite,
        param2: b2Body,
        param3: b2Vec2,
        param4: b2Vec2,
        param5: number,
        param6: number,
        param7: number,
        param8: number,
        param9: number = 1000,
    ) {
        super(param9);
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
        if (param1) {
            this._container = param1;
        } else {
            this._container = this;
        }
        var _loc12_: string =
            Settings.bloodSetting == 2 ? "BloodParticleLine" : "BloodParticle";
        this.particleClass = getDefinitionByName(
            "com.totaljerkface.game.particles." + _loc12_,
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
        var _loc8_: b2Vec2 = this.targetBody.GetWorldPoint(_loc2_);
        var _loc9_: BloodParticle = new this.particleClass(
            this._container,
            _loc8_.x * this.m_physScale,
            _loc8_.y * this.m_physScale,
            _loc6_,
            _loc7_,
        );
        _loc9_.next = this.particleList;
        if (this.particleList) {
            this.particleList.prev = _loc9_;
        }
        this.particleList = _loc9_;
    }

    public override step(): boolean {
        var _loc8_: number = 0;
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
            _loc8_ = 0;
            while (_loc8_ < this.perFrame) {
                this.createParticle();
                _loc8_++;
            }
        }
        if (this.finished && _loc1_ == 0) {
            return false;
        }
        return true;
    }
}