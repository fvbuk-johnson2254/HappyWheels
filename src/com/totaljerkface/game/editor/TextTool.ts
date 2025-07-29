import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionAdd from "@/com/totaljerkface/game/editor/actions/ActionAdd";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import HelpWindow from "@/com/totaljerkface/game/editor/HelpWindow";
import TextBoxRef from "@/com/totaljerkface/game/editor/specials/TextBoxRef";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import ColorInput from "@/com/totaljerkface/game/editor/ui/ColorInput";
import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import SliderInput from "@/com/totaljerkface/game/editor/ui/SliderInput";
import TextInput from "@/com/totaljerkface/game/editor/ui/TextInput";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import { boundClass } from 'autobind-decorator';
import BlendMode from "flash/display/BlendMode";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class TextTool extends Tool {
    protected rotationInput: TextInput;
    protected colorInput: ColorInput;
    protected fontInput: SliderInput;
    protected sizeInput: SliderInput;
    protected alignInput: SliderInput;
    protected cursorShape: TextBoxRef;
    private helpMessage: string = "<u><b>Text Tool Help:</b></u><br><br>Make some text.<br><br>Once placing text, type to enter your message.  Using the selection tool, you can double click on a previously placed text box to edit what you\'ve typed.<br><br>If you\'d like your text to move around, you can group it with other groupable objects.";

    constructor(param1: Editor, param2: Canvas) {
        super(param1, param2);
        this.init();
    }

    protected init() {
        this.createCursor();
        var _loc1_: number = 5;
        this.rotationInput = new TextInput("rotation", "angle", 5, true);
        this.rotationInput.restrict = "0-9\\-";
        this.rotationInput.x = _loc1_;
        this.rotationInput.y = 0;
        this.addChild(this.rotationInput);
        this.colorInput = new ColorInput("color", "color", true);
        this.colorInput.y =
            this.rotationInput.y + Math.ceil(this.rotationInput.height);
        this.colorInput.x = _loc1_;
        this.addChild(this.colorInput);
        this.fontInput = new SliderInput("font", "font", 1, true, 1, 5, 4);
        this.fontInput.y =
            this.colorInput.y + Math.ceil(this.colorInput.height);
        this.fontInput.x = _loc1_;
        this.addChild(this.fontInput);
        this.sizeInput = new SliderInput(
            "font size",
            "fontSize",
            3,
            true,
            10,
            100,
            90,
        );
        this.sizeInput.y = this.fontInput.y + Math.ceil(this.fontInput.height);
        this.sizeInput.x = _loc1_;
        this.addChild(this.sizeInput);
        this.alignInput = new SliderInput(
            "alignment",
            "align",
            1,
            true,
            1,
            3,
            2,
        );
        this.alignInput.y = this.sizeInput.y + Math.ceil(this.sizeInput.height);
        this.alignInput.x = _loc1_;
        this.addChild(this.alignInput);
        this.rotationInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.colorInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.fontInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.sizeInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.alignInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.updateInputs();
    }

    protected createCursor() {
        this.cursorShape = new TextBoxRef();
        this.cursorShape.blendMode = BlendMode.INVERT;
    }

    public override activate() {
        super.activate();
        HelpWindow.instance.populate(this.helpMessage);
        this.window.setDimensions(130, 180);
        this._canvas.addChild(this.cursorShape);
        this.stage.addEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveHandler,
        );
        this.stage.addEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.stage.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
    }

    public override deactivate() {
        this._canvas.removeChild(this.cursorShape);
        this.colorInput.closeColorSelector();
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        super.deactivate();
    }

    protected mouseMoveHandler(param1: Event = null) {
        this.cursorShape.x = this._canvas.mouseX;
        this.cursorShape.y = this._canvas.mouseY;
    }

    protected mouseDownHandler(param1: MouseEvent) {
        var _loc2_: Sprite = null;
        if (param1.target instanceof Sprite) {
            _loc2_ = param1.target as Sprite;
            if (_loc2_ == this._canvas || _loc2_.parent == this._canvas) {
                this.createNewTextBox();
            }
        }
    }

    protected keyDownHandler(param1: KeyboardEvent) {
        switch (param1.keyCode) {
            case 90:
                if (!param1.ctrlKey) {
                    this.adjustRotation(-1, param1.shiftKey);
                }
                break;
            case 88:
                this.adjustRotation(1, param1.shiftKey);
        }
    }

    protected adjustRotation(param1: number, param2: boolean) {
        if (!this.cursorShape.rotatable) {
            return;
        }
        if (param2) {
            param1 *= 10;
        }
        this.cursorShape.angle += param1;
        this.updateInputs();
    }

    protected updateInputs() {
        this.rotationInput.setValue(this.cursorShape.angle);
        this.colorInput.setValue(this.cursorShape.color);
        this.fontInput.setValue(this.cursorShape.font);
        this.sizeInput.setValue(this.cursorShape.fontSize);
        this.alignInput.setValue(this.cursorShape.align);
    }

    protected createNewTextBox() {
        var _loc1_: TextBoxRef = this.cursorShape.clone() as TextBoxRef;
        this.canvas.addRefSprite(_loc1_);
        var _loc2_: Action = new ActionAdd(
            _loc1_,
            this.canvas,
            this.canvas.special.getChildIndex(_loc1_),
        );
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
    }

    protected inputValueChange(param1: ValueEvent) {
        trace("INPUT VALUE CHANGE");
        var _loc2_: InputObject = param1.inputObject;
        var _loc3_: string = _loc2_.attribute;
        trace("property " + _loc3_);
        trace(param1.value);
        this.cursorShape[_loc3_] = param1.value;
        this.updateInputs();
    }

    public override die() {
        super.die();
        this.colorInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.fontInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.sizeInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.alignInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.colorInput.die();
        this.fontInput.die();
        this.sizeInput.die();
        this.alignInput.die();
    }
}