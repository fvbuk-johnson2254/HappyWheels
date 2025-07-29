import Settings from "@/com/totaljerkface/game/Settings";
import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import AttributeReference from "@/com/totaljerkface/game/editor/AttributeReference";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import HelpWindow from "@/com/totaljerkface/game/editor/HelpWindow";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionAdd from "@/com/totaljerkface/game/editor/actions/ActionAdd";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import MenuItem from "@/com/totaljerkface/game/editor/ui/MenuItem";
import SpecialMenu from "@/com/totaljerkface/game/editor/ui/SpecialMenu";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import { boundClass } from 'autobind-decorator';
import BlendMode from "flash/display/BlendMode";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class SpecialTool extends Tool {
    private menu: SpecialMenu;
    private menuWindow: Window;
    private menuItems: any[];
    private cursorShape: Special;
    private currentType: string;
    private inputs: any[];
    private windowWidth: number = 130;
    private indent: number = 5;
    private menuPosX: number = 700;
    private menuPosY: number = 200;
    private helpMessage: string = "<u><b>Special Tool Help:</b></u><br><br>The special tool allows you to create new special objects on stage.  Choose your special object from the list on the right.  Set parameters of the object before placing.  Some of the simpler special items can be grouped or used in joints.  You <b>must</b> place a finish line if you\'d like users to be able to complete your level.<br><br><u>Keyboard Shortcuts:</u><br><br><b>a,w,s,d</b>: Resize the height and width of the current object (if possible).  Hold <b>shift</b> to resize faster.<br><br><b>z,x</b>: Rotate the current object (if possible).  Hold <b>shift</b> to rotate faster.";

    constructor(param1: Editor, param2: Canvas) {
        super(param1, param2);
        this.init();
    }

    private init() {
        this.inputs = new Array();
        this.menu = new SpecialMenu();
        this.populate("IBeamRef");
    }

    public override activate() {
        super.activate();
        HelpWindow.instance.populate(this.helpMessage);
        this.window.setDimensions(this.windowWidth, this.height + 5);
        this.menuWindow = new Window(false, this.menu);
        this.menuWindow.x = 900 - (this.menuWindow.width + 20);
        this.menuWindow.y = 500 - (this.menuWindow.height + 20);
        trace(this.menuWindow.x + " " + this.menuWindow.y);
        this._canvas.parent.parent.addChild(this.menuWindow);
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
        this.menu.addEventListener(
            SpecialMenu.SPECIAL_CHOSEN,
            this.specialChosen,
        );
    }

    public override deactivate() {
        this.menuPosX = this.menuWindow.x;
        this.menuPosY = this.menuWindow.y;
        this.menuWindow.closeWindow();
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
        this.menu.removeEventListener(
            SpecialMenu.SPECIAL_CHOSEN,
            this.specialChosen,
        );
        super.deactivate();
    }

    protected mouseMoveHandler(param1: Event) {
        this.cursorShape.x = this._canvas.mouseX;
        this.cursorShape.y = this._canvas.mouseY;
        this.cursorShape.mouseChildren = false;
    }

    protected specialChosen(param1: Event) {
        this.populate(this.menu.selectedClassName);
        this._canvas.addChild(this.cursorShape);
    }

    protected populate(param1: string) {
        var _loc5_: string = null;
        var _loc6_: InputObject = null;
        var _loc7_: number = 0;
        var _loc8_: InputObject = null;
        trace("specialtype " + param1);
        this.removeInputs();
        var _loc2_ = getDefinitionByName(Settings.specialClassPath + param1);
        if (this.cursorShape) {
            this._canvas.removeChild(this.cursorShape);
            this.cursorShape = null;
        }
        // @ts-expect-error
        this.cursorShape = new _loc2_();
        this.cursorShape.blendMode = BlendMode.INVERT;
        var _loc3_: number = 0;
        var _loc4_: number = 0;
        while (_loc4_ < this.cursorShape.attributes.length) {
            _loc5_ = this.cursorShape.attributes[_loc4_];
            if (_loc5_ != "x" && _loc5_ != "y") {
                _loc6_ = AttributeReference.buildInput(_loc5_);
                _loc6_.y = _loc3_;
                _loc6_.x = this.indent;
                this.addChild(_loc6_);
                _loc6_.addEventListener(
                    ValueEvent.VALUE_CHANGE,
                    this.inputValueChange,
                );
                this.inputs.push(_loc6_);
                _loc3_ += _loc6_.height;
                if (_loc6_.childInputs) {
                    _loc7_ = 0;
                    while (_loc7_ < _loc6_.childInputs.length) {
                        _loc8_ = _loc6_.childInputs[_loc7_];
                        _loc8_.y = _loc3_;
                        _loc8_.x = this.indent;
                        this.addChild(_loc8_);
                        _loc3_ += _loc8_.height;
                        _loc7_++;
                    }
                }
                this.updateInput(_loc6_);
            }
            _loc4_++;
        }
        if (this.window) {
            this.window.setDimensions(this.windowWidth, this.height + 5);
        }
    }

    private removeInputs() {
        var _loc2_: InputObject = null;
        var _loc3_: number = 0;
        var _loc4_: InputObject = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.inputs.length) {
            _loc2_ = this.inputs[_loc1_];
            _loc3_ = 0;
            while (_loc3_ < _loc2_.childInputs.length) {
                _loc4_ = _loc2_.childInputs[_loc3_];
                this.removeChild(_loc4_);
                _loc3_++;
            }
            _loc2_.removeEventListener(
                ValueEvent.VALUE_CHANGE,
                this.inputValueChange,
            );
            _loc2_.die();
            this.removeChild(_loc2_);
            _loc1_++;
        }
        this.inputs = new Array();
    }

    private inputValueChange(param1: ValueEvent) {
        var _loc2_: InputObject = param1.inputObject;
        var _loc3_: string = _loc2_.attribute;
        this.cursorShape[_loc3_] = param1.value;
        this.updateInput(_loc2_);
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
        var _loc3_: MenuItem = null;
        if (param1.target instanceof Sprite) {
            _loc2_ = param1.target as Sprite;
            if (_loc2_ == this._canvas || _loc2_.parent == this._canvas) {
                this.createNewShape();
            }
        }
        if (param1.target instanceof MenuItem) {
            _loc3_ = param1.target as MenuItem;
            // @ts-expect-error
            this.populate(_loc3_.classType);
            this._canvas.addChild(this.cursorShape);
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
        var _loc1_: Special = this.cursorShape.clone() as Special;
        this._canvas.addRefSprite(_loc1_);
        var _loc2_: Action = new ActionAdd(
            _loc1_,
            this._canvas,
            this._canvas.special.getChildIndex(_loc1_),
        );
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
    }

    public override die() {
        this.menu.die();
        super.die();
    }
}