import Window from "@/com/totaljerkface/game/editor/ui/Window";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class StatusSprite extends Sprite {
    protected textField: TextField;
    protected bg: Sprite;
    protected _window: Window;
    protected bgWidth: number;
    protected bgHeight: number = 100;

    constructor(param1: string, param2: boolean = true, param3: number = 200) {
        super();
        this.bgWidth = param3;
        this.createTextField();
        this.textField.htmlText = param1;
        this.createBg();
        this.createWindow(param2);
        this.adjustText();
    }

    protected createBg() {
        this.bgHeight = Math.max(this.textField.height * 2, 100);
        this.bg = new Sprite();
        this.bg.graphics.beginFill(13421772);
        this.bg.graphics.drawRect(0, 0, this.bgWidth, this.bgHeight);
        this.bg.graphics.endFill();
        this.addChildAt(this.bg, 0);
    }

    protected createTextField() {
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std",
            12,
            16777215,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.CENTER,
        );
        this.textField = new TextField();
        this.textField.defaultTextFormat = _loc1_;
        this.textField.width = this.bgWidth - 20;
        this.textField.height = 20;
        this.textField.autoSize = TextFieldAutoSize.LEFT;
        this.textField.multiline = true;
        this.textField.wordWrap = true;
        this.textField.selectable = false;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.ADVANCED;
        this.addChild(this.textField);
    }

    protected adjustText() {
        this.textField.x = (this.bgWidth - this.textField.width) / 2;
        this.textField.y = (this.bgHeight - this.textField.height) / 2;
    }

    protected createWindow(param1) {
        this._window = new Window(false, this, param1);
    }

    public get window(): Window {
        return this._window;
    }

    public die() {
        this._window.closeWindow();
    }
}