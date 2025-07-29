import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class Spark extends Sprite {
    protected static scaler: number;
    protected static gravityIncrement: number = 0.6944444444444444;
    protected static decayRate: number = 0.65;
    protected speedY: number;
    protected speedX: number;
    protected changeY: number;
    protected gravitySpeed: number = 0;
    protected color: number;

    constructor(param1: number, param2: number) {
        super();
        this.speedY = param1 * Spark.scaler;
        this.speedX = param2 * Spark.scaler;
        this.color = 16776960 + Math.round(Math.random() * 255);
    }

    public step(): boolean {
        this.changeY = this.speedY + this.gravitySpeed;
        this.graphics.clear();
        this.graphics.lineStyle(1, this.color);
        this.graphics.moveTo(-this.speedX, -this.changeY);
        this.graphics.lineTo(0, 0);
        this.y += this.changeY;
        this.x += this.speedX;
        this.speedX *= Spark.decayRate;
        this.speedY *= Spark.decayRate;
        this.gravitySpeed += Spark.gravityIncrement;
        if (Math.abs(this.speedY) < 1 && Math.abs(this.speedX) < 1) {
            return false;
        }
        return true;
    }
}