import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionAdd from "@/com/totaljerkface/game/editor/actions/ActionAdd";
import ActionProperty from "@/com/totaljerkface/game/editor/actions/ActionProperty";
import AttributeReference from "@/com/totaljerkface/game/editor/AttributeReference";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import HelpWindow from "@/com/totaljerkface/game/editor/HelpWindow";
import PinJoint from "@/com/totaljerkface/game/editor/PinJoint";
import PrisJoint from "@/com/totaljerkface/game/editor/PrisJoint";
import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import { boundClass } from 'autobind-decorator';
import BlendMode from "flash/display/BlendMode";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import Point from "flash/geom/Point";

@boundClass
export default class JointTool extends Tool {
    private static PIN: string;
    private static SLIDE: string = "slide";
    protected pinButton: GenericButton;
    protected slideButton: GenericButton;
    protected snapRange: number = 10;
    protected currentJoint: string;
    protected selectedButton: GenericButton;
    protected cursorShape: RefJoint;
    private inputs: any[];
    private windowWidth: number = 130;
    private indent: number = 5;
    private menuPosX: number = 700;
    private menuPosY: number = 200;
    private lastPin: PinJoint;
    private lastSlide: PrisJoint;
    private helpMessage: string = "<u><b>Joint Tool Help:</b></u><br><br>The joint tool can be used to create different types of joints.  A joint is used to hold two joinable objects together.  Currently, you can create pin and sliding joints.<br><br><u>Pin Joint:</u><br><br>Place a pin joint by clicking the cursor on one or two overlapping joinable objects (such as two non-fixed rectangle shapes).  If only one object is used, the joint will be made between the object and the background itself.<br><br>A pin joint forces 2 bodies to rotate around the specified anchor point.  A good real life example would be a wheel on a car.  The wheel is one body, the car is the other, and the anchor point is the axle where the wheel is connected.<br><br>You can set a limit for the pin joint, so that the angle between the two bodies cannot leave a certain range.<br><br>You can also enable a motor for each joint.  The motor allows you to rotate the pin joint automatically.  You can use this to automate wheels or rotating platforms.  I\'ve given the user a lot of freedom in the possible motor values, so there\'s a large potential for some cool creations as well as some horrible failures.<br><br><u>Sliding Joint:</u><br><br>A sliding joint is created similarly to the pin joint. Sliding joints constrain bodies to a single axis along the plane of the screen. If only one body is used, that body is constrained to the non-moving background. An example of this would be an elevator moving through floors of a static building. If two bodies are used, both bodies can move freely, but relative to each other they are constrained to their local axis. An example of this would be a forklift. The frame is one body, and the lifting fork is the other.<br><br>Limits will constrain the range of this axis. Motors will allow the bodies to move along the axis within the given limits at a chosen speed. The closer the body is to the anchor of the joint, which is where you place the actual joint, the better the joint will function. Bodies very far from the anchor will have a tougher time sticking to the axis, and the lighter the body, the easier it will be to push it off of the axis.";

    constructor(param1: Editor, param2: Canvas) {
        super(param1, param2);
        this.init();
    }

    protected init() {
        this.currentJoint = JointTool.PIN;
        var _loc1_: number = 0;
        var _loc2_: number = 0;
        var _loc3_: number = 5;
        var _loc4_: number = 16613761;
        var _loc5_: number = 120;
        this.pinButton = new GenericButton("Pin Joint", _loc4_, _loc5_);
        this.pinButton.x = _loc3_;
        this.pinButton.y = _loc3_;
        this.addChild(this.pinButton);
        this.slideButton = new GenericButton("Sliding Joint", _loc4_, _loc5_);
        this.addChild(this.slideButton);
        this.slideButton.x = _loc3_;
        this.slideButton.y = this.pinButton.y + this.slideButton.height + 5;
        this.inputs = new Array();
        this.populate(JointTool.PIN);
        this.selectedButton = this.pinButton;
        this.selectedButton.selected = true;
        this.pinButton.addEventListener(MouseEvent.MOUSE_UP, this.jointChosen);
        this.slideButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.jointChosen,
        );
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

    protected mouseMoveHandler(param1: Event = null) {
        var _loc2_: RefShape = null;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        this.cursorShape.x = this._canvas.mouseX;
        this.cursorShape.y = this._canvas.mouseY;
        if (param1.target instanceof RefShape) {
            _loc2_ = param1.target as RefShape;
            if (!_loc2_.immovable) {
                _loc3_ = Math.abs(_loc2_.x - this.cursorShape.x);
                _loc4_ = Math.abs(_loc2_.y - this.cursorShape.y);
                if (_loc3_ < this.snapRange && _loc4_ < this.snapRange) {
                    this.cursorShape.x = _loc2_.x;
                    this.cursorShape.y = _loc2_.y;
                }
            }
        }
    }

