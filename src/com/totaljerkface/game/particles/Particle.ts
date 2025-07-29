import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import Bitmap from "flash/display/Bitmap";
import BitmapData from "flash/display/BitmapData";

@boundClass
export default class Particle extends Bitmap {
    protected static scaler: number;
    protected static gravityIncrement: number = 0.6944444444444444;
    public speedY: number;
    public speedX: number;
    public bitmap: Bitmap;

    constructor(param1: number, param2: number, param3: BitmapData) {
        super(param3);
        this.speedY = param1 * Particle.scaler;
        this.speedX = param2 * Particle.scaler;
    }

    public step(): boolean {
        this.y += this.speedY;
        this.x += this.speedX;
        this.speedY += Particle.gravityIncrement;
        if (this.y > Settings.YParticleLimit) {
            return false;
        }
        return true;
    }
}