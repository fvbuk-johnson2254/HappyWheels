import EmitterBitmap from "@/com/totaljerkface/game/particles/EmitterBitmap";
import Particle from "@/com/totaljerkface/game/particles/Particle";
import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Flow extends EmitterBitmap {
    protected yMinSpeed: number;
    protected yMaxSpeed: number;
    protected rot: number;

    constructor(
        param1: any[],
        param2: number,
        param3: number,
        param4: number,
        param5: number,
        param6: number,
        param7: number = 1000,
    ) {
        super(param1, param7);
        this.startX = param2;
        this.startY = param3;
        this.yMinSpeed = param4;
        this.yMaxSpeed = param5;
        this.rot = (param6 * Math.PI) / 180;
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
        var _loc2_: number = Math.cos(this.rot) * _loc1_;
        var _loc3_: number = Math.sin(this.rot) * _loc1_;
        var _loc4_: number = Math.floor(Math.random() * this.bmdLength);
        var _loc5_ = new Particle(_loc3_, _loc2_, this.bmdArray[_loc4_]);
        this.addChildAt(_loc5_, 0);
        _loc5_.x = this.startX - _loc5_.width / 2;
        _loc5_.y = this.startY - _loc5_.height / 2;
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
            this.createParticle();
        }
        if (this.finished && _loc1_ == 0) {
            return false;
        }
        return true;
    }
}