import ColorSelector from "@/com/totaljerkface/game/editor/ui/ColorSelector";
import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import Point from "flash/geom/Point";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

/* [Embed(source="/_assets/assets.swf", symbol="symbol814")] */
@boundClass
export default class ColorInput extends InputObject {
    public colorBorder: Sprite;
    public noColorSprite: Sprite;
    protected labelText: TextField;
    private colorSprite: Sprite;
    private colorSelector: ColorSelector;
    private _color: number;
    private _minusColor: boolean;

    constructor(
        param1: string,
        param2: string,
        param3: boolean,
        param4: boolean = false,
    ) {
        super();
        this.createLabel(param1);
        this.attribute = param2;
        this.childInputs = new Array();
        this.editable = param3;
        this._minusColor = param4;
        this._color = 0;
        this.init();
    }

    private init() {
        this.colorSprite = new Sprite();
        this.addChild(this.colorSprite);
        this.colorSprite.x = this.colorBorder.x + 2;
        this.colorSprite.y = this.colorBorder.y + 2;
        this.colorSprite.mouseEnabled = this.noColorSprite.mouseEnabled = false;
        this.drawColorSprite();
        this.colorBorder.addEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
    }

    protected createLabel(param1: string) {
        var _loc2_ = new TextFormat(
            "HelveticaNeueLT Std",
            11,
            16777215,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.labelText = new TextField();
        this.labelText.defaultTextFormat = _loc2_;
        this.labelText.autoSize = TextFieldAutoSize.LEFT;
        this.labelText.width = 10;
        this.labelText.height = 17;
        this.labelText.x = 0;
        this.labelText.y = 0;
        this.labelText.multiline = false;
        this.labelText.selectable = false;
        this.labelText.embedFonts = true;
        // @ts-expect-error
        this.labelText.antiAliasType = AntiAliasType.ADVANCED;
        this.labelText.text = param1 + ":";
        this.addChild(this.labelText);
    }

    private drawColorSprite() {
        if (this._color < 0) {
            this.noColorSprite.visible = true;
            this.colorSprite.visible = false;
        } else {
            this.noColorSprite.visible = false;
            this.colorSprite.visible = true;
            this.colorSprite.graphics.clear();
            this.colorSprite.graphics.beginFill(this._color);
            this.colorSprite.graphics.drawRect(
                0,
                0,
                this.colorBorder.width - 4,
                this.colorBorder.height - 4,
            );
            this.colorSprite.graphics.endFill();
        }
    }

    public get color(): number {
        return this._color;
    }

    public set color(param1: number) {
        if (!this.editable) {
            return;
        }
        this._ambiguous = false;
        this._color = param1;
        this.drawColorSprite();
    }

    public override setValue(param1) {
        this.color = param1;
    }

    private mouseUpHandler(param1: MouseEvent) {
        if (this.colorSelector) {
            return;
        }
        this.colorSelector = new ColorSelector(this._color, this._minusColor);
        this.stage.addChild(this.colorSelector);
        var _loc2_: Point = this.localToGlobal(
            new Point(this.colorBorder.x - 5, this.colorBorder.y - 5),
        );
        this.colorSelector.x = _loc2_.x;
        this.colorSelector.y = _loc2_.y;
        this.colorSelector.addEventListener(
            ColorSelector.COLOR_SELECTED,
            this.colorSelected,
        );
        this.colorSelector.addEventListener(
            ColorSelector.ROLL_OUT,
            this.colorSelectorRollOut,
        );
    }

    private colorSelected(param1: Event) {
        this.color = this.colorSelector.currentColor;
        this.dispatchEvent(
            new ValueEvent(ValueEvent.VALUE_CHANGE, this, this.color, false),
        );
    }

    private colorSelectorRollOut(param1: Event) {
        this.color = this.colorSelector.currentColor;
        this.closeColorSelector();
        this.dispatchEvent(
            new ValueEvent(ValueEvent.VALUE_CHANGE, this, this.color),
        );
    }

    public closeColorSelector(param1: MouseEvent = null) {
        if (!this.colorSelector) {
            return;
        }
        this.colorSelector.die();
        this.colorSelector.removeEventListener(
            ColorSelector.COLOR_SELECTED,
            this.colorSelected,
        );
        this.colorSelector.removeEventListener(
            ColorSelector.ROLL_OUT,
            this.colorSelectorRollOut,
        );
        this.stage.removeChild(this.colorSelector);
        this.colorSelector = null;
    }

    // @ts-expect-error
    public override get height(): number {
        return 25;
    }

    public override die() {
        super.die();
        this.closeColorSelector();
        this.colorBorder.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
    }
}