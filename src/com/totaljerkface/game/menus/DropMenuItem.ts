import { boundClass } from 'autobind-decorator';
import CapsStyle from "flash/display/CapsStyle";
import JointStyle from "flash/display/JointStyle";
import LineScaleMode from "flash/display/LineScaleMode";
import Sprite from "flash/display/Sprite";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";

/* [Embed(source="/_assets/assets.swf", symbol="symbol3029")] */
@boundClass
export default class DropMenuItem extends Sprite {
    public bg: Sprite;
    public currText: TextField;
    private _bgWidth: number;
    private _index: number;

    constructor(param1: string, param2: number, param3: number = 100) {
        super();
        this.mouseChildren = false;
        this.buttonMode = true;
        this._index = param2;
        this.currText.autoSize = TextFieldAutoSize.LEFT;
        this.currText.wordWrap = false;
        this.currText.embedFonts = true;
        this.currText.selectable = false;
        this.currText.text = param1;
        this._bgWidth = param3;
        this.bg = new Sprite();
        this.addChildAt(this.bg, 0);
        this.rollOut();
    }

    private drawBg(param1: number) {
        this.bg.graphics.clear();
        this.bg.graphics.lineStyle(
            1,
            13421772,
            1,
            false,
            LineScaleMode.NORMAL,
            CapsStyle.NONE,
            JointStyle.MITER,
            3,
        );
        this.bg.graphics.beginFill(param1);
        this.bg.graphics.drawRect(0, 0, this._bgWidth, 22);
        this.bg.graphics.endFill();
    }

    public rollOver() {
        this.drawBg(16777215);
        this.currText.textColor = 4032711;
    }

    public rollOut() {
        this.drawBg(15724527);
        this.currText.textColor = 8947848;
    }

    public mouseDown() {
        this.drawBg(13421772);
        this.currText.textColor = 16777215;
    }

    // @ts-expect-error
    public override get height(): number {
        return this.bg.height;
    }

    public get index(): number {
        return this._index;
    }

    public get text(): string {
        return this.currText.text;
    }

    public get textWidth(): number {
        return this.currText.textWidth;
    }

    public get bgWidth(): number {
        return this.bg.width;
    }

    public set bgWidth(param1: number) {
        this._bgWidth = param1;
        this.rollOut();
    }
}