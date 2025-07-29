import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import KeyboardEvent from "flash/events/KeyboardEvent";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFieldType from "flash/text/TextFieldType";
import TextFormat from "flash/text/TextFormat";

/* [Embed(source="/_assets/assets.swf", symbol="symbol722")] */
@boundClass
export default class TextInput extends InputObject {
    public labelText: TextField;
    public inputText: TextField;
    public bg: Sprite;
    protected spacing: number;
    protected readOnly: boolean;
    protected currentString: string;

    constructor(
        param1: string,
        param2: string,
        param3: number,
        param4: boolean,
        param5: boolean = false,
        param6: number = 10,
        param7: number = 60,
    ) {
        super();
        this.labelText.text = param1 + ":";
        this.attribute = param2;
        this.currentString = "";
        this.childInputs = new Array();
        this.inputText.maxChars = param3;
        this.inputText.width = param7;
        this.spacing = param6;
        this.readOnly = param5;
        this.editable = param4;
        this.init();
    }

    protected init() {
        var _loc1_: TextFormat = null;
        this.labelText.mouseEnabled = false;
        this.inputText.x =
            this.labelText.x + this.labelText.textWidth + this.spacing;
        this.inputText.wordWrap = this.labelText.wordWrap = false;
        this.inputText.autoSize = this.labelText.autoSize =
            TextFieldAutoSize.LEFT;
        if (this.readOnly) {
            _loc1_ = this.inputText.defaultTextFormat;
            _loc1_.color = 16777215;
            this.inputText.defaultTextFormat = _loc1_;
            this.inputText.selectable = false;
            this.inputText.mouseEnabled = false;
        } else {
            this.inputText.addEventListener(
                KeyboardEvent.KEY_DOWN,
                this.keyDownHandler,
            );
        }
    }

    protected keyDownHandler(param1: KeyboardEvent) {
        if (param1.keyCode == 13) {
            this.currentString = this.inputText.text;
            this.stage.focus = this.stage;
            this.dispatchEvent(
                new ValueEvent(
                    ValueEvent.VALUE_CHANGE,
                    this,
                    this.currentString,
                ),
            );
        } else if (param1.keyCode == 9 && !this._ambiguous) {
            this.currentString = this.inputText.text;
            this.dispatchEvent(
                new ValueEvent(
                    ValueEvent.VALUE_CHANGE,
                    this,
                    this.currentString,
                ),
            );
        }
    }

    public get text(): string {
        return this.inputText.text;
    }

    public set text(param1: string) {
        if (!this._editable) {
            this.currentString = param1;
            this.inputText.text = "-";
            return;
        }
        this.inputText.text = param1;
        this._ambiguous = false;
    }

    public set restrict(param1: string) {
        this.inputText.restrict = param1;
    }

    protected adjustBg() {
        this.bg.width = this.inputText.width;
    }

    public set maxChars(param1: number) {
        this.inputText.maxChars = param1;
    }

    public override set editable(param1: boolean) {
        this._editable = param1;
        if (param1) {
            this.alpha = 1;
            this.inputText.text = this.currentString;
            this.inputText.defaultTextFormat.color = 13260;
            this.inputText.type = TextFieldType.INPUT;
            this.inputText.tabEnabled = true;
            this.inputText.mouseEnabled = true;
        } else {
            this.alpha = 0.5;
            this.inputText.text = "-";
            this.inputText.defaultTextFormat.color = 0;
            this.inputText.type = TextFieldType.DYNAMIC;
            this.inputText.tabEnabled = false;
            this.inputText.mouseEnabled = false;
        }
    }

    public override setToAmbiguous() {
        this.inputText.text = "-";
        this._ambiguous = true;
    }

    public override setValue(param1) {
        this.text = param1;
    }

    public override die() {
        super.die();
        this.inputText.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
    }
}