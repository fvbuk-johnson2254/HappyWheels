import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class LoadLevelItem extends Sprite {
    private bg: Sprite;
    private textField: TextField;
    private defColor: number = 13421772;
    private selColor: number = 4032711;
    private _selected: boolean;

    constructor(param1: string) {
        super();
        this.createTextField();
        if (param1 != null) {
            this.textField.htmlText = "" + param1 + "";
        }
        this.bg = new Sprite();
        this.addChildAt(this.bg, 0);
        this.buttonMode = true;
        this.mouseChildren = false;
        this.selected = false;
    }

    public get selected(): boolean {
        return this._selected;
    }

    private createTextField() {
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std Med",
            12,
            16777215,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.textField = new TextField();
        this.textField.defaultTextFormat = _loc1_;
        this.textField.width = 195;
        this.textField.height = 18;
        this.textField.x = 5;
        this.textField.y = 2;
        this.textField.multiline = false;
        this.textField.wordWrap = false;
        this.textField.selectable = false;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.ADVANCED;
        this.addChild(this.textField);
    }

    private drawBg(param1: number) {
        this.bg.graphics.clear();
        this.bg.graphics.beginFill(param1);
        this.bg.graphics.drawRect(0, 0, 200, 20);
        this.bg.graphics.endFill();
        this.bg.graphics.lineStyle(0, 10066329, 1);
        this.bg.graphics.moveTo(0, 0);
        this.bg.graphics.lineTo(200, 0);
        this.bg.graphics.moveTo(0, 20);
        this.bg.graphics.lineTo(200, 20);
    }

    public set selected(param1: boolean) {
        this._selected = param1;
        if (this._selected) {
            this.drawBg(this.selColor);
        } else {
            this.drawBg(this.defColor);
        }
    }
}