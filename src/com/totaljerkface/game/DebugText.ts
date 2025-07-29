import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import TimerEvent from "flash/events/TimerEvent";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";
import Timer from "flash/utils/Timer";

@boundClass
export default class DebugText extends Sprite {
    private _textField: TextField;
    private _timer: Timer;
    private fadeTime: number;
    private counter: number;

    constructor() {
        super();
        this._textField = new TextField();
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std",
            12,
            16711680,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.CENTER,
        );
        this._textField.defaultTextFormat = _loc1_;
        this._textField.multiline = true;
        this._textField.height = 20;
        this._textField.width = 300;
        this._textField.x = 300;
        this._textField.mouseEnabled = false;
        this._textField.selectable = false;
        this._textField.embedFonts = true;
        this._textField.autoSize = TextFieldAutoSize.CENTER;
        this._textField.wordWrap = true;
        this.addChild(this._textField);
        this.mouseEnabled = false;
        this.mouseChildren = false;
    }

    public set text(param1: string) {
        this.removeListeners();
        this.alpha = 1;
        this._textField.text = param1;
    }

    public set htmlText(param1: string) {
        this.removeListeners();
        this.alpha = 1;
        this._textField.htmlText = param1;
    }

    public appendText(param1: string) {
        this.removeListeners();
        this.alpha = 1;
        this._textField.appendText(param1);
    }

    private removeListeners() {
        if (this._timer) {
            this._timer.stop();
            this._timer.removeEventListener(TimerEvent.TIMER, this.startFade);
            this._timer = null;
        }
        this.removeEventListener(Event.ENTER_FRAME, this.fadeOut);
    }

    public show(param1: string, param2: number = 2, param3: number = 1) {
        this.alpha = 1;
        this._textField.text = param1;
        if (this._timer) {
            this._timer.stop();
            this._timer.removeEventListener(TimerEvent.TIMER, this.startFade);
            this.removeEventListener(Event.ENTER_FRAME, this.fadeOut);
            this._timer = null;
        }
        this.fadeTime = param3 * 30;
        this._timer = new Timer(param2 * 1000, 1);
        this._timer.addEventListener(TimerEvent.TIMER, this.startFade);
        this._timer.start();
    }

    private startFade(param1: TimerEvent) {
        if (this._timer) {
            this._timer.stop();
            this._timer.removeEventListener(TimerEvent.TIMER, this.startFade);
            this._timer = null;
        }
        this.counter = 0;
        this.addEventListener(Event.ENTER_FRAME, this.fadeOut);
    }

    private fadeOut(param1: Event) {
        ++this.counter;
        this.alpha = (this.fadeTime - this.counter) / this.fadeTime;
        if (this.counter == this.fadeTime) {
            this.removeEventListener(Event.ENTER_FRAME, this.fadeOut);
        }
    }
}