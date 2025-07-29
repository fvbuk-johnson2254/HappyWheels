import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionAdd from "@/com/totaljerkface/game/editor/actions/ActionAdd";
import AttributeReference from "@/com/totaljerkface/game/editor/AttributeReference";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import HelpWindow from "@/com/totaljerkface/game/editor/HelpWindow";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import { boundClass } from 'autobind-decorator';
import BlendMode from "flash/display/BlendMode";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class TriggerTool extends Tool {
    private cursorShape: RefTrigger;
    private inputs: any[];
    private windowWidth: number = 130;
    private indent: number = 5;
    private helpMessage: string = "<u><b>Trigger Tool Help:</b></u><br><br>The trigger tool allows you to trigger certain actions during gameplay. When the player passes through the defined shape, the selected action will occur.<br><br>If activate object is selected, you must attach the trigger to the desired object, similarly to a joint. Many times this is just waking a sleeping object, but that will be expanded in the future. Mines for example will explode when activated. Boosts and fans will turn on.<br><br>Sound effects can also be triggered. Currently you only have use of the sounds currently used in the game.<br><br>I plan on expanding this tool with ambient sounds and additional options next week (setting it up was a time-consuming pain in the ass).<br><br><u>Keyboard Shortcuts:</u><br><br><b>a,w,s,d</b>: Resize the height and width of the trigger.  Hold <b>shift</b> to resize faster.<br><br><b>z,x</b>: Rotate the trigger. Hold <b>shift</b> to rotate faster.";

    constructor(param1: Editor, param2: Canvas) {
        super(param1, param2);
        this.init();
    }

    private init() {
        this.inputs = new Array();
        this.cursorShape = new RefTrigger();
        this.cursorShape.blendMode = BlendMode.INVERT;
        this.populate();
    }

    public override activate() {
        super.activate();
        HelpWindow.instance.populate(this.helpMessage);
        this.window.setDimensions(this.windowWidth, this.height + 5);
        this._canvas.addChild(this.cursorShape);
        this.stage.addEventListener(Event.ENTER_FRAME, this.mouseMoveHandler);
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
        this.stage.removeEventListener(
            Event.ENTER_FRAME,
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

    protected mouseMoveHandler(param1: Event) {
        this.cursorShape.x = this._canvas.mouseX;
        this.cursorShape.y = this._canvas.mouseY;
        this.cursorShape.mouseChildren = false;
    }

    protected populate() {
        var _loc1_: number = 0;
        var _loc3_: string = null;
        var _loc4_: InputObject = null;
        var _loc5_: number = 0;
        var _loc6_: InputObject = null;
        this.removeInputs();
        _loc1_ = 0;
        var _loc2_ = int(this.inputs.length);
        while (_loc2_ < this.cursorShape.attributes.length) {
            _loc3_ = this.cursorShape.attributes[_loc2_];
            if (_loc3_ != "x" && _loc3_ != "y") {
                _loc4_ = AttributeReference.buildInput(_loc3_);
                _loc4_.y = _loc1_;
                _loc4_.x = this.indent;
                this.addChild(_loc4_);
                _loc4_.addEventListener(
                    ValueEvent.VALUE_CHANGE,
                    this.inputValueChange,
                );
                this.inputs.push(_loc4_);
                _loc1_ += _loc4_.height;
                if (_loc4_.childInputs) {
                    _loc5_ = 0;
                    while (_loc5_ < _loc4_.childInputs.length) {
                        _loc6_ = _loc4_.childInputs[_loc5_];
                        _loc6_.y = _loc1_;
                        _loc6_.x = this.indent;
                        this.addChild(_loc6_);
                        _loc1_ += _loc6_.height;
                        _loc5_++;
                    }
                }
                this.updateInput(_loc4_);
            }
            _loc2_++;
        }
        if (this.window) {
            this.window.setDimensions(this.windowWidth, this.height + 5);
        }
    }

    private removeInputs(param1: number = 0) {
        var _loc3_: InputObject = null;
        var _loc4_: number = 0;
        var _loc5_: InputObject = null;
        var _loc2_: number = param1;
        while (_loc2_ < this.inputs.length) {
            _loc3_ = this.inputs[_loc2_];
            _loc4_ = 0;
            while (_loc4_ < _loc3_.childInputs.length) {
                _loc5_ = _loc3_.childInputs[_loc4_];
                this.removeChild(_loc5_);
                _loc4_++;
            }
            _loc3_.removeEventListener(
                ValueEvent.VALUE_CHANGE,
                this.inputValueChange,
            );
            _loc3_.die();
            this.removeChild(_loc3_);
            this.inputs.splice(_loc2_, 1);
            _loc2_--;
            _loc2_++;
        }
    }

    private inputValueChange(param1: ValueEvent) {
        var _loc4_: number = 0;
        var _loc2_: InputObject = param1.inputObject;
        var _loc3_: string = _loc2_.attribute;
        this.cursorShape[_loc3_] = param1.value;
        this.updateInput(_loc2_);
        if (_loc3_ == "triggerType") {
            _loc4_ = int(this.inputs.indexOf(_loc2_));
            this.removeInputs(_loc4_ + 1);
            this.populate();
        }
    }

    private updateInputValues() {
        var _loc2_: InputObject = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.inputs.length) {
            _loc2_ = this.inputs[_loc1_] as InputObject;
            this.updateInput(_loc2_);
            _loc1_++;
        }
    }

    private updateInput(param1: InputObject) {
        var _loc5_: InputObject = null;
        var _loc2_: string = param1.attribute;
        var _loc3_ = this.cursorShape[_loc2_];
        param1.setValue(_loc3_);
        var _loc4_: number = 0;
        while (_loc4_ < param1.childInputs.length) {
            _loc5_ = param1.childInputs[_loc4_];
            this.updateInput(_loc5_);
            _loc4_++;
        }
    }

    protected mouseDownHandler(param1: MouseEvent) {
        var _loc2_: Sprite = null;
        if (param1.target instanceof Sprite) {
            _loc2_ = param1.target as Sprite;
            if (_loc2_ == this._canvas || _loc2_.parent == this._canvas) {
                this.createNewShape();
            }
        }
    }

    protected keyDownHandler(param1: KeyboardEvent) {
        switch (param1.keyCode) {
            case 65:
                this.adjustScale(-1, 0, param1.shiftKey);
                break;
            case 87:
                this.adjustScale(0, 1, param1.shiftKey);
                break;
            case 68:
                this.adjustScale(1, 0, param1.shiftKey);
                break;
            case 83:
                this.adjustScale(0, -1, param1.shiftKey);
                break;
            case 90:
                if (!param1.ctrlKey) {
                    this.adjustRotation(-1, param1.shiftKey);
                }
                break;
            case 88:
                this.adjustRotation(1, param1.shiftKey);
        }
    }

    protected adjustScale(param1: number, param2: number, param3: boolean) {
        if (!this.cursorShape.scalable) {
            return;
        }
        if (param3) {
            param1 *= 10;
            param2 *= 10;
        }
        this.cursorShape.shapeWidth += param1;
        this.cursorShape.shapeHeight += param2;
        this.updateInputValues();
    }

    protected adjustRotation(param1: number, param2: boolean) {
        if (!this.cursorShape.rotatable) {
            return;
        }
        if (param2) {
            param1 *= 10;
        }
        this.cursorShape.angle += param1;
        this.updateInputValues();
    }

    protected createNewShape() {
        var _loc1_: RefTrigger = this.cursorShape.clone() as RefTrigger;
        this._canvas.addRefSprite(_loc1_);
        this._canvas.relabelTriggers();
        var _loc2_: Action = new ActionAdd(
            _loc1_,
            this._canvas,
            this._canvas.triggers.getChildIndex(_loc1_),
        );
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
    }

    public override die() {
        super.die();
    }
}