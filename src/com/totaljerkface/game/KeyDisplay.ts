import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import Sprite from "flash/display/Sprite";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol131")] */
@boundClass
export default class KeyDisplay extends Sprite {
    public upKey: Sprite;
    public downKey: Sprite;
    public leftKey: Sprite;
    public rightKey: Sprite;
    public spaceKey: Sprite;
    public shiftKey: Sprite;
    public ctrlKey: Sprite;
    public zKey: Sprite;
    private char: CharacterB2D;
    private alphaVal: number = 0.2;

    constructor(param1: CharacterB2D) {
        super();
        this.char = param1;
        this.setupMCs();
    }

    private setupMCs() {
        this.upKey.cacheAsBitmap = true;
        this.downKey.cacheAsBitmap = true;
        this.leftKey.cacheAsBitmap = true;
        this.rightKey.cacheAsBitmap = true;
        this.spaceKey.cacheAsBitmap = true;
        this.shiftKey.cacheAsBitmap = true;
        this.ctrlKey.cacheAsBitmap = true;
        this.zKey.cacheAsBitmap = true;
        this.upKey.alpha = this.alphaVal;
        this.downKey.alpha = this.alphaVal;
        this.leftKey.alpha = this.alphaVal;
        this.rightKey.alpha = this.alphaVal;
        this.spaceKey.alpha = this.alphaVal;
        this.shiftKey.alpha = this.alphaVal;
        this.ctrlKey.alpha = this.alphaVal;
        this.zKey.alpha = this.alphaVal;
    }

    public upKeyON() {
        this.upKey.alpha = 1;
    }

    public upKeyOFF() {
        this.upKey.alpha = 0.2;
    }

    public rightKeyON() {
        this.rightKey.alpha = 1;
    }

    public rightKeyOFF() {
        this.rightKey.alpha = 0.2;
    }

    public downKeyON() {
        this.downKey.alpha = 1;
    }

    public downKeyOFF() {
        this.downKey.alpha = 0.2;
    }

    public leftKeyON() {
        this.leftKey.alpha = 1;
    }

    public leftKeyOFF() {
        this.leftKey.alpha = 0.2;
    }

    public spaceKeyON() {
        this.spaceKey.alpha = 1;
    }

    public spaceKeyOFF() {
        this.spaceKey.alpha = 0.2;
    }

    public shiftKeyON() {
        this.shiftKey.alpha = 1;
    }

    public shiftKeyOFF() {
        this.shiftKey.alpha = 0.2;
    }

    public ctrlKeyON() {
        this.ctrlKey.alpha = 1;
    }

    public ctrlKeyOFF() {
        this.ctrlKey.alpha = 0.2;
    }

    public zKeyON() {
        this.zKey.alpha = 1;
    }

    public zKeyOFF() {
        this.zKey.alpha = 0.2;
    }
}