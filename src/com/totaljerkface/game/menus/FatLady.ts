import OldMan from "@/com/totaljerkface/game/menus/OldMan";
import { boundClass } from 'autobind-decorator';
import MovieClip from 'flash/display/MovieClip';
import Sprite from "flash/display/Sprite";

/* [Embed(source="/_assets/assets.swf", symbol="symbol524")] */
@boundClass
export default class FatLady extends OldMan {
    public jaw2: Sprite;
    public jaw3: Sprite;
    public jaw4: Sprite;
    public jaw5: Sprite;

    constructor() {
        super();
        
        console.log('Embed FatLady');
        // @ts-ignore
        embedRecursive(this, {
            body: Sprite,
            arm: Sprite,
            foreArm: Sprite,
            head: Sprite,
            jaw: Sprite,
            eyes: MovieClip,
            eye1: Sprite,
            eye2: Sprite,
            jaw2: Sprite,
            jaw3: Sprite,
            jaw4: Sprite,
            jaw5: Sprite
        }, 524);

        console.log({
            fatLady: this,
            jaw2: this.jaw2,
            jaw3: this.jaw3,
            jaw4: this.jaw4,
            jaw5: this.jaw5
        });

        this.jaw2 = this.head.getChildByName("jaw2") as Sprite;
        this.jaw3 = this.head.getChildByName("jaw3") as Sprite;
        this.jaw4 = this.head.getChildByName("jaw4") as Sprite;
        this.jaw5 = this.head.getChildByName("jaw5") as Sprite;
        this.jawTopY = -56.85;
        this.headMinAngle = -3;
        this.eye1LeftX = -32;
        this.eye1RangeX = 16;
        this.eye1TopY = 1;
        this.eye1RangeY = 5;
        this.eye2LeftX = 31;
        this.eye2RangeX = 11;
        this.eye2TopY = 0;
        this.eye2RangeY = 5;
        this.foreArmMinAngle = -25;
        this.foreArmRange = 60;
    }

    public override set jawTween(param1: number) {
        // if (!this.jaw2) {
        //     console.error('why jaw 2 does not exist yet?');
        //     return;
        // }
        this._jawTween = param1;
        this.jaw.y = this.jawTopY + this._jawTween * this.jawRangeY;
        this.jaw2.y = -34 + this._jawTween * 6.5;
        this.jaw3.x = -76.9 + this._jawTween * 3.4;
        this.jaw3.rotation = 0 + this._jawTween * 11.5;
        this.jaw4.y = -65.45 + this._jawTween * 5;
        this.jaw5.x = 33.45 - this._jawTween * 10;
        this.jaw5.y = -16.55 + this._jawTween * 7.75;
        this.jaw5.rotation = 0 + this._jawTween * 10.4;
    }
}