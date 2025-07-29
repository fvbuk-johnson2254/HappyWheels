import SliderInput from "@/com/totaljerkface/game/editor/ui/SliderInput";
import { boundClass } from 'autobind-decorator';
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";

/* [Embed(source="/_assets/assets.swf", symbol="symbol407")] */
@boundClass
export default class OptionsSlider extends SliderInput {
    constructor(
        param1: string,
        param2: string,
        param3: number,
        param4: boolean,
        param5: number,
        param6: number,
        param7: number,
    ) {
        super(param1, param2, param3, param4, param5, param6, param7);
    }

    protected override init() {
        this.sliderTab.addEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.labelText.mouseEnabled = false;
        this.removeChild(this.labelText);
        this.inputText.wordWrap = this.labelText.wordWrap = false;
        this.inputText.autoSize = this.labelText.autoSize =
            TextFieldAutoSize.LEFT;
        this.inputText.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
    }
}