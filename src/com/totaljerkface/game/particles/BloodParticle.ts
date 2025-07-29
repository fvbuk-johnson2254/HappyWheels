import ParticleController from "@/com/totaljerkface/game/particles/ParticleController";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class BloodParticle {
    protected static scaler: number;
    protected static gravityIncrement: number = 0.6944444444444444;
    protected minLineThickness: number = 1.75;
    protected currentPos: Point;
    protected lastPos: Point;
    protected _prev: BloodParticle;
    protected _next: BloodParticle;
    protected container: Sprite;

    constructor(
        param1,
        param2: number,
        param3: number,
        param4: number,
        param5: number,
    ) {
        this.container = param1;
        param4 *= BloodParticle.scaler;
        param5 *= BloodParticle.scaler;
        this.currentPos = new Point(param2 + param4, param3 + param5);
        this.lastPos = new Point(param2, param3);
    }

    public step(
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
            this.container.graphics.lineStyle(
                this.minLineThickness,
                10027008,
                1,
            );
            this.container.graphics.moveTo(
                this.currentPos.x,
                this.currentPos.y,
            );
            this.container.graphics.lineTo(this.lastPos.x, this.lastPos.y);
            ParticleController.drawnParticles = true;
        }
        var _loc5_: number = this.currentPos.x - this.lastPos.x;
        var _loc6_: number = this.currentPos.y - this.lastPos.y;
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

    public get prev(): BloodParticle {
        return this._prev;
    }

    public set prev(param1: BloodParticle) {
        this._prev = param1;
    }

    public get next(): BloodParticle {
        return this._next;
    }

    public set next(param1: BloodParticle) {
        this._next = param1;
    }

    public removeFrom(param1: DisplayObjectContainer) {
        param1 = null;
    }
}