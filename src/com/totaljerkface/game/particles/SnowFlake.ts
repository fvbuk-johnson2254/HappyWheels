import Particle from "@/com/totaljerkface/game/particles/Particle";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import BitmapData from "flash/display/BitmapData";

@boundClass
export default class SnowFlake extends Particle {
    public slowGrav: number;
    public MaxAirSpeed: number = 20;
    protected accelX: number;

    constructor(param1: number, param2: number, param3: BitmapData) {
        super(param1, param2, param3);
        this.accelX = Math.random() * 0.02 - 0.01;
    }

    public override step(): boolean {
        this.y += this.speedY;
        this.x += this.speedX;
        this.speedY += this.slowGrav;
        if (this.speedY > this.MaxAirSpeed) {
            this.speedY *= 0.9;
        }
        if (this.speedX > this.MaxAirSpeed) {
            this.speedX *= 0.9;
        }
        if (this.y > Settings.YParticleLimit) {
            return false;
        }
        return true;
    }
}