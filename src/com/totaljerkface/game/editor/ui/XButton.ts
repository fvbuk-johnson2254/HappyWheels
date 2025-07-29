import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import ColorTransform from "flash/geom/ColorTransform";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2912")] */
@boundClass
export default class XButton extends GenericButton {
    public XSprite: Sprite;

    constructor(
        param1: string,
        param2: number,
        param3: number,
        param4: number = 16777215,
    ) {
        super(param1, param2, param3, param4);
    }

    protected override createTextField() {
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
        this.textField.borderColor = 16711680;
        this.textField.defaultTextFormat = _loc1_;
        this.textField.autoSize = TextFieldAutoSize.CENTER;
        this.textField.height = 20;
        this.textField.y = 3;
        this.textField.multiline = false;
        this.textField.selectable = false;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.ADVANCED;
        this.addChild(this.textField);
        var _loc2_: ColorTransform = this.XSprite.transform.colorTransform;
        _loc2_.color = this._txtColor;
        this.XSprite.transform.colorTransform = _loc2_;
    }

    protected override createBg() {
        this.textField.width;
        this.textField.autoSize = TextFieldAutoSize.NONE;
        this.textField.width = Math.ceil(this.textField.width + 20);
        this.textField.x = 0;
        var _loc1_: number = this.textField.width + 2;
        this.XSprite.x = _loc1_;
        this.XSprite.y = 11.5;
        this._bgWidth = this.textField.width + 18;
        super.createBg();
    }

    protected override rollOverHandler(param1: MouseEvent = null) {
        this.textField.alpha = this.XSprite.alpha = 1;
    }

    protected override rollOutHandler(param1: MouseEvent = null) {
        if (this._selected) {
            return;
        }
        this.textField.alpha = this.XSprite.alpha = this.offAlpha;
    }
}