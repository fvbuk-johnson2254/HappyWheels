import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionAdd from "@/com/totaljerkface/game/editor/actions/ActionAdd";
import AttributeReference from "@/com/totaljerkface/game/editor/AttributeReference";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import CircleShape from "@/com/totaljerkface/game/editor/CircleShape";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import HelpWindow from "@/com/totaljerkface/game/editor/HelpWindow";
import RectangleShape from "@/com/totaljerkface/game/editor/RectangleShape";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import TriangleShape from "@/com/totaljerkface/game/editor/TriangleShape";
import CheckBox from "@/com/totaljerkface/game/editor/ui/CheckBox";
import ColorInput from "@/com/totaljerkface/game/editor/ui/ColorInput";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
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
import TextField from "flash/text/TextField";

@boundClass
export default class ShapeTool extends Tool {
    private static RECTANGLE: string;
    private static CIRCLE: string = "circle";
    private static TRIANGLE: string = "triangle";
    protected rectButton: GenericButton;
    protected circleButton: GenericButton;
    protected triButton: GenericButton;
    protected _selectedButton: GenericButton;
    protected widthInput: TextInput;
    protected heightInput: TextInput;
    protected rotationInput: TextInput;
    protected densityInput: TextInput;
    protected colorInput: ColorInput;
    protected outlineColorInput: ColorInput;
    protected opacityInput: SliderInput;
    protected innerCutoutInput: SliderInput;
    protected collisionInput: SliderInput;
    protected inputs: any[];
    protected interactiveCheck: CheckBox;
    protected immovableCheck: CheckBox;
    protected asleepCheck: CheckBox;
    protected minDimension: number = 0.1;
    protected maxDimension: number = 50;
    protected cursorShape: RefShape;
    protected currentDensity: number = 1;
    protected _innerCutout: number = 0;
    protected maxDensity: number = 100;
    protected minDensity: number = 0.1;
    private currentShape: string;
    private lastRectangle: RectangleShape;
    private lastCircle: CircleShape;
    private lastTriangle: TriangleShape;
    private helpMessage: string = "<u><b>Shape Tool Help:</b></u><br><br>The shape tool works like a stamp and allows you to create new shapes on stage.  Select the type and parameters of the shape you\'d like before placing.<br><br><u>Keyboard Shortcuts:</u><br><br><b>a,w,s,d</b>: Resize the height and width of the current shape.  Hold <b>shift</b> to resize faster.<br><br><b>z,x</b>: Rotate the current shape.  Hold <b>shift</b> to rotate faster.";

    constructor(param1: Editor, param2: Canvas) {
        super(param1, param2);
        this.init();
    }

