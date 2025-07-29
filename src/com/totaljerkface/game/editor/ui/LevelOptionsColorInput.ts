import ColorInput from "@/com/totaljerkface/game/editor/ui/ColorInput";
import { boundClass } from 'autobind-decorator';
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class LevelOptionsColorInput extends ColorInput {
    constructor(
        param1: string,
        param2: string,
        param3: boolean,
        param4: boolean = false,
    ) {
        super(param1, param2, param3, param4);
    }

    protected override createLabel(param1: string) {
        var _loc2_ = new TextFormat(
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
        this.colorBorder.x = 108;
        this.noColorSprite.x = 117.5;
    }
}