    protected mouseDownHandler(param1: MouseEvent) {
        var _loc2_: Sprite = null;
        if (param1.target instanceof Sprite) {
            _loc2_ = param1.target as Sprite;
            if (this._canvas.contains(_loc2_)) {
                this.createNewJoint();
            }
        }
    }

    protected keyDownHandler(param1: KeyboardEvent) { }

    protected jointChosen(param1: Event) {
        var _loc2_: GenericButton = param1.target as GenericButton;
        if (_loc2_ == this.selectedButton) {
            return;
        }
        this.selectedButton.selected = false;
        this.selectedButton = _loc2_;
        this.selectedButton.selected = true;
        if (this.cursorShape instanceof PinJoint) {
            this.lastPin = this.cursorShape.clone() as PinJoint;
        } else if (this.cursorShape instanceof PrisJoint) {
            this.lastSlide = this.cursorShape.clone() as PrisJoint;
        }
        this._canvas.removeChild(this.cursorShape);
        if (_loc2_ == this.pinButton) {
            this.populate(JointTool.PIN);
        } else if (_loc2_ == this.slideButton) {
            this.populate(JointTool.SLIDE);
        }
        this._canvas.addChild(this.cursorShape);
    }

    protected populate(param1: string) {
        var _loc4_: string = null;
        var _loc5_: InputObject = null;
        var _loc6_: number = 0;
        var _loc7_: InputObject = null;
        trace("jointType " + param1);
        this.removeInputs();
        this.currentJoint = param1;
        if (param1 == JointTool.PIN) {
            this.cursorShape = !!this.lastPin
                ? (this.lastPin.clone() as RefJoint)
                : (new PinJoint() as RefJoint);
        } else if (param1 == JointTool.SLIDE) {
            this.cursorShape = !!this.lastSlide
                ? (this.lastSlide.clone() as RefJoint)
                : (new PrisJoint() as RefJoint);
        }
        this.cursorShape.blendMode = BlendMode.INVERT;
        var _loc2_: number = this.height + 10;
        var _loc3_: number = 0;
        while (_loc3_ < this.cursorShape.attributes.length) {
            _loc4_ = this.cursorShape.attributes[_loc3_];
            if (_loc4_ != "x" && _loc4_ != "y") {
                _loc5_ = AttributeReference.buildInput(_loc4_);
                _loc5_.y = _loc2_;
                _loc5_.x = this.indent;
                this.addChild(_loc5_);
                _loc5_.addEventListener(
                    ValueEvent.VALUE_CHANGE,
                    this.inputValueChange,
                );
                this.inputs.push(_loc5_);
                _loc2_ += _loc5_.height;
                if (_loc5_.childInputs) {
                    _loc6_ = 0;
                    while (_loc6_ < _loc5_.childInputs.length) {
                        _loc7_ = _loc5_.childInputs[_loc6_];
                        _loc7_.y = _loc2_;
                        _loc7_.x = this.indent;
                        this.addChild(_loc7_);
                        _loc2_ += _loc7_.height;
                        _loc6_++;
                    }
                }
                this.updateInput(_loc5_);
            }
            _loc3_++;
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

    protected createNewJoint() {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc4_: Point = null;
        this._canvas.addRefSprite(this.cursorShape);
        this.cursorShape.blendMode = BlendMode.NORMAL;
        this.cursorShape.identifyBodies();
        if (this.cursorShape.body1) {
            _loc2_ = new ActionAdd(
                this.cursorShape,
                this._canvas,
                this._canvas.joints.getChildIndex(this.cursorShape),
            );
            _loc3_ = _loc2_;
            _loc4_ = new Point(this.cursorShape.x, this.cursorShape.y);
            _loc2_ = new ActionProperty(
                this.cursorShape,
                "body1",
                null,
                this.cursorShape.body1,
                _loc4_,
                _loc4_,
            );
            _loc3_.nextAction = _loc2_;
            _loc3_ = _loc2_;
            if (this.cursorShape.body2) {
                _loc2_ = new ActionProperty(
                    this.cursorShape,
                    "body2",
                    null,
                    this.cursorShape.body2,
                    _loc4_,
                    _loc4_,
                );
                _loc3_.nextAction = _loc2_;
            }
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
        }
        var _loc1_: RefJoint = this.cursorShape.clone() as RefJoint;
        this.cursorShape = _loc1_;
        this.cursorShape.blendMode = BlendMode.INVERT;
        this._canvas.addChild(this.cursorShape);
        this.cursorShape.x = this._canvas.mouseX;
        this.cursorShape.y = this._canvas.mouseY;
    }

    public override die() {
        super.die();
        this.pinButton.addEventListener(MouseEvent.MOUSE_UP, this.jointChosen);
        this.slideButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.jointChosen,
        );
    }
}