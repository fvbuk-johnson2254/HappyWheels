import TextInput from "@/com/totaljerkface/game/editor/ui/TextInput";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";

/* [Embed(source="/_assets/assets.swf", symbol="symbol727")] */
@boundClass
export default class SliderInput extends TextInput {
    public sliderTab: Sprite;
    public sliderLine: Sprite;
    public sliderBG: Sprite;
    protected min: number;
    protected max: number;
    protected divisions: number;
    protected step: number;
    protected valueStep: number;
    protected valueRange: number;

    constructor(
        param1: string,
        param2: string,
        param3: number,
        param4: boolean,
        param5: number,
        param6: number,
        param7: number,
    ) {
        super(param1, param2, param3, param4);
        this.min = param5;
        this.max = param6;
        this.valueRange = param6 - param5;
        this.divisions = param7;
        this.step = 100 / param7;
        this.valueStep = this.valueRange / param7;
    }

    protected override init() {
        super.init();
        this.sliderLine.mouseEnabled = false;
        if (this.sliderBG) {
            this.sliderBG.addEventListener(
                MouseEvent.MOUSE_DOWN,
                this.mouseDownHandler,
            );
        }
        this.sliderTab.addEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
    }

    protected override keyDownHandler(param1: KeyboardEvent) {
        var _loc2_: number = NaN;
        if (param1.keyCode == 13) {
            _loc2_ = Number(this.inputText.text);
            if (isNaN(_loc2_)) {
                _loc2_ = this.min;
            }
            if (_loc2_ < this.min) {
                _loc2_ = this.min;
            }
            if (_loc2_ > this.max) {
                _loc2_ = this.max;
            }
            this.currentString = _loc2_.toString();
            this.stage.focus = this.stage;
            this.dispatchEvent(
                new ValueEvent(
                    ValueEvent.VALUE_CHANGE,
                    this,
                    this.currentString,
                ),
            );
        } else if (param1.keyCode == 9 && !this._ambiguous) {
            _loc2_ = Number(this.inputText.text);
            if (isNaN(_loc2_)) {
                _loc2_ = this.min;
            }
            if (_loc2_ < this.min) {
                _loc2_ = this.min;
            }
            if (_loc2_ > this.max) {
                _loc2_ = this.max;
            }
            this.currentString = _loc2_.toString();
            this.dispatchEvent(
                new ValueEvent(
                    ValueEvent.VALUE_CHANGE,
                    this,
                    this.currentString,
                ),
            );
        }
    }

    protected mouseDownHandler(param1: MouseEvent) {
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.mouseTrack);
        this.mouseTrack(new MouseEvent(MouseEvent.MOUSE_DOWN));
    }

    protected mouseUpHandler(param1: MouseEvent) {
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.mouseTrack);
        this.currentString = this.inputText.text;
        this.dispatchEvent(
            new ValueEvent(ValueEvent.VALUE_CHANGE, this, this.currentString),
        );
    }

    protected mouseTrack(param1: MouseEvent) {
        var _loc6_: string = null;
        var _loc7_: string = null;
        var _loc8_: number = NaN;
        var _loc2_: number = Math.round(
            (this.mouseX - this.sliderLine.x) / this.step,
        );
        _loc2_ = _loc2_ < 0 ? 0 : _loc2_;
        _loc2_ = _loc2_ > this.divisions ? int(this.divisions) : _loc2_;
        var _loc3_: number = Math.round(_loc2_ * this.step);
        this.sliderTab.x = _loc3_ + this.sliderLine.x;
        this.sliderLine.width = _loc3_;
        var _loc4_: number = this.min + _loc2_ * this.valueStep;
        var _loc5_: any[] = _loc4_.toString().split(".");
        if (_loc5_[1]) {
            _loc6_ = _loc5_[1];
            if (_loc6_.length > 2) {
                _loc7_ = _loc6_.substr(0, 2) + "." + _loc6_.substr(2, 1);
                _loc8_ = Math.round(Number(_loc7_));
                _loc4_ = Number(_loc5_[0] + "." + _loc8_);
            }
        }
        this.text = _loc4_.toString();
    }

    public override setValue(param1) {
        var _loc3_: number = NaN;
        super.setValue(param1);
        var _loc2_: number = (param1 - this.min) / this.valueRange;
        _loc3_ = Math.round(_loc2_ * 100);
        this.sliderTab.x = _loc3_ + this.sliderLine.x;
        this.sliderLine.width = _loc3_;
    }

    public override die() {
        super.die();
        if (this.stage) {
            this.stage.removeEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
            );
            this.stage.removeEventListener(
                MouseEvent.MOUSE_MOVE,
                this.mouseTrack,
            );
        }
        this.sliderTab.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        if (this.sliderBG) {
            this.sliderBG.removeEventListener(
                MouseEvent.MOUSE_DOWN,
                this.mouseDownHandler,
            );
        }
    }
}