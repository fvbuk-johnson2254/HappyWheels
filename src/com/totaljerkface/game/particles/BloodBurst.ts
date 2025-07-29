import BloodParticle from "@/com/totaljerkface/game/particles/BloodParticle";
import Emitter from "@/com/totaljerkface/game/particles/Emitter";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class BloodBurst extends Emitter {
    protected initialRange: number;
    protected speedRange: number;
    protected halfInitialRange: number;
    protected halfSpeedRange: number;
    protected threeQuarterSpeedRange: number;
    protected _container: Sprite;
    protected particleClass;
    protected particleList: BloodParticle;

    constructor(
        param1: Sprite,
        param2: number,
        param3: number,
        param4: number,
        param5: number,
        param6: number = 100,
    ) {
        super(param6);
        this.startX = param2;
        this.startY = param3;
        this.initialRange = param4;
        this.halfInitialRange = param4 / 2;
        this.speedRange = param5;
        this.halfSpeedRange = param5 / 2;
        this.threeQuarterSpeedRange = (param5 * 3) / 4;
        if (param1) {
            this._container = param1;
        } else {
            this._container = this;
        }
        var _loc7_: string =
            Settings.bloodSetting == 2 ? "BloodParticleLine" : "BloodParticle";
        this.particleClass = getDefinitionByName(
            "com.totaljerkface.game.particles." + _loc7_,
        );
        this.createParticles();
    }

    protected createParticles() {
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
            Math.random() *
            (Math.random() * this.speedRange - this.halfSpeedRange);
        var _loc2_: number =
            Math.random() *
            (Math.random() * this.speedRange - this.threeQuarterSpeedRange);
        var _loc3_: number =
            this.startX +
            Math.random() * this.initialRange -
            this.halfInitialRange;
        var _loc4_: number =
            this.startY +
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
            if (!_loc7_.step(_loc3_, _loc4_, _loc5_, _loc6_)) {
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