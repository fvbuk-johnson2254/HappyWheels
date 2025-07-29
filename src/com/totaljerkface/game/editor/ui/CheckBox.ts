import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";

/* [Embed(source="/_assets/assets.swf", symbol="symbol822")] */
@boundClass
export default class CheckBox extends InputObject {
    public labelText: TextField;
    public box: Sprite;
    public check: Sprite;
    public dash: Sprite;
    private _selected: boolean;
    public oppositeDependent: boolean;

    constructor(
        param1: string,
        param2: string,
        param3: boolean = true,
        param4: boolean = true,
        param5: boolean = false,
        param6: {} = null,
    ) {
        super();
        this.labelText.text = param1;
        if (param6) {
            this.labelText.textColor = uint(param6);
        }
        this.attribute = param2;
        this.childInputs = new Array();
        this._editable = true;
        this.selected = param3;
        this.editable = param4;
        this.oppositeDependent = param5;
        this.init();
    }

    public addChildInput(param1: InputObject) {
        this.childInputs.push(param1);
        if (!this._selected) {
            param1.editable = this.oppositeDependent;
        }
        if (this._selected) {
            param1.editable = !this.oppositeDependent;
        }
        param1.addEventListener(ValueEvent.VALUE_CHANGE, this.childValueChange);
    }

    private init() {
        this.labelText.mouseEnabled = false;
        this.check.mouseEnabled = false;
        this.dash.mouseEnabled = false;
        this.labelText.autoSize = TextFieldAutoSize.LEFT;
        this.labelText.wordWrap = false;
        this.box.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
    }

    private mouseDownHandler(param1: MouseEvent) {
        if (this.selected == false) {
            this.selected = true;
        } else {
            this.selected = false;
        }
        this.dispatchEvent(
            new ValueEvent(ValueEvent.VALUE_CHANGE, this, this._selected),
        );
    }

    private childValueChange(param1: ValueEvent) {
        this.dispatchEvent(param1.clone());
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(param1: boolean) {
        var _loc2_: number = 0;
        var _loc3_: InputObject = null;
        if (!this._editable) {
            return;
        }
        this._selected = param1;
        this._ambiguous = false;
        this.dash.visible = false;
        if (this._selected) {
            this.check.visible = true;
            _loc2_ = 0;
            while (_loc2_ < this.childInputs.length) {
                _loc3_ = this.childInputs[_loc2_];
                _loc3_.editable = !this.oppositeDependent;
                _loc2_++;
            }
        } else {
            this.check.visible = false;
            _loc2_ = 0;
            while (_loc2_ < this.childInputs.length) {
                _loc3_ = this.childInputs[_loc2_];
                _loc3_.editable = this.oppositeDependent;
                _loc2_++;
            }
        }
    }

    public override set editable(param1: boolean) {
        this._editable = param1;
        if (param1) {
            this.alpha = 1;
            this.mouseEnabled = true;
            this.dash.visible = false;
            if (this._selected) {
                this.check.visible = true;
            }
        } else {
            this.alpha = 0.5;
            this.mouseEnabled = false;
            this.dash.visible = true;
            this.check.visible = false;
        }
    }

    public override setToAmbiguous() {
        var _loc2_: InputObject = null;
        this.dash.visible = true;
        this.check.visible = false;
        this._selected = false;
        this._ambiguous = true;
        var _loc1_: number = 0;
        while (_loc1_ < this.childInputs.length) {
            _loc2_ = this.childInputs[_loc1_];
            _loc2_.editable = false;
            _loc1_++;
        }
    }

    public override setValue(param1) {
        this.selected = param1;
    }

    public override die() {
        var _loc2_: InputObject = null;
        super.die();
        this.box.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        var _loc1_: number = 0;
        while (_loc1_ < this.childInputs.length) {
            _loc2_ = this.childInputs[_loc1_];
            _loc2_.removeEventListener(
                ValueEvent.VALUE_CHANGE,
                this.childValueChange,
            );
            _loc2_.die();
            _loc1_++;
        }
        this.childInputs = new Array();
    }
}