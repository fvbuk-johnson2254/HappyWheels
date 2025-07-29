import StatusSprite from "@/com/totaljerkface/game/editor/StatusSprite";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class ChoiceSprite extends StatusSprite {
    public static ANSWER_CHOSEN: string;
    public answer1Btn: GenericButton;
    public answer2Btn: GenericButton;
    private _index: number;

    constructor(
        param1: string,
        param2: string,
        param3: string,
        param4: boolean = true,
        param5: number = 200,
        param6: number = 70,
        param7: number = 16613761,
        param8: number = 16613761,
        param9: number = 16777215,
        param10: number = 16777215,
    ) {
        super(param1, param4, param5);
        this.createButtons(
            param2,
            param3,
            param6,
            param7,
            param8,
            param9,
            param10,
        );
        this.adjustSpacing();
        this.addEventListener(
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

    private createButtons(
        param1: string,
        param2: string,
        param3: number,
        param4: number,
        param5: number,
        param6: number,
        param7: number,
    ) {
        var _loc8_: number = 0;
        var _loc10_: number = 0;
        this.answer1Btn = new GenericButton(param1, param4, param3, param6);
        this.answer2Btn = new GenericButton(param2, param5, param3, param7);
        this.addChild(this.answer1Btn);
        this.addChild(this.answer2Btn);
        _loc8_ = 20;
        var _loc9_: number = param3 * 2 + _loc8_;
        _loc10_ = this.bgWidth * 0.5;
        this.answer1Btn.x = _loc10_ - _loc9_ * 0.5;
        this.answer2Btn.x = _loc10_ + _loc8_ * 0.5;
    }

    private adjustSpacing() {
        var _loc1_: number = this.bgHeight - 30;
        this.answer1Btn.y = this.answer2Btn.y = _loc1_;
        this.textField.y = (_loc1_ - this.textField.height) / 2;
    }

    private mouseUpHandler(param1: MouseEvent) {
        if (param1.target == this.answer1Btn) {
            this._index = 0;
        } else {
            if (param1.target != this.answer2Btn) {
                return;
            }
            this._index = 1;
        }
        this.dispatchEvent(new Event(ChoiceSprite.ANSWER_CHOSEN));
    }

    public get index(): number {
        return this._index;
    }

    public override die() {
        this._window.closeWindow();
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }
}