import Settings from "@/com/totaljerkface/game/Settings";
import BloodParticle from "@/com/totaljerkface/game/particles/BloodParticle";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class BloodParticleLine extends BloodParticle {
    private lineThickness: number;

    constructor(
        param1,
        param2: number,
        param3: number,
        param4: number,
        param5: number,
    ) {
        super(param1, param2, param3, param4, param5);
        this.minLineThickness = 1;
    }

    public override step(
        param1: number,
        param2: number,
        param3: number,
        param4: number,
    ): boolean {
        if (
            this.currentPos.x > param1 &&
            this.currentPos.x < param2 &&
            this.currentPos.y > param3 &&
            this.currentPos.y < param4
        ) {
            this.container.graphics.lineStyle(this.lineThickness, 10027008, 1);
            this.container.graphics.moveTo(
                this.currentPos.x,
                this.currentPos.y,
            );
            this.container.graphics.lineTo(this.lastPos.x, this.lastPos.y);
        }
        var _loc5_: number = this.currentPos.x - this.lastPos.x;
        var _loc6_: number = this.currentPos.y - this.lastPos.y;
        var _loc7_: number = _loc5_ * _loc5_ + _loc6_ * _loc6_;
        this.lineThickness = Math.max(
            (1 - _loc7_ * 0.005) * 2 + this.minLineThickness,
            this.minLineThickness,
        );
        this.lastPos.x = this.currentPos.x;
        this.lastPos.y = this.currentPos.y;
        this.currentPos.x += _loc5_;
        this.currentPos.y =
            this.currentPos.y + _loc6_ + BloodParticle.gravityIncrement;
        if (this.lastPos.y > Settings.YParticleLimit) {
            return false;
        }
        return true;
    }
}