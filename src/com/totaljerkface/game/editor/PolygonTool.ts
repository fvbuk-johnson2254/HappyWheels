import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Settings from "@/com/totaljerkface/game/Settings";
import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import AttributeReference from "@/com/totaljerkface/game/editor/AttributeReference";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import HelpWindow from "@/com/totaljerkface/game/editor/HelpWindow";
import PolygonShape from "@/com/totaljerkface/game/editor/PolygonShape";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionAdd from "@/com/totaljerkface/game/editor/actions/ActionAdd";
import ActionAddVert from "@/com/totaljerkface/game/editor/actions/ActionAddVert";
import ActionCompleteShape from "@/com/totaljerkface/game/editor/actions/ActionCompleteShape";
import ActionDeleteVert from "@/com/totaljerkface/game/editor/actions/ActionDeleteVert";
import CheckBox from "@/com/totaljerkface/game/editor/ui/CheckBox";
import ColorInput from "@/com/totaljerkface/game/editor/ui/ColorInput";
import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import SliderInput from "@/com/totaljerkface/game/editor/ui/SliderInput";
import TextInput from "@/com/totaljerkface/game/editor/ui/TextInput";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
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
export default class PolygonTool extends Tool {
    public static MAX_VERTS: number;
    private static MIN_SHAPE_LINE_DISTANCE: number = 5;
    private static SNAP_DISTANCE: number = 5;
    private static MAX_LINE_DISTANCE: number = 1000;
    private static P_NORMAL: number = 0;
    private static P_COMPLETE: number = 1;
    private static P_DONT_UPDATE: number = 2;
    private static P_REPLACE_PREV: number = 3;
    private static P_END: number = 4;
    private static idCounter: number = 0;
    protected remainingVertsInput: TextInput;
    protected densityInput: TextInput;
    protected colorInput: ColorInput;
    protected outlineColorInput: ColorInput;
    protected opacityInput: SliderInput;
    protected collisionInput: SliderInput;
    protected immovableCheck: CheckBox;
    protected asleepCheck: CheckBox;
    protected shiftPressed: boolean;
    protected ctrlPressed: boolean;
    protected currentShape: PolygonShape;
    protected nextPos: b2Vec2;
    protected cursorSprite: Sprite;
    protected polyState: number = 0;
    private helpMessage: string = "<u><b>Polygon Tool Help:</b></u><br><br>The polygon tool can be used to make convex polygonal shapes easily. Click wherever you\'d like to place vertices and lines. Click on the first vertex again to complete the shape. <br><br>When making your shapes, you must place your points in a clockwise direction. Also, you are limited to convex polygon shapes with 10 vertices at most.<br><br><u>Keyboard Shortcuts:</u><br><br>Hold <b>shift</b> while moving your mouse to align your points to a 10 pixel grid.<br><br><b>Delete</b> or undo will remove your last placed point.<br><br><b>Enter</b> will complete the polygon immediately with the current points.";

    constructor(param1: Editor, param2: Canvas) {
        super(param1, param2);
        this.init();
    }

    public static updateIdCounter(param1: number) {
        if (param1 < PolygonTool.idCounter) {
            return;
        }
        PolygonTool.idCounter = param1 + 1;
    }

    public static getIDCounter(): number {
        return PolygonTool.idCounter;
    }

