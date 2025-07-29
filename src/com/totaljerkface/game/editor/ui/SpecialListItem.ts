import SpecialExpandItem from "@/com/totaljerkface/game/editor/ui/SpecialExpandItem";
import { boundClass } from 'autobind-decorator';
import CapsStyle from "flash/display/CapsStyle";
import JointStyle from "flash/display/JointStyle";
import LineScaleMode from "flash/display/LineScaleMode";
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class SpecialListItem extends Sprite {
    public bg: Sprite;
    public textField: TextField;
    protected indentPixels: number = 13;
    protected _parentItem: SpecialExpandItem;
    protected _selected: boolean;
    protected _bgWidth: number;
    protected _bgHeight: number = 22;
    protected _value: string;
    protected _defBgColor: number = 13421772;
    protected _overBgColor: number = 14540253;
    protected _downBgColor: number = 4032711;
    protected _defTextColor: number = 16777215;
    protected _overTextColor: number = 10066329;
    protected _downTextColor: number = 16777215;

    constructor(
        param1: string,
        param2: string,
        param3: number = 0,
        param4: number = 100,
    ) {
        super();
        var _loc5_: number = NaN;

        this._value = param2;
        this.createTextField();
        this.textField.text = param1;
        this.textField.x = 5 + param3 * this.indentPixels;
        if (param3 > 0) {
            _loc5_ = 1118481 * param3;
            this._defBgColor -= _loc5_;
            this._overBgColor -= _loc5_;
            this._downBgColor -= _loc5_;
            this._defTextColor -= _loc5_;
            this._overTextColor -= _loc5_;
            this._downTextColor -= _loc5_;
        }
        this._bgWidth = param4;
        this.bg = new Sprite();
        this.addChildAt(this.bg, 0);
        this.bg.mouseEnabled = this.textField.mouseEnabled = false;
        this.rollOut();
    }

    protected createTextField() {
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std",
            12,
            this._defTextColor,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.textField = new TextField();
        this.textField.defaultTextFormat = _loc1_;
        this.textField.autoSize = TextFieldAutoSize.LEFT;
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

    protected drawBg(param1: number) {
        this.bg.graphics.clear();
        this.bg.graphics.lineStyle(
            1,
            10066329,
            1,
            false,
            LineScaleMode.NORMAL,
            CapsStyle.NONE,
            JointStyle.MITER,
            3,
        );
        this.bg.graphics.beginFill(param1);
        this.bg.graphics.drawRect(0, 0, this._bgWidth, this._bgHeight);
        this.bg.graphics.endFill();
    }

    public rollOver(param1: MouseEvent = null) {
        if (this._selected) {
            return;
        }
        this.drawBg(this._overBgColor);
        this.textField.textColor = this._overTextColor;
        this.drawSymbol();
        if (this._parentItem) {
            this._parentItem.rollOver();
        }
    }

    public rollOut(param1: MouseEvent = null) {
        if (this._selected) {
            return;
        }
        this.drawBg(this._defBgColor);
        this.textField.textColor = this._defTextColor;
        this.drawSymbol();
        if (this._parentItem) {
            this._parentItem.rollOut();
        }
    }

    public mouseDown() {
        this.drawBg(this._downBgColor);
        this.textField.textColor = this._downTextColor;
        this.drawSymbol();
    }

    protected drawSymbol() { }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(param1: boolean) {
        if (this._selected == param1) {
            return;
        }
        this._selected = param1;
        if (this._selected) {
            this.mouseDown();
        } else {
            this.rollOut();
        }
        if (this._parentItem) {
            this._parentItem.selected = this._selected;
        }
    }

    // @ts-expect-error
    public override get height(): number {
        return this._bgHeight;
    }

    public get value(): string {
        return this._value;
    }

    public get text(): string {
        return this.textField.text;
    }

    public get textWidth(): number {
        return this.textField.textWidth;
    }

    public get bgWidth(): number {
        return this.bg.width;
    }

    public set bgWidth(param1: number) {
        this._bgWidth = param1;
        this.rollOut();
    }

    public get parentItem(): SpecialExpandItem {
        return this._parentItem;
    }

    public set parentItem(param1: SpecialExpandItem) {
        this._parentItem = param1;
        if (this._selected) {
            this._parentItem.selected = true;
        }
    }
}