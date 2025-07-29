import EmitterBitmap from "@/com/totaljerkface/game/particles/EmitterBitmap";
import Particle from "@/com/totaljerkface/game/particles/Particle";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Burst extends EmitterBitmap {
    protected initialRange: number;
    protected speedRange: number;
    protected halfInitialRange: number;
    protected halfSpeedRange: number;
    protected threeQuarterSpeedRange: number;

    constructor(
        param1: any[],
        param2: number,
        param3: number,
        param4: number,
        param5: number,
        param6: number = 100,
    ) {
        super(param1, param6);
        this.startX = param2;
        this.startY = param3;
        this.initialRange = param4;
        this.halfInitialRange = param4 / 2;
        this.speedRange = param5;
        this.halfSpeedRange = param5 / 2;
        this.threeQuarterSpeedRange = (param5 * 3) / 4;
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
        var _loc4_: Particle = null;
        var _loc1_: number =
            Math.random() *
            (Math.random() * this.speedRange - this.halfSpeedRange);
        var _loc2_: number =
            Math.random() *
            (Math.random() * this.speedRange - this.threeQuarterSpeedRange);
        var _loc3_: number = Math.floor(Math.random() * this.bmdLength);
        _loc4_ = new Particle(_loc2_, _loc1_, this.bmdArray[_loc3_]);
        this.addChildAt(_loc4_, 0);
        _loc4_.x =
            this.startX -
            _loc4_.width / 2 +
            Math.random() * this.initialRange -
            this.halfInitialRange;
        _loc4_.y =
            this.startY -
            _loc4_.height / 2 +
            Math.random() * this.initialRange -
            this.halfInitialRange;
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
        if (this.finished && _loc1_ == 0) {
            return false;
        }
        return true;
    }
}