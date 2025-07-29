import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Settings from "@/com/totaljerkface/game/Settings";
import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import ArtShape from "@/com/totaljerkface/game/editor/ArtShape";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import HelpWindow from "@/com/totaljerkface/game/editor/HelpWindow";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionAdd from "@/com/totaljerkface/game/editor/actions/ActionAdd";
import ActionAddVert from "@/com/totaljerkface/game/editor/actions/ActionAddVert";
import ActionCompleteShape from "@/com/totaljerkface/game/editor/actions/ActionCompleteShape";
import ActionDeleteVert from "@/com/totaljerkface/game/editor/actions/ActionDeleteVert";
import ColorInput from "@/com/totaljerkface/game/editor/ui/ColorInput";
import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import SliderInput from "@/com/totaljerkface/game/editor/ui/SliderInput";
import TextInput from "@/com/totaljerkface/game/editor/ui/TextInput";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import BezierVert from "@/com/totaljerkface/game/editor/vertedit/BezierVert";
import Vert from "@/com/totaljerkface/game/editor/vertedit/Vert";
import { boundClass } from 'autobind-decorator';
import BlendMode from "flash/display/BlendMode";
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import TextField from "flash/text/TextField";
import Mouse from "flash/ui/Mouse";

@boundClass
export default class ArtTool extends Tool {
    public static MAX_VERTS: number;
    private static MIN_LINE_DISTANCE: number = 2;
    private static MIN_HANDLE_DISTANCE: number = 3;
    private static SNAP_DISTANCE: number = 5;
    private static MAX_LINE_DISTANCE: number = 1000;
    private static E_NORMAL: number = 0;
    private static E_COMPLETE: number = 1;
    private static E_DONT_UPDATE: number = 2;
    private static E_END: number = 4;
    private static idCounter: number = 0;
    protected remainingVertsInput: TextInput;
    protected densityInput: TextInput;
    protected colorInput: ColorInput;
    protected outlineColorInput: ColorInput;
    protected opacityInput: SliderInput;
    protected shiftPressed: boolean;
    protected ctrlPressed: boolean;
    protected currentShape: ArtShape;
    protected nextPos: b2Vec2;
    protected cursorSprite: Sprite;
    protected dragState: number = 0;
    protected artState: number = 0;
    private helpMessage: string = "<u><b>Art Tool Help:</b></u><br><br>The art tool can be used to make terrain with bezier curves. Click wherever you\'d like to place vertices and lines. Hold the mouse down upon clicking to determine the curve of a line. Click on the first vertex again to complete the shape.<br><br><u>Keyboard Shortcuts:</u><br><br>Press delete to remove your most recent vertex<br><br>Hold <b>shift</b> to align your points with a 10 pixel grid.<br><br>Press <b>Enter</b> to complete your shape early without filling it to just draw lines.<br><br>Double click with the arrow tool into an artshape for manual editing<br><br>From there, click or drag to select vertices.<br><br>Double click on vertices to expand their bezier handles if they are collapsed. Hold alt to manually adjust one bezier handle at a time. Select a point and press Enter to insert new points.";

    constructor(param1: Editor, param2: Canvas) {
        super(param1, param2);
        this.init();
    }

    public static updateIdCounter(param1: number) {
        if (param1 < ArtTool.idCounter) {
            return;
        }
        ArtTool.idCounter = param1 + 1;
    }

    public static getIDCounter(): number {
        return ArtTool.idCounter;
    }