    protected init() {
        var _loc3_: number = 0;
        this.createCursor();
        this.currentShape = new PolygonShape();
        this.currentShape.editMode = true;
        this.currentShape.mouseEnabled = false;
        PolygonTool.idCounter = 0;
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
        this.immovableCheck = new CheckBox(
            "fixed",
            "immovable",
            true,
            true,
            true,
        );
        this.immovableCheck.y =
            this.opacityInput.y + Math.ceil(this.opacityInput.height);
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
        this.collisionInput.addEventListener(
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
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.removeEventListener(KeyboardEvent.KEY_UP, this.keyUpHandler);
        super.deactivate();
    }

    public deactivateContinueDrawing() {
        trace("deactivate polygon keep selection");
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
        var _loc3_: Vert = null;
        var _loc4_: Vert = null;
        var _loc5_: Vert = null;
        var _loc6_: Vert = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2Vec2 = null;
        var _loc10_: b2Vec2 = null;
        var _loc11_: b2Vec2 = null;
        var _loc12_: b2Vec2 = null;
        var _loc13_: b2Vec2 = null;
        var _loc14_: number = NaN;
        var _loc15_: number = NaN;
        var _loc16_: number = NaN;
        var _loc17_: number = NaN;
        var _loc18_: b2Vec2 = null;
        var _loc19_: b2Vec2 = null;
        var _loc20_: number = NaN;
        var _loc21_: b2Vec2 = null;
        var _loc22_: number = NaN;
        this.polyState = PolygonTool.P_NORMAL;
        this.nextPos = new b2Vec2(
            Math.round(this.currentShape.mouseX),
            Math.round(this.currentShape.mouseY),
        );
        if (this.shiftPressed) {
            this.nextPos.x = Math.round(this.nextPos.x * 0.1) * 10;
            this.nextPos.y = Math.round(this.nextPos.y * 0.1) * 10;
        }
        var _loc2_: number = this.currentShape.numVerts;
        if (_loc2_ > 1) {
            _loc3_ = this.currentShape.getVertAt(0);
            _loc4_ = this.currentShape.getVertAt(1);
            _loc5_ = this.currentShape.getVertAt(_loc2_ - 2);
            _loc6_ = this.currentShape.getVertAt(_loc2_ - 1);
            _loc7_ = new b2Vec2(_loc6_.x - _loc5_.x, _loc6_.y - _loc5_.y);
            _loc8_ = new b2Vec2(_loc3_.x - _loc6_.x, _loc3_.y - _loc6_.y);
            _loc9_ = new b2Vec2(
                this.nextPos.x - _loc6_.x,
                this.nextPos.y - _loc6_.y,
            );
            _loc10_ = _loc7_.Copy();
            _loc11_ = _loc8_.Copy();
            _loc10_.Normalize();
            _loc11_.Normalize();
            _loc12_ = new b2Vec2(_loc10_.y, -_loc10_.x);
            _loc13_ = new b2Vec2(-_loc11_.y, _loc11_.x);
            _loc14_ = b2Math.b2Dot(_loc9_, _loc10_);
            _loc15_ = b2Math.b2Dot(_loc9_, _loc11_);
            _loc16_ = b2Math.b2Dot(_loc9_, _loc12_);
            _loc17_ = b2Math.b2Dot(_loc9_, _loc13_);
            if (_loc14_ < 0 && _loc15_ < 0) {
                this.nextPos.Set(_loc6_.x, _loc6_.y);
                this.polyState = PolygonTool.P_DONT_UPDATE;
            } else if (_loc14_ >= 0 && _loc16_ > 0) {
                _loc18_ = _loc10_.Copy();
                _loc18_.Multiply(_loc14_);
                this.nextPos.Set(
                    Math.round(_loc6_.x + _loc18_.x),
                    Math.round(_loc6_.y + _loc18_.y),
                );
                this.polyState = PolygonTool.P_REPLACE_PREV;
            } else if (_loc15_ >= 0 && _loc17_ > 0) {
                this.nextPos.Set(_loc3_.x, _loc3_.y);
                this.polyState = PolygonTool.P_COMPLETE;
            } else if (_loc2_ == PolygonTool.MAX_VERTS) {
                this.nextPos.Set(_loc3_.x, _loc3_.y);
                this.polyState = PolygonTool.P_COMPLETE;
            }
            if (
                this.polyState != PolygonTool.P_COMPLETE &&
                this.polyState != PolygonTool.P_DONT_UPDATE
            ) {
                _loc19_ = new b2Vec2(
                    this.nextPos.x - _loc6_.x,
                    this.nextPos.y - _loc6_.y,
                );
                _loc20_ = _loc19_.Length();
                if (_loc20_ == 0) {
                    this.polyState = PolygonTool.P_DONT_UPDATE;
                } else if (_loc20_ < PolygonTool.MIN_SHAPE_LINE_DISTANCE) {
                    this.nextPos.Set(_loc6_.x, _loc6_.y);
                    this.polyState = PolygonTool.P_DONT_UPDATE;
                }
                _loc21_ = new b2Vec2(
                    _loc3_.x - this.nextPos.x,
                    _loc3_.y - this.nextPos.y,
                );
                _loc20_ = _loc21_.Length();
                if (
                    _loc20_ <
                    PolygonTool.SNAP_DISTANCE * Math.pow(2, -Editor.currentZoom)
                ) {
                    this.nextPos.Set(_loc3_.x, _loc3_.y);
                    this.polyState = PolygonTool.P_COMPLETE;
                } else if (_loc2_ > 2) {
                    _loc7_ = new b2Vec2(
                        _loc3_.x - _loc4_.x,
                        _loc3_.y - _loc4_.y,
                    );
                    _loc8_ = new b2Vec2(
                        this.nextPos.x - _loc3_.x,
                        this.nextPos.y - _loc3_.y,
                    );
                    _loc10_ = _loc7_.Copy();
                    _loc11_ = _loc8_.Copy();
                    _loc10_.Normalize();
                    _loc11_.Normalize();
                    _loc13_ = new b2Vec2(-_loc10_.y, _loc10_.x);
                    _loc22_ = b2Math.b2Dot(_loc8_, _loc13_);
                    if (_loc22_ > 0) {
                        this.nextPos.Set(_loc3_.x, _loc3_.y);
                        this.polyState = PolygonTool.P_COMPLETE;
                    }
                }
            }
            if (_loc2_ == 2 && this.polyState == PolygonTool.P_COMPLETE) {
                this.nextPos.Set(_loc6_.x, _loc6_.y);
                this.polyState = PolygonTool.P_DONT_UPDATE;
            }
        } else {
            _loc3_ = this.currentShape.getVertAt(0);
            if (_loc3_) {
                _loc19_ = new b2Vec2(
                    this.nextPos.x - _loc3_.x,
                    this.nextPos.y - _loc3_.y,
                );
                _loc20_ = _loc19_.Length();
                if (_loc20_ == 0) {
                    this.polyState = PolygonTool.P_DONT_UPDATE;
                } else if (_loc20_ < PolygonTool.MIN_SHAPE_LINE_DISTANCE) {
                    _loc19_.Normalize();
                    _loc19_.Multiply(PolygonTool.MIN_SHAPE_LINE_DISTANCE);
                    this.nextPos.Set(
                        Math.round(_loc3_.x + _loc19_.x),
                        Math.round(_loc3_.y + _loc19_.y),
                    );
                }
            }
        }
        this.currentShape.drawEditMode(
            this.nextPos,
            this.polyState == PolygonTool.P_COMPLETE,
            true,
        );
    }

    protected mouseDownHandler(param1: MouseEvent) {
        var _loc2_: Sprite = null;
        if (param1.target instanceof Sprite) {
            _loc2_ = param1.target as Sprite;
            if (this._canvas.contains(_loc2_)) {
                this.setVertex();
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
                    if (this.currentShape.numVerts < 3) {
                        Settings.debugText.show(
                            "polygons must have at least 3 points",
                        );
                    } else {
                        this.currentShape.completeFill = true;
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

    protected mouseMoveHandler(param1: MouseEvent) {
        var _loc2_: Sprite = null;
        var _loc3_: DisplayObject = null;
        if (param1.target instanceof Sprite) {
            _loc2_ = param1.target as Sprite;
            if (this._canvas.contains(_loc2_)) {
                if (this.cursorSprite.visible == false) {
                    this.cursorSprite.visible = true;
                    Mouse.hide();
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
        }
    }

    protected setVertex() {
        var _loc1_: Vert = null;
        var _loc2_: ActionAddVert = null;
        var _loc3_: Action = null;
        if (this.currentShape.numVerts < 1) {
            this.stage.addEventListener(Event.ENTER_FRAME, this.frameHandler);
            this.currentShape.xUnbound = Math.round(this._canvas.mouseX);
            this.currentShape.yUnbound = Math.round(this._canvas.mouseY);
            _loc1_ = new Vert();
            this.currentShape.addVert(_loc1_);
            _loc1_.edgeShape = this.currentShape;
            _loc1_.selected = true;
            this.currentShape.vID = PolygonTool.idCounter;
            _loc2_ = new ActionAddVert(
                this.currentShape.numVerts - 1,
                this.currentShape,
                this,
            );
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
        } else {
            switch (this.polyState) {
                case PolygonTool.P_NORMAL:
                    _loc1_ = this.currentShape.getVertAt(
                        this.currentShape.numVerts - 1,
                    );
                    if (
                        !(
                            _loc1_.x == this.nextPos.x &&
                            _loc1_.y == this.nextPos.y
                        )
                    ) {
                        _loc1_.selected = false;
                        _loc1_ = new Vert(this.nextPos.x, this.nextPos.y);
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
                case PolygonTool.P_COMPLETE:
                    if (this.checkVertsConvex()) {
                        this.currentShape.completeFill = true;
                        this.completeShape();
                    }
                    break;
                case PolygonTool.P_DONT_UPDATE:
                    break;
                case PolygonTool.P_REPLACE_PREV:
                    _loc1_ = this.currentShape.getVertAt(
                        this.currentShape.numVerts - 1,
                    );
                    _loc1_.selected = false;
                    _loc3_ = new ActionDeleteVert(
                        this.currentShape.numVerts - 1,
                        this.currentShape,
                        this,
                    );
                    this.currentShape.removeVert();
                    _loc1_ = new Vert(this.nextPos.x, this.nextPos.y);
                    this.currentShape.addVert(_loc1_);
                    _loc1_.edgeShape = this.currentShape;
                    _loc1_.selected = true;
                    _loc2_ = new ActionAddVert(
                        this.currentShape.numVerts - 1,
                        this.currentShape,
                        this,
                    );
                    _loc3_.nextAction = _loc2_;
                    this.dispatchEvent(
                        new ActionEvent(ActionEvent.GENERIC, _loc2_),
                    );
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
        this.currentShape = param1 as PolygonShape;
        this.currentShape.completeFill = false;
        this.currentShape.editMode = true;
        this.currentShape.mouseEnabled = false;
        this._canvas.parent.addChild(this.currentShape);
        if (this.currentShape.numVerts > 0) {
            this.stage.addEventListener(Event.ENTER_FRAME, this.frameHandler);
        }
    }

    protected completeShape() {
        this.polyState = 0;
        this.stage.removeEventListener(Event.ENTER_FRAME, this.frameHandler);
        this.currentShape.recenter();
        this.currentShape.editMode = false;
        this.currentShape.mouseEnabled = true;
        this._canvas.addRefSprite(this.currentShape);
        var _loc1_ = new PolygonShape(
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

    protected checkVertsConvex(): boolean {
        var _loc3_: Vert = null;
        var _loc4_: number = 0;
        var _loc5_: Vert = null;
        var _loc6_: Vert = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2Vec2 = null;
        var _loc10_: number = NaN;
        var _loc1_: number = this.currentShape.numVerts;
        if (_loc1_ < 3) {
            return false;
        }
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.currentShape.getVertAt(_loc2_);
            _loc4_ = _loc2_ + 1;
            if (_loc4_ > _loc1_ - 1) {
                _loc4_ -= _loc1_;
            }
            _loc5_ = this.currentShape.getVertAt(_loc4_);
            _loc4_ = _loc2_ + 2;
            if (_loc4_ > _loc1_ - 1) {
                _loc4_ -= _loc1_;
            }
            _loc6_ = this.currentShape.getVertAt(_loc4_);
            _loc7_ = new b2Vec2(_loc5_.x - _loc3_.x, _loc5_.y - _loc3_.y);
            _loc8_ = new b2Vec2(_loc6_.x - _loc5_.x, _loc6_.y - _loc5_.y);
            _loc7_.Normalize();
            _loc8_.Normalize();
            _loc9_ = new b2Vec2(_loc7_.y, -_loc7_.x);
            _loc10_ = b2Math.b2Dot(_loc8_, _loc9_);
            if (_loc10_ > 0) {
                return false;
            }
            _loc2_++;
        }
        return true;
    }

    protected updateRemainingVerts() {
        var _loc1_: number = this.currentShape.numVerts;
        var _loc2_: number = PolygonTool.MAX_VERTS - _loc1_;
        this.remainingVertsInput.setValue("" + _loc2_);
    }

    protected updateTextFields() {
        this.updateRemainingVerts();
        this.densityInput.text = "" + this.currentShape.density;
        this.immovableCheck.setValue(this.currentShape.immovable);
        this.asleepCheck.setValue(this.currentShape.sleeping);
        this.densityInput.setValue(this.currentShape.density);
        this.colorInput.setValue(this.currentShape.color);
        this.outlineColorInput.setValue(this.currentShape.outlineColor);
        this.opacityInput.setValue(this.currentShape.opacity);
        this.collisionInput.setValue(this.currentShape.collision);
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
        this.collisionInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.inputValueChange,
        );
        this.immovableCheck.die();
        this.colorInput.die();
        this.outlineColorInput.die();
        this.opacityInput.die();
    }
}