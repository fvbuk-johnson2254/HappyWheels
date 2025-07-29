import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
// import BevelFilter from "flash/filters/BevelFilter";
import { boundClass } from 'autobind-decorator';
import DropShadowFilter from "flash/filters/DropShadowFilter";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class GenericButton extends Sprite {
    protected textField: TextField;
    protected bg: Sprite;
    protected _bgColor: number;
    protected _bgWidth: number;
    protected _bgHeight: number = 23;
    protected _txtColor: number;
    protected _selected: boolean;
    protected offAlpha: number = 0.7;
    protected _disabled: boolean;
    protected _functionString: string;
    protected _helpString: string;

    constructor(
        param1: string,
        param2: number,
        param3: number,
        param4: number = 16777215,
    ) {
        super();
        this.mouseChildren = false;
        this.buttonMode = true;
        this.tabEnabled = false;
        this._bgColor = param2;
        this._bgWidth = param3;
        this._txtColor = param4;
        this.createTextField();
        this.textField.text = param1;
        this.createBg();
        this.selected = false;
        this.addEventListener(
            MouseEvent.ROLL_OVER,
            this.rollOverHandler,
            false,
            0,
            true,
        );
        this.addEventListener(
            MouseEvent.ROLL_OUT,
            this.rollOutHandler,
            false,
            0,
            true,
        );
    }

    protected createTextField() {
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std Med",
            12,
            this._txtColor,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.CENTER,
        );
        this.textField = new TextField();
        this.textField.defaultTextFormat = _loc1_;
        this.textField.width = this._bgWidth;
        this.textField.height = 20;
        this.textField.y = 3;
        this.textField.multiline = false;
        this.textField.selectable = false;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.ADVANCED;
        this.addChild(this.textField);
    }

    protected createBg() {
        this.bg = new Sprite();
        this.addChildAt(this.bg, 0);
        this.bg.graphics.beginFill(this._bgColor);
        this.bg.graphics.drawRoundRect(
            0,
            0,
            this._bgWidth,
            this._bgHeight,
            5,
            5,
        );
        this.bg.graphics.endFill();
        // var _loc1_ = new BevelFilter(2, 90, 16777215, 0.3, 0, 0.3, 3, 3, 1, 3);
        var _loc2_ = new DropShadowFilter(2, 90, 0, 1, 4, 4, 0.25, 3);
        this.bg.filters = [/*_loc1_,*/ _loc2_];
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(param1: boolean) {
        this._selected = param1;
        if (this._selected) {
            this.rollOverHandler();
        } else {
            this.rollOutHandler();
        }
    }

    protected rollOverHandler(param1: MouseEvent = null) {
        this.textField.alpha = 1;
        if (this._helpString) {
            MouseHelper.instance.show(this._helpString, this, 5);
        }
    }

    protected rollOutHandler(param1: MouseEvent = null) {
        if (this._selected) {
            return;
        }
        this.textField.alpha = this.offAlpha;
    }

    public get disabled(): boolean {
        return this._disabled;
    }

    public set disabled(param1: boolean) {
        this._disabled = param1;
        if (param1) {
            this.removeEventListener(
                MouseEvent.ROLL_OVER,
                this.rollOverHandler,
            );
            this.removeEventListener(MouseEvent.ROLL_OUT, this.rollOutHandler);
            this.mouseEnabled = false;
            this.buttonMode = false;
            this.alpha = 0.5;
        } else {
            this.addEventListener(
                MouseEvent.ROLL_OVER,
                this.rollOverHandler,
                false,
                0,
                true,
            );
            this.addEventListener(
                MouseEvent.ROLL_OUT,
                this.rollOutHandler,
                false,
                0,
                true,
            );
            this.mouseEnabled = true;
            this.buttonMode = true;
            this.alpha = 1;
        }
    }

    protected mouseUpHandler(param1: MouseEvent) { }

    public get functionString(): string {
        return this._functionString;
    }

    public set functionString(param1: string) {
        this._functionString = param1;
    }

    public get helpString(): string {
        return this._helpString;
    }

    public set helpString(param1: string) {
        this._helpString = param1;
    }
}