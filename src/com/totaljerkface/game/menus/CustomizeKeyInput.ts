import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import FocusEvent from "flash/events/FocusEvent";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import GlowFilter from "flash/filters/GlowFilter";
import TextField from "flash/text/TextField";

/* [Embed(source="/_assets/assets.swf", symbol="symbol811")] */
@boundClass
export default class CustomizeKeyInput extends Sprite {
    public static FOCUS_IN: string;
    public static FOCUS_OUT: string = "focusout";
    public labelText: TextField;
    public inputText: TextField;
    public defaultText: TextField;
    public bg: Sprite;
    public lastInput: string;
    private _keyCode: number;

    constructor(param1: string, param2: string, param3: string) {
        super();
        this.labelText.text = param1;
        this.inputText.text = this.lastInput = param2;
        this.inputText.mouseEnabled = false;
        this.defaultText.text = param3;
        this.addEventListener(MouseEvent.MOUSE_UP, this.handleMouseUp);
        this.bg.buttonMode = true;
        this.bg.tabEnabled = false;
        this.bg.useHandCursor = true;
    }

    public disable() {
        this.alpha = 0.5;
        this.bg.useHandCursor = false;
        this.bg.buttonMode = false;
        this.removeEventListener(MouseEvent.MOUSE_UP, this.handleMouseUp);
    }

    public enable() {
        this.alpha = 1;
        this.bg.useHandCursor = true;
        this.bg.buttonMode = true;
        this.bg.filters = [];
        this.addEventListener(MouseEvent.MOUSE_UP, this.handleMouseUp);
    }

    public highlight(param1: boolean = false) {
        var _loc2_: number = param1 ? 16711680 : 4032711;
        this.bg.filters = [new GlowFilter(_loc2_, 1, 3, 3, 100, 3)];
        this.alpha = 1;
    }

    public clearHighlight() {
        this.alpha = 0.5;
        this.bg.filters = [];
    }

    private handleMouseUp(param1: MouseEvent) {
        if (param1.target == this.bg) {
            this.highlight();
            this.inputText.text = "";
            this.stage.addEventListener(
                KeyboardEvent.KEY_DOWN,
                this.handleKeyDown,
            );
            this.dispatchEvent(new Event(CustomizeKeyInput.FOCUS_IN));
        }
    }

    private handleFocusOut(param1: FocusEvent) {
        trace("handle focus out");
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.handleKeyDown,
        );
        this.removeEventListener(FocusEvent.FOCUS_OUT, this.handleFocusOut);
    }

    private handleKeyDown(param1: KeyboardEvent) {
        this._keyCode = param1.keyCode;
        this.dispatchEvent(
            new ValueEvent(ValueEvent.VALUE_CHANGE, null, this._keyCode),
        );
    }

    public get keyCode(): number {
        return this._keyCode;
    }

    public set keyCode(param1: number) {
        this._keyCode = param1;
    }

    public set text(param1: string) {
        this.bg.filters = [];
        this.inputText.text = param1;
        this.lastInput = param1;
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.handleKeyDown,
        );
        this.dispatchEvent(new Event(CustomizeKeyInput.FOCUS_OUT));
    }

    public die() {
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.handleKeyDown,
        );
        this.removeEventListener(MouseEvent.MOUSE_UP, this.handleMouseUp);
    }
}