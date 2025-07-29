import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFieldType from "flash/text/TextFieldType";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class TextBoxRef extends Special {
    private MIN_SIZE: number;
    private MAX_SIZE: number = 100;
    private MIN_TEXT_DIMENSION: number = 20;
    private MAX_TEXT_DIMENSION: number = 1000;
    protected textField: TextField;
    protected textFormat: TextFormat;
    protected bg: Sprite;
    protected _caption: string = "HERE\'S SOME TEXT";
    protected _fontSize: number = 15;
    protected _align: number = 1;
    protected _font: number = 2;
    protected _color: number = 0;
    protected _opacity: number = 1;
    protected _editing: boolean = false;

    constructor() {
        super();
        this._triggerable = true;
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = ["change opacity", "slide"];
        this._triggerActionListProperties = [
            ["newOpacities", "opacityTimes"],
            ["slideTimes", "newX", "newY"],
        ];
        this._triggerString = "triggerActionsText";

        this.name = "text field";
        this._shapesUsed = 0;
        this._rotatable = true;
        this._scalable = false;
        this._joinable = false;
        this._groupable = true;
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        this.doubleClickEnabled = true;
        this.createTextField();
    }

    public static getAlignment(param1: number): string {
        var _loc2_: string = null;
        switch (param1) {
            case 1:
                _loc2_ = TextFormatAlign.LEFT;
                break;
            case 2:
                _loc2_ = TextFormatAlign.CENTER;
                break;
            case 3:
                _loc2_ = TextFormatAlign.RIGHT;
        }
        return _loc2_;
    }

    public static getFontName(param1: number): string {
        var _loc2_: string = null;
        switch (param1) {
            case 1:
                _loc2_ = "HelveticaNeueLT Std";
                break;
            case 2:
                _loc2_ = "HelveticaNeueLT Std Med";
                break;
            case 3:
                _loc2_ = "HelveticaNeueLT Std";
                break;
            case 4:
                _loc2_ = "Clarendon LT Std";
                break;
            case 5:
                _loc2_ = "Clarendon LT Std";
        }
        return _loc2_;
    }

    public static getFontBold(param1: number): boolean {
        var _loc2_: boolean = false;
        switch (param1) {
            case 1:
                _loc2_ = false;
                break;
            case 2:
                _loc2_ = false;
                break;
            case 3:
                _loc2_ = true;
                break;
            case 4:
                _loc2_ = false;
                break;
            case 5:
                _loc2_ = true;
        }
        return _loc2_;
    }

    public override setAttributes() {
        this._type = "TextBoxRef";
        this._attributes = [
            "x",
            "y",
            "angle",
            "color",
            "opacity",
            "font",
            "fontSize",
            "align",
        ];
        this.addTriggerProperties();
    }

    public override getFullProperties(): any[] {
        return [
            "x",
            "y",
            "angle",
            "color",
            "font",
            "fontSize",
            "align",
            "caption",
            "opacity",
        ];
    }

    protected createTextField() {
        this.textFormat = new TextFormat(
            TextBoxRef.getFontName(this._font),
            this._fontSize,
            this._color,
            TextBoxRef.getFontBold(this._font),
            null,
            null,
            null,
            null,
            // @ts-expect-error
            TextBoxRef.getAlignment(this._align),
        );
        this.textField = new TextField();
        this.textField.defaultTextFormat = this.textFormat;
        this.textField.type = TextFieldType.INPUT;
        this.textField.multiline = true;
        this.textField.autoSize = TextFieldAutoSize.LEFT;
        this.textField.wordWrap = false;
        this.textField.selectable = true;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.ADVANCED;
        this.textField.maxChars = 200;
        this.textField.restrict = "a-z A-Z 0-9 !@#$%\\^&*()_+\\-=;\'|?/,.<> \"";
        this.textField.alpha = this._opacity;
        this.textField.addEventListener(
            Event.CHANGE,
            this.adjustBg,
            false,
            0,
            true,
        );
        this.bg = new Sprite();
        this.bg.graphics.lineStyle(0, 16613761, 1, true);
        this.bg.graphics.drawRect(0, 0, 100, 100);
        this.bg.width = this.textField.width;
        this.bg.height = this.textField.height;
        this.addChildAt(this.bg, 0);
        this.addChild(this.textField);
        this.caption = this._caption;
    }

    private adjustBg(param1: Event = null) {
        this.bg.width = this.textField.width;
        this.bg.height = this.textField.height;
        if (this._selected) {
            this.drawBoundingBox();
        }
    }

    public selectAllText() {
        if (!this._editing) {
            return;
        }
        this.textField.setSelection(0, this.textField.length);
    }

    public get editing(): boolean {
        return this._editing;
    }

    public set editing(param1: boolean) {
        var _loc2_: number = 0;
        this._editing = param1;
        if (this._editing) {
            this.mouseChildren = true;
            this.stage.focus = this.textField;
            _loc2_ = this.textField.length;
            this.textField.setSelection(_loc2_, _loc2_);
        } else {
            this.mouseChildren = false;
            this.stage.focus = this.stage;
        }
    }

    public get caption(): string {
        return this._caption;
    }

    public set caption(param1: string) {
        this._caption = param1;
        this.textField.text = this._caption;
        this.adjustBg();
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get currentText(): string {
        return this.textField.text;
    }

    public get fontSize(): number {
        return this._fontSize;
    }

    public set fontSize(param1: number) {
        this._fontSize = param1;
        if (this._fontSize < this.MIN_SIZE) {
            this._fontSize = this.MIN_SIZE;
        }
        if (this._fontSize > this.MAX_SIZE) {
            this._fontSize = this.MAX_SIZE;
        }
        this.textFormat.size = this._fontSize;
        this.textField.defaultTextFormat = this.textFormat;
        this.textField.setTextFormat(this.textFormat);
        this.adjustBg();
        this.x = this.x;
        this.y = this.y;
    }

    public get align(): number {
        return this._align;
    }

    public set align(param1: number) {
        this._align = param1;
        if (this._align < 1) {
            this._align = 1;
        }
        if (this._align > 3) {
            this._align = 3;
        }
        // @ts-expect-error
        this.textFormat.align = TextBoxRef.getAlignment(this._align);
        this.textField.defaultTextFormat = this.textFormat;
        this.textField.setTextFormat(this.textFormat);
        this.adjustBg();
        this.x = this.x;
        this.y = this.y;
    }

    public get font(): number {
        return this._font;
    }

    public set font(param1: number) {
        this._font = param1;
        if (this._font < 1) {
            this._font = 1;
        }
        if (this._font > 5) {
            this._font = 5;
        }
        this.textFormat.font = TextBoxRef.getFontName(this._font);
        this.textFormat.bold = TextBoxRef.getFontBold(this._font);
        this.textField.defaultTextFormat = this.textFormat;
        this.textField.setTextFormat(this.textFormat);
        this.adjustBg();
        this.x = this.x;
        this.y = this.y;
    }

    public get color(): number {
        return this._color;
    }

    public set color(param1: number) {
        if (this._color == param1) {
            return;
        }
        this._color = param1;
        this.textFormat.color = this._color;
        this.textField.defaultTextFormat = this.textFormat;
        this.textField.setTextFormat(this.textFormat);
    }

    public get opacity(): number {
        return Math.round(this._opacity * 100);
    }

    public set opacity(param1: number) {
        if (param1 < 0) {
            param1 = 0;
        }
        if (param1 > 100) {
            param1 = 100;
        }
        this._opacity = param1 * 0.01;
        this.textField.alpha = this._opacity;
    }

    public override clone(): RefSprite {
        var _loc1_ = new TextBoxRef();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.fontSize = this.fontSize;
        _loc1_.font = this.font;
        _loc1_.align = this.align;
        _loc1_.color = this.color;
        _loc1_.opacity = this.opacity;
        _loc1_.caption = this.caption;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public get triggerActionsText(): Dictionary<any, any> {
        return this._triggerActions;
    }
}