    protected init() {
        var _loc3_: number = 0;
        this.createCursor();
        this.currentShape = new ArtShape();
        this.currentShape.editMode = true;
        this.currentShape.mouseEnabled = false;
        ArtTool.idCounter = 0;
        var _loc1_: number = 0;
        var _loc2_: number = 0;
        _loc3_ = 5;
        var _loc4_: number = 16613761;
        var _loc5_: number = 120;
        this.remainingVertsInput = new TextInput(
            "vertices left",
            "vertsLeft",
            2,
            true,
            true,
        );
        this.remainingVertsInput.x = _loc3_;
        this.remainingVertsInput.y = _loc3_;
        this.addChild(this.remainingVertsInput);
        this.colorInput = new ColorInput("shape color", "color", true, true);
        this.colorInput.x = _loc3_;
        this.colorInput.y =
            this.remainingVertsInput.y +
            Math.ceil(this.remainingVertsInput.height) +
            5;
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
        this.updateTextFields();
    }

    public override activate() {
        super.activate();
        HelpWindow.instance.populate(this.helpMessage);
        this.window.setDimensions(130, this.height + 10);
        this._canvas.parent.addChild(this.currentShape);
        this.stage.addEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.stage.addEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveHandler,
        );
        this.stage.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.addEventListener(KeyboardEvent.KEY_UP, this.keyUpHandler);
    }

    public activateContinueDrawing() {
        super.activate();
        HelpWindow.instance.populate(this.helpMessage);
        this.window.setDimensions(130, this.height + 10);
        this._canvas.parent.addChild(this.currentShape);
        this.stage.addEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.stage.addEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveHandler,
        );
        this.stage.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.addEventListener(KeyboardEvent.KEY_UP, this.keyUpHandler);
    }

    public override deactivate() {
        var _loc1_: number = 0;
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc4_: number = 0;
        if (this.currentShape.parent) {
            this._canvas.parent.removeChild(this.currentShape);
            _loc1_ = this.currentShape.numVerts;
            _loc4_ = _loc1_ - 1;
            while (_loc4_ > -1) {
                _loc3_ = new ActionDeleteVert(_loc4_, this.currentShape, this);
                this.currentShape.removeVert();
                if (_loc2_) {
                    _loc2_.nextAction = _loc3_;
                }
                _loc2_ = _loc3_;
                _loc4_--;
            }
            if (_loc3_) {
                this.dispatchEvent(
                    new ActionEvent(ActionEvent.GENERIC, _loc3_),
                );
            }
            this.currentShape.redraw();
        }
        this.colorInput.closeColorSelector();
        this.outlineColorInput.closeColorSelector();
        this.updateRemainingVerts();
        this.cursorSprite.visible = false;
        Mouse.show();
        this.stage.removeEventListener(Event.ENTER_FRAME, this.frameHandler);
        this.stage.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.removeEventListener(KeyboardEvent.KEY_UP, this.keyUpHandler);
        super.deactivate();
    }

    public deactivateContinueDrawing() {
        trace("deactivate art keep selection");
        this.colorInput.closeColorSelector();
        this.outlineColorInput.closeColorSelector();
        this.cursorSprite.visible = false;
        this.stage.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.mouseMoveHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.removeEventListener(KeyboardEvent.KEY_UP, this.keyUpHandler);
        super.deactivate();
    }

    protected createCursor() {
        this.cursorSprite = new Sprite();
        this.cursorSprite.graphics.lineStyle(1, 0, 1, true);
        this.cursorSprite.graphics.moveTo(-5, 0);
        this.cursorSprite.graphics.lineTo(5, 0);
        this.cursorSprite.graphics.moveTo(0, -5);
        this.cursorSprite.graphics.lineTo(0, 5);
        this.cursorSprite.mouseEnabled = false;
        this.cursorSprite.blendMode = BlendMode.INVERT;
        this.cursorSprite.visible = false;
        this.canvas.parent.parent.addChild(this.cursorSprite);
    }

    protected frameHandler(param1: Event) {
        var _loc7_: b2Vec2 = null;
        this.artState = ArtTool.E_NORMAL;
        this.nextPos = new b2Vec2(
            Math.round(this.currentShape.mouseX),
            Math.round(this.currentShape.mouseY),
        );
        if (this.shiftPressed) {
            this.nextPos.x = Math.round(this.nextPos.x * 0.1) * 10;
            this.nextPos.y = Math.round(this.nextPos.y * 0.1) * 10;
        }
        var _loc2_: number = this.currentShape.numVerts;
        var _loc3_: BezierVert = this.currentShape.getVertAt(0) as BezierVert;
        var _loc4_: BezierVert = this.currentShape.getVertAt(
            _loc2_ - 1,
        ) as BezierVert;
        var _loc5_ = new b2Vec2(
            this.nextPos.x - _loc4_.x,
            this.nextPos.y - _loc4_.y,
        );
        var _loc6_: number = _loc5_.Length();
        if (this.dragState == 1) {
            if (_loc6_ > ArtTool.MIN_HANDLE_DISTANCE) {
                this.dragState = 2;
                _loc4_.handle2.Set(
                    this.nextPos.x - _loc4_.x,
                    this.nextPos.y - _loc4_.y,
                );
                _loc4_.handle1.Set(-_loc4_.handle2.x, -_loc4_.handle2.y);
            }
        } else if (this.dragState == 2) {
            if (_loc6_ <= ArtTool.MIN_HANDLE_DISTANCE) {
                _loc4_.handle1.Set(0, 0);
                _loc4_.handle2.Set(0, 0);
            } else {
                _loc4_.handle2.Set(
                    this.nextPos.x - _loc4_.x,
                    this.nextPos.y - _loc4_.y,
                );
                _loc4_.handle1.Set(-_loc4_.handle2.x, -_loc4_.handle2.y);
            }
        }
        if (_loc2_ > 1) {
            if (_loc2_ == ArtTool.MAX_VERTS) {
                this.artState = ArtTool.E_COMPLETE;
            }
            if (this.artState != ArtTool.E_COMPLETE) {
                if (_loc6_ == 0) {
                    this.artState = ArtTool.E_DONT_UPDATE;
                } else if (_loc6_ < ArtTool.MIN_LINE_DISTANCE) {
                    _loc5_.Normalize();
                    _loc5_.Multiply(ArtTool.MIN_LINE_DISTANCE);
                    this.nextPos = new b2Vec2(
                        Math.round(_loc4_.x + _loc5_.x),
                        Math.round(_loc4_.y + _loc5_.y),
                    );
                }
                _loc7_ = new b2Vec2(
                    _loc3_.x - this.nextPos.x,
                    _loc3_.y - this.nextPos.y,
                );
                if (
                    _loc7_.Length() <
                    ArtTool.SNAP_DISTANCE * Math.pow(2, -Editor.currentZoom)
                ) {
                    this.artState = ArtTool.E_COMPLETE;
                }
            }
        } else if (_loc3_) {
            if (_loc6_ == 0) {
                this.artState = ArtTool.E_DONT_UPDATE;
            } else if (_loc6_ < ArtTool.MIN_LINE_DISTANCE) {
                _loc5_.Normalize();
                _loc5_.Multiply(ArtTool.MIN_LINE_DISTANCE);
                this.nextPos = new b2Vec2(
                    Math.round(_loc3_.x + _loc5_.x),
                    Math.round(_loc3_.y + _loc5_.y),
                );
            }
        }
        this.currentShape.drawEditMode(
            this.nextPos,
            this.artState == ArtTool.E_COMPLETE,
            true,
        );
    }

    protected mouseDownHandler(param1: MouseEvent) {
        var _loc2_: Sprite = null;
        if (param1.target instanceof Sprite) {
            _loc2_ = param1.target as Sprite;
            if (this._canvas.contains(_loc2_)) {
                this.setVertex();
                this.stage.addEventListener(
                    MouseEvent.MOUSE_UP,
                    this.mouseUpHandler,
                );
                this.dragState = 1;
                this.updateRemainingVerts();
            }
        }
    }

    protected keyDownHandler(param1: KeyboardEvent) {
        switch (param1.keyCode) {
            case 8:
                if (!(param1.target instanceof TextField)) {
                    this.deletePreviousVertex();
                }
                break;
            case 13:
                if (!(param1.target instanceof TextField)) {
                    if (this.currentShape.numVerts < 2) {
                        Settings.debugText.show(
                            "art shapes must have at least 2 points",
                        );
                    } else {
                        this.completeShape();
                    }
                }
                break;
            case 16:
                this.shiftPressed = true;
                break;
            case 17:
                this.ctrlPressed = true;
        }
    }

    protected keyUpHandler(param1: KeyboardEvent) {
        switch (param1.keyCode) {
            case 16:
                this.shiftPressed = false;
                break;
            case 17:
                this.ctrlPressed = false;
        }
    }

    protected mouseUpHandler(param1: MouseEvent) {
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.dragState = 0;
    }

    protected mouseMoveHandler(param1: MouseEvent) {
        var _loc2_: Sprite = null;
        var _loc3_: DisplayObject = null;
        if (param1.target instanceof Sprite) {
            _loc2_ = param1.target as Sprite;
            if (this._canvas.contains(_loc2_)) {
                if (this.cursorSprite.visible == false) {
                    this.cursorSprite.visible = true;
                    Mouse.hide();
                    trace("HIDE");
                }
                _loc3_ = this._canvas.parent.parent;
                this.cursorSprite.x = _loc3_.mouseX;
                this.cursorSprite.y = _loc3_.mouseY;
                if (this.shiftPressed) {
                }
            } else if (this.cursorSprite.visible == true) {
                this.cursorSprite.visible = false;
                Mouse.show();
            }
        } else if (this.cursorSprite.visible == true) {
            this.cursorSprite.visible = false;
            Mouse.show();
            trace("SHOW");
        }
    }

    protected setVertex() {
        var _loc1_: BezierVert = null;
        var _loc2_: ActionAddVert = null;
        if (this.currentShape.numVerts < 1) {
            this.stage.addEventListener(Event.ENTER_FRAME, this.frameHandler);
            this.currentShape.xUnbound = Math.round(this._canvas.mouseX);
            this.currentShape.yUnbound = Math.round(this._canvas.mouseY);
            _loc1_ = new BezierVert();
            this.currentShape.addVert(_loc1_);
            _loc1_.edgeShape = this.currentShape;
            _loc1_.selected = true;
            this.currentShape.vID = ArtTool.idCounter;
            _loc2_ = new ActionAddVert(
                this.currentShape.numVerts - 1,
                this.currentShape,
                this,
            );
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
        } else {
            switch (this.artState) {
                case ArtTool.E_NORMAL:
                    _loc1_ = this.currentShape.getVertAt(
                        this.currentShape.numVerts - 1,
                    ) as BezierVert;
                    if (
                        !(
                            _loc1_.x == this.nextPos.x &&
                            _loc1_.y == this.nextPos.y
                        )
                    ) {
                        _loc1_.selected = false;
                        _loc1_ = new BezierVert(this.nextPos.x, this.nextPos.y);
                        this.currentShape.addVert(_loc1_);
                        _loc1_.edgeShape = this.currentShape;
                        _loc1_.selected = true;
                        _loc2_ = new ActionAddVert(
                            this.currentShape.numVerts - 1,
                            this.currentShape,
                            this,
                        );
                        this.dispatchEvent(
                            new ActionEvent(ActionEvent.GENERIC, _loc2_),
                        );
                    }
                    break;
                case ArtTool.E_COMPLETE:
                    this.currentShape.completeFill = true;
                    this.completeShape();
                    break;
                case ArtTool.E_DONT_UPDATE:
            }
        }
    }

    protected deletePreviousVertex() {
        var _loc2_: ActionDeleteVert = null;
        var _loc3_: Vert = null;
        var _loc1_: number = this.currentShape.numVerts;
        if (_loc1_ > 0) {
            _loc2_ = new ActionDeleteVert(_loc1_ - 1, this.currentShape, this);
            this.currentShape.removeVert();
            if (this.currentShape.numVerts == 0) {
                this.stage.removeEventListener(
                    Event.ENTER_FRAME,
                    this.frameHandler,
                );
                this.currentShape.graphics.clear();
            } else {
                _loc3_ = this.currentShape.getVertAt(
                    this.currentShape.numVerts - 1,
                );
                _loc3_.selected = true;
            }
            if (_loc2_) {
                this.dispatchEvent(
                    new ActionEvent(ActionEvent.GENERIC, _loc2_),
                );
            }
        }
    }

    public override addFrameHandler() {
        this.stage.addEventListener(Event.ENTER_FRAME, this.frameHandler);
    }

    public override removeFrameHandler() {
        this.stage.removeEventListener(Event.ENTER_FRAME, this.frameHandler);
    }

    public override setCurrentShape(param1: RefShape) {
        if (this.currentShape) {
            if (this.currentShape.parent) {
                this.currentShape.parent.removeChild(this.currentShape);
            }
        }
        this.currentShape = param1 as ArtShape;
        this.currentShape.completeFill = false;
        this.currentShape.editMode = true;
        this.currentShape.mouseEnabled = false;
        this._canvas.parent.addChild(this.currentShape);
        if (this.currentShape.numVerts > 0) {
            this.stage.addEventListener(Event.ENTER_FRAME, this.frameHandler);
        }
    }

    protected completeShape() {
        this.artState = 0;
        this.dragState = 0;
        this.stage.removeEventListener(Event.ENTER_FRAME, this.frameHandler);
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.currentShape.recenter();
        this.currentShape.editMode = false;
        this.currentShape.mouseEnabled = true;
        this._canvas.addRefSprite(this.currentShape);
        var _loc1_ = new ArtShape(
            this.currentShape.interactive,
            this.currentShape.immovable,
            this.currentShape.sleeping,
            this.currentShape.density,
            this.currentShape.color,
            this.currentShape.outlineColor,
            this.currentShape.opacity,
            this.currentShape.collision,
        );
        _loc1_.editMode = true;
        _loc1_.mouseEnabled = false;
        this._canvas.parent.addChild(_loc1_);
        var _loc2_ = new ActionCompleteShape(this.currentShape, _loc1_, this);
        var _loc3_: Action = new ActionAdd(
            this.currentShape,
            this._canvas,
            this._canvas.shapes.getChildIndex(this.currentShape),
        );
        _loc2_.nextAction = _loc3_;
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc3_));
        this.currentShape = _loc1_;
    }

    protected updateRemainingVerts() {
        var _loc1_: number = this.currentShape.numVerts;
        var _loc2_: number = ArtTool.MAX_VERTS - _loc1_;
        this.remainingVertsInput.setValue("" + _loc2_);
    }

    protected updateTextFields() {
        this.updateRemainingVerts();
        this.colorInput.setValue(this.currentShape.color);
        this.outlineColorInput.setValue(this.currentShape.outlineColor);
        this.opacityInput.setValue(this.currentShape.opacity);
    }

    protected inputValueChange(param1: ValueEvent) {
        trace("INPUT VALUE CHANGE");
        var _loc2_: InputObject = param1.inputObject;
        var _loc3_: string = _loc2_.attribute;
        trace("property " + _loc3_);
        trace(param1.value);
        this.currentShape[_loc3_] = param1.value;
        this.updateTextFields();
    }

    public override resizeElements() {
        var _loc3_: Vert = null;
        var _loc1_: number = this.currentShape.numVerts;
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.currentShape.getVertAt(_loc2_);
            _loc3_.selected = _loc3_.selected;
            _loc2_++;
        }
    }

    public override die() {
        super.die();
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
        this.colorInput.die();
        this.outlineColorInput.die();
        this.opacityInput.die();
    }
}