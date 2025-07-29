import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2836")] */
@boundClass
export default class ArrowPiece extends MovieClip {
    protected static scaler: number;
    protected static gravityIncrement: number = 0.6944444444444444;
    protected speedY: number;
    protected speedX: number;
    protected rotSpeed: number;
    protected gravitySpeed: number = 0;

    constructor(
        param1: number,
        param2: number,
        param3: boolean,
        param4: number,
    ) {
        super();
        this.speedY = param1 * ArrowPiece.scaler;
        this.speedX = param2 * ArrowPiece.scaler;
        if (param3) {
            this.gotoAndStop(param4);
        } else {
            this.gotoAndStop(param4 + 6);
        }
        this.rotSpeed = 100 - Math.random() * 200;
    }

    public step(): boolean {
        this.y += this.speedY;
        this.x += this.speedX;
        this.speedY += ArrowPiece.gravityIncrement;
        this.rotation += this.rotSpeed;
        if (this.y > Settings.YParticleLimit) {
            return false;
        }
        return true;
    }
}