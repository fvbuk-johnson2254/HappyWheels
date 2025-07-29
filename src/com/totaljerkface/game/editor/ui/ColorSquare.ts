import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class ColorSquare extends Sprite {
    public static squareWidth: number;
    private _color: number;
    public id: number;

    constructor(param1: number) {
        super();
        this.color = param1;
        this.buttonMode = true;
        this.tabEnabled = false;
    }

    private drawSquare() {
        this.graphics.clear();
        this.graphics.beginFill(this._color);
        this.graphics.drawRect(
            0,
            0,
            ColorSquare.squareWidth,
            ColorSquare.squareWidth,
        );
        this.graphics.endFill();
    }

    public get color(): number {
        return this._color;
    }

    public set color(param1: number) {
        this._color = param1;
        this.drawSquare();
    }
}