    protected init() {
        var _loc4_: number = 0;
        var _loc5_: number = NaN;
        this.currentShape = ShapeTool.RECTANGLE;
        this.createCursor();
        var _loc1_: number = 0;
        var _loc2_: number = 0;
        var _loc3_: number = 5;
        _loc4_ = 16613761;
        _loc5_ = 120;
        this.rectButton = new GenericButton("Rectangle Shape", _loc4_, _loc5_);
        this.rectButton.x = _loc3_;
        this.rectButton.y = _loc3_;
        this.addChild(this.rectButton);
        this.circleButton = new GenericButton("Circle Shape", _loc4_, _loc5_);
        this.addChild(this.circleButton);
        this.circleButton.x = _loc3_;
        this.circleButton.y = this.rectButton.y + this.rectButton.height + 5;
        this.triButton = new GenericButton("Triangle Shape", _loc4_, _loc5_);
        this.addChild(this.triButton);
        this.triButton.x = _loc3_;
        this.triButton.y = this.circleButton.y + this.circleButton.height + 5;
        this.widthInput = new TextInput("width", "shapeWidth", 7, true);
        this.widthInput.restrict = "0-9.";
        this.addChild(this.widthInput);
        this.widthInput.x = _loc3_;
        this.widthInput.y = this.triButton.y + this.triButton.height + 5;
        this.heightInput = new TextInput("height", "shapeHeight", 7, true);
        this.heightInput.restrict = "0-9.";
        this.heightInput.x = _loc3_;
        this.heightInput.y =
            this.widthInput.y + Math.ceil(this.widthInput.height);
        this.addChild(this.heightInput);
        this.rotationInput = new TextInput("rotation", "angle", 5, true);
        this.rotationInput.restrict = "0-9\\-";
        this.rotationInput.x = _loc3_;
        this.rotationInput.y =
            this.heightInput.y + Math.ceil(this.heightInput.height);
        this.addChild(this.rotationInput);
        this.colorInput = new ColorInput("shape color", "color", true, true);
        this.colorInput.x = _loc3_;
        this.colorInput.y =
            this.rotationInput.y + Math.ceil(this.rotationInput.height);
        this.addChild(this.colorInput);
        this.outlineColorInput = new ColorInput(
            "outline color",
            "outlineColor",
            true,
            true,
        );
        this.outlineColorInput.x = _loc3_;
        this.outlineColorInput.y =
            this.colorInput.y + Math.ceil(this.colorInput.height);
        this.addChild(this.outlineColorInput);
        this.opacityInput = new SliderInput(
            "opacity",
            "opacity",
            3,
            true,
            0,
            100,
            100,
        );
        this.opacityInput.restrict = "0-9";
        this.opacityInput.helpCaption = "Transparent shapes are more cpu intensive than opaque shapes, so use transparency sparingly.  Best performance is at 100 or 0.";
        this.opacityInput.x = _loc3_;
        this.opacityInput.y =
            this.outlineColorInput.y + Math.ceil(this.outlineColorInput.height);
        this.addChild(this.opacityInput);
        this.interactiveCheck = new CheckBox("interactive", "interactive");
        this.interactiveCheck.y =
            this.opacityInput.y + Math.ceil(this.opacityInput.height);
        this.interactiveCheck.x = _loc3_;
        this.interactiveCheck.helpCaption = "Setting interactive to false will treat the shape like flat artwork.  The shape will only move if part of a group, and will not take away from the total available shapecount allowed in your level.  Useful when just adding visual detail to already interactive larger shapes or groups.";
        this.addChild(this.interactiveCheck);
        this.immovableCheck = new CheckBox(
            "fixed",
            "immovable",
            true,
            true,
            true,
        );
        this.immovableCheck.y =
            this.interactiveCheck.y + Math.ceil(this.interactiveCheck.height);
        this.immovableCheck.x = _loc3_;
        this.immovableCheck.helpCaption = "A fixed object will never move and will support any weight.";
        this.addChild(this.immovableCheck);
        this.asleepCheck = new CheckBox("sleeping", "sleeping", false, false);
        this.asleepCheck.y =
            this.immovableCheck.y + Math.ceil(this.immovableCheck.height);
        this.asleepCheck.x = _loc3_;
        this.asleepCheck.helpCaption = "A sleeping object will remain frozen in place until it is touched by any other moving object.";
        this.addChild(this.asleepCheck);
        this.densityInput = new TextInput("density", "density", 4, true);
        this.densityInput.restrict = "0-9.";
        this.densityInput.x = _loc3_;
        this.densityInput.y =
            this.asleepCheck.y + Math.ceil(this.asleepCheck.height);
        this.densityInput.helpCaption = "The mass per volume of an object.  The bodies of human characters in this game are set to a density of 1.";
        this.addChild(this.densityInput);
        this.immovableCheck.addChildInput(this.asleepCheck);
        this.immovableCheck.addChildInput(this.densityInput);
        this.collisionInput = AttributeReference.buildInput(
            "collision",
        ) as SliderInput;
        this.collisionInput.x = _loc3_;
        this.collisionInput.y =
            this.densityInput.y + Math.ceil(this.densityInput.height);
        this.addChild(this.collisionInput);
        this.innerCutoutInput = new SliderInput(
            "inner cutout",
            "innerCutout",
            3,
            true,
            0,
            100,
            100,
        );
        this.innerCutoutInput.restrict = "0-9";
        this.innerCutoutInput.helpCaption = "";
        this.innerCutoutInput.x = _loc3_;
        this.innerCutoutInput.y =
            this.collisionInput.y + Math.ceil(this.collisionInput.height);
        this.rectButton.addEventListener(MouseEvent.MOUSE_UP, this.shapeChosen);
        this.circleButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.shapeChosen,
        );
        this.triButton.addEventListener(MouseEvent.MOUSE_UP, this.shapeChosen);
        this.widthInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.heightInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.rotationInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.immovableCheck.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.colorInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.outlineColorInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.opacityInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.innerCutoutInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.collisionInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.interactiveCheck.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.interactiveChange,
        );
        this._selectedButton = this.rectButton;
        this.rectButton.selected = true;
        this.updateTextFields();
    }

    protected createCursor() {
        if (this.cursorShape) {
            this._canvas.removeChild(this.cursorShape);
        }
        switch (this.currentShape) {
            case ShapeTool.RECTANGLE:
                if (this.lastRectangle) {
                    this.cursorShape = this.lastRectangle.clone() as RefShape;
                } else {
                    this.cursorShape = new RectangleShape(true);
                    this.cursorShape.shapeWidth = 300;
                    this.cursorShape.shapeHeight = 100;
                }
                break;
            case ShapeTool.CIRCLE:
                if (this.lastCircle) {
                    this.cursorShape = this.lastCircle.clone() as RefShape;
                } else {
                    this.cursorShape = new CircleShape(true);
                    this.cursorShape.shapeWidth = 200;
                    this.cursorShape.shapeHeight = 200;
                }
                break;
            case ShapeTool.TRIANGLE:
                if (this.lastTriangle) {
                    this.cursorShape = this.lastTriangle.clone() as RefShape;
                } else {
                    this.cursorShape = new TriangleShape(true);
                    this.cursorShape.shapeWidth = 200;
                    this.cursorShape.shapeHeight = 200;
                }
                break;
            default:
                throw Error("not a cursor type");
        }
        this.cursorShape.blendMode = BlendMode.INVERT;
    }

    public override activate() {
        super.activate();
        HelpWindow.instance.populate(this.helpMessage);
        this.window.setDimensions(130, this.height + 5);
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
        this.colorInput.closeColorSelector();
        this.outlineColorInput.closeColorSelector();
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
    }

    protected mouseDownHandler(param1: MouseEvent) {
        var _loc2_: Sprite = null;
        if (param1.target instanceof Sprite) {
            _loc2_ = param1.target as Sprite;
            if (this._canvas.contains(_loc2_)) {
                this.createNewShape();
            }
        }
    }

    protected createNewShape() {
        this._canvas.addRefSprite(this.cursorShape);
        this.cursorShape.blendMode = BlendMode.NORMAL;
        var _loc1_: Action = new ActionAdd(
            this.cursorShape,
            this._canvas,
            this._canvas.shapes.getChildIndex(this.cursorShape),
        );
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc1_));
        this.cursorShape = this.cursorShape.clone() as RefShape;
        this.cursorShape.blendMode = BlendMode.INVERT;
        this._canvas.addChild(this.cursorShape);
    }

    protected keyDownHandler(param1: KeyboardEvent) {
        if (param1.target instanceof TextField) {
            return;
        }
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
        if (param3) {
            param1 *= 10;
            param2 *= 10;
        }
        this.cursorShape.shapeWidth += param1;
        this.cursorShape.shapeHeight += param2;
        this.updateTextFields();
    }

    protected updateTextFields() {
        this.widthInput.text = "" + this.cursorShape.shapeWidth;
        this.heightInput.text = "" + this.cursorShape.shapeHeight;
        this.rotationInput.text = "" + this.cursorShape.angle;
        this.densityInput.text = "" + this.cursorShape.density;
        this.interactiveCheck.setValue(this.cursorShape.interactive);
        this.immovableCheck.setValue(this.cursorShape.immovable);
        this.asleepCheck.setValue(this.cursorShape.sleeping);
        this.densityInput.setValue(this.cursorShape.density);
        this.colorInput.setValue(this.cursorShape.color);
        this.outlineColorInput.setValue(this.cursorShape.outlineColor);
        this.opacityInput.setValue(this.cursorShape.opacity);
        this.collisionInput.setValue(this.cursorShape.collision);
    }

    protected adjustRotation(param1: number, param2: boolean) {
        if (param2) {
            param1 *= 10;
        }
        this.cursorShape.angle += param1;
        this.rotationInput.text = "" + this.cursorShape.angle;
    }

    protected shapeChosen(param1: MouseEvent) {
        var _loc2_: GenericButton = param1.target as GenericButton;
        this.selectedButton = _loc2_;
    }

    protected get selectedButton(): GenericButton {
        return this._selectedButton;
    }

    public get innerCutout(): number {
        return this._innerCutout;
    }

    public set innerCutout(param1: number) {
        if (param1 < 0) {
            param1 = 0;
        }
        if (param1 > 100) {
            param1 = 100;
        }
        this._innerCutout = param1;
    }

    protected set selectedButton(param1: GenericButton) {
        if (param1 == this._selectedButton) {
            return;
        }
        this._selectedButton.selected = false;
        this._selectedButton = param1;
        this._selectedButton.selected = true;
        if (this.contains(this.innerCutoutInput)) {
            this.removeChild(this.innerCutoutInput);
        }
        switch (this._selectedButton) {
            case this.rectButton:
                this.currentShape = ShapeTool.RECTANGLE;
                break;
            case this.circleButton:
                this.addChild(this.innerCutoutInput);
                this.currentShape = ShapeTool.CIRCLE;
                break;
            case this.triButton:
                this.currentShape = ShapeTool.TRIANGLE;
        }
        if (this.cursorShape instanceof RectangleShape) {
            this.lastRectangle = this.cursorShape.clone() as RectangleShape;
        } else if (this.cursorShape instanceof CircleShape) {
            this.lastCircle = this.cursorShape.clone() as CircleShape;
        } else if (this.cursorShape instanceof TriangleShape) {
            this.lastTriangle = this.cursorShape.clone() as TriangleShape;
        }
        this.createCursor();
        this._canvas.addChild(this.cursorShape);
        this.updateTextFields();
        this.window.setDimensions(130, this.height + 5);
    }

    protected inputValueChange(param1: ValueEvent) {
        trace("INPUT VALUE CHANGE");
        var _loc2_: InputObject = param1.inputObject;
        var _loc3_: string = _loc2_.attribute;
        trace("property " + _loc3_);
        trace(param1.value);
        this.cursorShape[_loc3_] = param1.value;
        if (param1.resetInputs) {
            this.updateTextFields();
        }
    }

    protected interactiveChange(param1: ValueEvent) {
        this.cursorShape.interactive = param1.value;
        if (this.cursorShape.interactive) {
            this.addChild(this.immovableCheck);
            this.addChild(this.asleepCheck);
            this.addChild(this.densityInput);
            this.addChild(this.collisionInput);
        } else {
            this.removeChild(this.immovableCheck);
            this.removeChild(this.asleepCheck);
            this.removeChild(this.densityInput);
            this.removeChild(this.collisionInput);
        }
        this.window.setDimensions(130, this.height + 5);
        this.updateTextFields();
    }

    public override die() {
        super.die();
        this.rectButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.shapeChosen,
        );
        this.circleButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.shapeChosen,
        );
        this.triButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.shapeChosen,
        );
        this.widthInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.heightInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.rotationInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.immovableCheck.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.colorInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.outlineColorInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.opacityInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.innerCutoutInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.collisionInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.interactiveCheck.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.interactiveChange,
        );
        this.widthInput.die();
        this.heightInput.die();
        this.rotationInput.die();
        this.interactiveCheck.die();
        this.immovableCheck.die();
        this.colorInput.die();
        this.outlineColorInput.die();
        this.opacityInput.die();
    }
}