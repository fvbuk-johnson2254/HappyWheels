import StatusSprite from "@/com/totaljerkface/game/editor/StatusSprite";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class PromptSprite extends StatusSprite {
    public static BUTTON_PRESSED: string;
    private button: GenericButton;

    constructor(
        param1: string,
        param2: string,
        param3: boolean = true,
        param4: number = 200,
    ) {
        super(param1, param3, param4);
        this.button = new GenericButton(param2, 16613761, 70);
        this.addChild(this.button);
        this.button.x = Math.round((param4 - this.button.width) / 2);
        this.adjustSpacing();
        this.button.addEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
            false,
            0,
            true,
        );
    }

    protected override createBg() {
        this.bgHeight = Math.max(Math.round(this.textField.height + 40), 100);
        this.bg = new Sprite();
        this.bg.graphics.beginFill(13421772);
        this.bg.graphics.drawRect(0, 0, this.bgWidth, this.bgHeight);
        this.bg.graphics.endFill();
        this.addChildAt(this.bg, 0);
    }

    private adjustSpacing() {
        var _loc1_: number = NaN;
        _loc1_ = this.bgHeight - 30;
        this.button.y = _loc1_;
        this.textField.y = (_loc1_ - this.textField.height) / 2;
    }

    private mouseUpHandler(param1: MouseEvent) {
        this.dispatchEvent(new Event(PromptSprite.BUTTON_PRESSED));
        this.die();
    }

    public override die() {
        this._window.closeWindow();
        this.button.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
    }
}