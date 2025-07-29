import Settings from "@/com/totaljerkface/game/Settings";
import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import ArtShape from "@/com/totaljerkface/game/editor/ArtShape";
import ArtTool from "@/com/totaljerkface/game/editor/ArtTool";
import AttributeReference from "@/com/totaljerkface/game/editor/AttributeReference";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import Editor from "@/com/totaljerkface/game/editor/Editor";
import FunctionReference from "@/com/totaljerkface/game/editor/FunctionReference";
import GroupCanvas from "@/com/totaljerkface/game/editor/GroupCanvas";
import HelpWindow from "@/com/totaljerkface/game/editor/HelpWindow";
import PolygonShape from "@/com/totaljerkface/game/editor/PolygonShape";
import PolygonTool from "@/com/totaljerkface/game/editor/PolygonTool";
import RefGroup from "@/com/totaljerkface/game/editor/RefGroup";
import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import RefVehicle from "@/com/totaljerkface/game/editor/RefVehicle";
import SelectBoxSprite from "@/com/totaljerkface/game/editor/SelectBoxSprite";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionAdd from "@/com/totaljerkface/game/editor/actions/ActionAdd";
import ActionAddKeyedIndex from "@/com/totaljerkface/game/editor/actions/ActionAddKeyedIndex";
import ActionCloseGroup from "@/com/totaljerkface/game/editor/actions/ActionCloseGroup";
import ActionCloseVertEdit from "@/com/totaljerkface/game/editor/actions/ActionCloseVertEdit";
import ActionDelete from "@/com/totaljerkface/game/editor/actions/ActionDelete";
import ActionDepth from "@/com/totaljerkface/game/editor/actions/ActionDepth";
import ActionDeselect from "@/com/totaljerkface/game/editor/actions/ActionDeselect";
import ActionOpenGroup from "@/com/totaljerkface/game/editor/actions/ActionOpenGroup";
import ActionOpenVertEdit from "@/com/totaljerkface/game/editor/actions/ActionOpenVertEdit";
import ActionProperty from "@/com/totaljerkface/game/editor/actions/ActionProperty";
import ActionRemoveKeyedIndex from "@/com/totaljerkface/game/editor/actions/ActionRemoveKeyedIndex";
import ActionReverseShape from "@/com/totaljerkface/game/editor/actions/ActionReverseShape";
import ActionRotate from "@/com/totaljerkface/game/editor/actions/ActionRotate";
import ActionScale from "@/com/totaljerkface/game/editor/actions/ActionScale";
import ActionSelect from "@/com/totaljerkface/game/editor/actions/ActionSelect";
import ActionTranslate from "@/com/totaljerkface/game/editor/actions/ActionTranslate";
import ActionTranslateUnbound from "@/com/totaljerkface/game/editor/actions/ActionTranslateUnbound";
import Poser from "@/com/totaljerkface/game/editor/poser/Poser";
import NPCharacterRef from "@/com/totaljerkface/game/editor/specials/NPCharacterRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import StartPlaceHolder from "@/com/totaljerkface/game/editor/specials/StartPlaceHolder";
import TextBoxRef from "@/com/totaljerkface/game/editor/specials/TextBoxRef";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import TrigSelector from "@/com/totaljerkface/game/editor/trigger/TrigSelector";
import ColorInput from "@/com/totaljerkface/game/editor/ui/ColorInput";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import InputObject from "@/com/totaljerkface/game/editor/ui/InputObject";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import VertEdit from "@/com/totaljerkface/game/editor/vertedit/VertEdit";
import ScrollUpSprite from "@/top/ScrollUpSprite";
import DisplayObject from "flash/display/DisplayObject";
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import Point from "flash/geom/Point";
import Rectangle from "flash/geom/Rectangle";
import TextField from "flash/text/TextField";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol835")] */
@boundClass
export default class ArrowTool extends Tool {
    public labelText: TextField;
    private currentSelection: any[];
    private copiedSelection: any[];
    private dragging: boolean;
    private currMouseX: number;
    private currMouseY: number;
    private selectBox: Sprite;
    private trigSelector: TrigSelector;
    private poser: Poser;
    private vertEdit: VertEdit;
    private currentAttributes: any[];
    private inputs: any[];
    private currentFunctions: any[];
    private buttons: any[];
    private inputHolder: Sprite;
    private inputMask: Sprite;
    private holderY: number;
    private translating: boolean;
    private scaling: boolean;
    private rotating: boolean;
    private scrolling: boolean;
    private scrollUpSprite: Sprite;
    private scrollDownSprite: Sprite;
    private windowWidth: number = 130;
    private cutoffHeight: number = 430;
    private indent: number = 5;
    private _currentCanvas: Canvas;
    public numShapesSelected: number = 0;
    public numSpecialsSelected: number = 0;
    public numJointsSelected: number = 0;
    public numTriggersSelected: number = 0;
    public numGroupsSelected: number = 0;
    public numCharSelected: number = 0;
    private helpMessage: string = "<u><b>Selection Tool Help:</b></u><br><br>The selection tool allows you to select objects by clicking on them, or by dragging a rectangle around them.  When an object is selected, the properties of that object will be displayed for your goddamn pleasure.<br><br>Selecting multiple objects will allow you to make changes to several objects at once.  No playa, I\'m fuckin serious.  Hold <b>shift</b> when selecting to add to or remove from your current selection.<br><br>If all of the selected objects are groupable (such as non-fixed shapes), you will be able to group them to make more complex objects.  Once a group is created, you can double-click on it to enter and edit it.  Double click again on the background to exit.<br><br>You may now also double click into art and polygon shapes to edit them.<br><br><u>Keyboard Shortcuts:</u><br><br><b>up,down,left,right</b>: Move the selected object(s) around the stage.  Hold <b>shift</b> to move them around faster.<br><br><b>a,w,s,d</b>: Resize the height and width of the selected object(s), when allowable.  Hold <b>shift</b> to resize faster.<br><br><b>z,x</b>: Rotate the selected object(s) when allowable.  Hold <b>shift</b> to rotate faster.<br><br><b>ctrl+up,down</b>: Raise or lower the depth of the object.<br><br><b>backspace</b>: Delete the current selection.<br><br><b>ctrl+c</b>: Copy the selected object(s).<br><br><b>ctrl+v</b>: Paste the last copied objects.  Hold <b>shift</b> to paste in the same location as the original.<br><br><b>ctrl+z</b>:  Undo the last action.<br><br><b>ctrl+y</b>:  Redo what you just undid.<br><br>";
    private helpPolyEdit: string = "<u><b>Polygon Editor Help:</b></u><br><br>Manually move the points of your polygon to your liking. The polygon must remain convex, so your actions will be constrained.<br><br><u>Keyboard Shortcuts:</u><br><br><b>up,down,left,right</b>: Move the selected points(s) around the stage.  Hold <b>shift</b> to move them around faster.<br><br><b>backspace</b>: Delete the selected points.<br><br><b>Enter</b>: After selecting a point, use Enter to insert a point between the current and next point.";
    private helpArtEdit: string = "<u><b>Art Editor Help:</b></u><br><br>Manually move the points of your art shape to your liking. Double click on a point to add bezier handles for controlling the curves of your shape. To remove handles and simply use straight lines, drag handles into the selected point.<br><br><u>Keyboard Shortcuts:</u><br><br><b>up,down,left,right</b>: Move the selected points(s) around the stage.  Hold <b>shift</b> to move them around faster.<br><br><b>backspace</b>: Delete the selected points.<br><br><b>Enter</b>: After selecting a point, use Enter to insert a point between the current and next point.";

    constructor(param1: Editor, param2: Canvas) {
        super(param1, param2);
        this.currentCanvas = param2;
        this.init();
    }

    private init() {
        this.inputs = new Array();
        this.buttons = new Array();
        this.currentAttributes = new Array();
        this.currentFunctions = new Array();
        this.copiedSelection = new Array();
        this.currentSelection = new Array();
        this.inputHolder = new Sprite();
        this.addChild(this.inputHolder);
        this.inputMask = new Sprite();
        this.addChild(this.inputMask);
        this.inputMask.graphics.beginFill(16711680);
        this.inputMask.graphics.drawRect(0, 0, this.windowWidth, 100);
        this.inputHolder.mask = this.inputMask;
        this.inputHolder.y =
            this.inputMask.y =
            this.holderY =
            this.labelText.y + Math.ceil(this.labelText.height);
    }

    public override activate() {
        super.activate();
        HelpWindow.instance.populate(this.helpMessage);
        this.stage.addEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownCanvasHandler,
        );
        this.stage.addEventListener(
            MouseEvent.DOUBLE_CLICK,
            this.doubleClickHandler,
        );
        this.stage.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
    }

    public override deactivate() {
        var _loc2_: string = null;
        var _loc3_: ColorInput = null;
        this.killTriggerSelector(false);
        this.closePoser();
        var _loc1_: Action = this.deselectAll();
        if (_loc1_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc1_));
        }
        for (_loc2_ in this.inputs) {
            if (this.inputs[_loc2_] instanceof ColorInput) {
                _loc3_ = this.inputs[_loc2_] as ColorInput;
                _loc3_.closeColorSelector();
            }
        }
        this.stage.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownCanvasHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.DOUBLE_CLICK,
            this.doubleClickHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.selectContained,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.createSelectBox,
        );
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.dragShapes);
        this.disableScrolling();
        if (this.selectBox) {
            this._currentCanvas.removeChild(this.selectBox);
            this.selectBox = null;
        }
        super.deactivate();
    }

    public deactivateKeepSelection() {
        var _loc1_: string = null;
        var _loc2_: ColorInput = null;
        this.killTriggerSelector(false);
        this.closePoser();
        for (_loc1_ in this.inputs) {
            if (this.inputs[_loc1_] instanceof ColorInput) {
                _loc2_ = this.inputs[_loc1_] as ColorInput;
                _loc2_.closeColorSelector();
            }
        }
        this.stage.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownCanvasHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.selectContained,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.createSelectBox,
        );
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.dragShapes);
        this.disableScrolling();
        if (this.selectBox) {
            this._currentCanvas.removeChild(this.selectBox);
            this.selectBox = null;
        }
        super.deactivate();
    }

    public override resetActionVars(param1: string) {
        switch (param1) {
            case ActionEvent.TRANSLATE:
                this.scaling = false;
                this.rotating = false;
                break;
            case ActionEvent.SCALE:
                this.translating = false;
                this.rotating = false;
                break;
            case ActionEvent.ROTATE:
                this.scaling = false;
                this.translating = false;
                break;
            default:
                this.translating = false;
                this.scaling = false;
                this.rotating = false;
        }
        if (this.vertEdit) {
            this.vertEdit.translating = false;
        }
    }

    public reverseShape(param1: MouseEvent = null) {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc6_: RefSprite = null;
        var _loc7_: EdgeShape = null;
        var _loc8_: Point = null;
        var _loc9_: Point = null;
        var _loc4_ = int(this.currentSelection.length);
        var _loc5_: number = 0;
        while (_loc5_ < _loc4_) {
            _loc6_ = this.currentSelection[_loc5_] as RefSprite;
            if (_loc6_ instanceof EdgeShape) {
                _loc7_ = _loc6_ as EdgeShape;
                _loc8_ = new Point(_loc7_.x, _loc7_.y);
                _loc7_.reverse();
                _loc9_ = new Point(_loc7_.x, _loc7_.y);
                _loc2_ = new ActionReverseShape(_loc7_, _loc8_, _loc9_);
                if (_loc3_) {
                    _loc3_.nextAction = _loc2_;
                }
                _loc3_ = _loc2_;
            }
            _loc5_++;
        }
        if (_loc3_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc3_));
            this.updateInputValues();
        }
    }

    public resetScale(param1: MouseEvent = null) {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        var _loc7_: RefSprite = null;
        var _loc8_: EdgeShape = null;
        var _loc5_ = int(this.currentSelection.length);
        var _loc6_: number = 0;
        while (_loc6_ < _loc5_) {
            _loc7_ = this.currentSelection[_loc6_] as RefSprite;
            if (_loc7_ instanceof EdgeShape) {
                _loc8_ = _loc7_ as EdgeShape;
                _loc2_ = new ActionProperty(
                    _loc8_,
                    "shapeWidth",
                    _loc8_.shapeWidth,
                    _loc8_.defaultWidth,
                );
                _loc3_ = new ActionProperty(
                    _loc8_,
                    "shapeHeight",
                    _loc8_.shapeHeight,
                    _loc8_.defaultHeight,
                );
                _loc8_.shapeWidth = _loc8_.defaultWidth;
                _loc8_.shapeHeight = _loc8_.defaultHeight;
                _loc2_.nextAction = _loc3_;
                if (_loc4_) {
                    _loc4_.nextAction = _loc2_;
                }
                _loc4_ = _loc3_;
            }
            _loc6_++;
        }
        if (_loc4_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc4_));
            this.updateInputValues();
        }
    }

    private dragShapes(param1: MouseEvent) {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc7_: RefSprite = null;
        var _loc4_: number = this._canvas.mouseX - this.currMouseX;
        var _loc5_: number = this._canvas.mouseY - this.currMouseY;
        this.currMouseX = this._canvas.mouseX;
        this.currMouseY = this._canvas.mouseY;
        var _loc6_: number = 0;
        while (_loc6_ < this.currentSelection.length) {
            _loc7_ = this.currentSelection[_loc6_] as RefSprite;
            if (!this.dragging) {
                _loc2_ = new ActionTranslate(
                    _loc7_,
                    new Point(_loc7_.x, _loc7_.y),
                );
                if (_loc3_) {
                    _loc2_.prevAction = _loc3_;
                }
                _loc3_ = _loc2_;
            }
            _loc7_.x += _loc4_;
            _loc7_.y += _loc5_;
            _loc6_++;
        }
        this.updateInputValues();
        if (!this.dragging) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
            this.dragging = true;
        }
    }

    private createSelectBox(param1: MouseEvent) {
        if (!this.selectBox) {
            this.stage.removeEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
            );
            this.stage.addEventListener(
                MouseEvent.MOUSE_UP,
                this.selectContained,
            );
            this.selectBox = new SelectBoxSprite();
            this._currentCanvas.addChild(this.selectBox);
            this.selectBox.x = this.currMouseX;
            this.selectBox.y = this.currMouseY;
            this.selectBox.mouseEnabled = false;
            // @ts-expect-error
            this.selectBox.blendMode = "invert";
        }
        this.selectBox.scaleX = (this._canvas.mouseX - this.currMouseX) / 100;
        this.selectBox.scaleY = (this._canvas.mouseY - this.currMouseY) / 100;
    }

    private selectContained(param1: MouseEvent) {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc5_: Action = null;
        var _loc6_: RefSprite = null;
        trace("SELECT CONTAINED");
        if (!param1.shiftKey) {
            _loc5_ = this.deselectAll();
        }
        var _loc4_: number = 0;
        while (_loc4_ < this._currentCanvas.shapes.numChildren) {
            _loc6_ = this._currentCanvas.shapes.getChildAt(_loc4_) as RefSprite;
            if (this.selectBox.hitTestObject(_loc6_) && !_loc6_.selected) {
                _loc2_ = this.addToSelection(_loc6_);
                if (_loc3_) {
                    _loc2_.prevAction = _loc3_;
                }
                _loc3_ = _loc2_;
            }
            _loc4_++;
        }
        _loc4_ = 0;
        while (_loc4_ < this._currentCanvas.special.numChildren) {
            _loc6_ = this._currentCanvas.special.getChildAt(
                _loc4_,
            ) as RefSprite;
            if (this.selectBox.hitTestObject(_loc6_) && !_loc6_.selected) {
                _loc2_ = this.addToSelection(_loc6_);
                if (_loc3_) {
                    _loc2_.prevAction = _loc3_;
                }
                _loc3_ = _loc2_;
            }
            _loc4_++;
        }
        if (!(this._currentCanvas instanceof GroupCanvas)) {
            _loc4_ = 0;
            while (_loc4_ < this._currentCanvas.groups.numChildren) {
                _loc6_ = this._currentCanvas.groups.getChildAt(
                    _loc4_,
                ) as RefSprite;
                if (this.selectBox.hitTestObject(_loc6_) && !_loc6_.selected) {
                    _loc2_ = this.addToSelection(_loc6_);
                    if (_loc3_) {
                        _loc2_.prevAction = _loc3_;
                    }
                    _loc3_ = _loc2_;
                }
                _loc4_++;
            }
            _loc4_ = 0;
            while (_loc4_ < this._currentCanvas.joints.numChildren) {
                _loc6_ = this._currentCanvas.joints.getChildAt(
                    _loc4_,
                ) as RefSprite;
                if (this.selectBox.hitTestObject(_loc6_) && !_loc6_.selected) {
                    _loc2_ = this.addToSelection(_loc6_);
                    if (_loc3_) {
                        _loc2_.prevAction = _loc3_;
                    }
                    _loc3_ = _loc2_;
                }
                _loc4_++;
            }
            _loc4_ = 0;
            while (_loc4_ < this._currentCanvas.triggers.numChildren) {
                _loc6_ = this._currentCanvas.triggers.getChildAt(
                    _loc4_,
                ) as RefSprite;
                if (this.selectBox.hitTestObject(_loc6_) && !_loc6_.selected) {
                    _loc2_ = this.addToSelection(_loc6_);
                    if (_loc3_) {
                        _loc2_.prevAction = _loc3_;
                    }
                    _loc3_ = _loc2_;
                }
                _loc4_++;
            }
            _loc6_ = this._currentCanvas.startPlaceHolder;
            if (this.selectBox.hitTestObject(_loc6_) && !_loc6_.selected) {
                _loc2_ = this.addToSelection(_loc6_);
                if (_loc3_) {
                    _loc2_.prevAction = _loc3_;
                }
                _loc3_ = _loc2_;
            }
        }
        if (_loc2_) {
            if (_loc5_) {
                _loc5_.nextAction = _loc2_.firstAction;
            }
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
        } else if (_loc5_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc5_));
        }
        this.setInputs();
        this._currentCanvas.removeChild(this.selectBox);
        this.selectBox = null;
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.selectContained,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.createSelectBox,
        );
    }

    private mouseDownCanvasHandler(param1: MouseEvent) {
        var _loc2_: RefSprite = null;
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        this.currMouseX = this._canvas.mouseX;
        this.currMouseY = this._canvas.mouseY;
        if (param1.target instanceof RefSprite) {
            _loc2_ = param1.target as RefSprite;
            if (!_loc2_.selected) {
                if (!param1.shiftKey) {
                    _loc3_ = this.deselectAll();
                } else {
                    _loc3_ = this.completeEdit();
                }
                _loc4_ = this.addToSelection(_loc2_);
                if (_loc3_) {
                    _loc4_.prevAction = _loc3_;
                }
                this.dispatchEvent(
                    new ActionEvent(ActionEvent.GENERIC, _loc4_),
                );
            } else if (param1.shiftKey) {
                _loc4_ = this.removeFromSelection(_loc2_);
                this.dispatchEvent(
                    new ActionEvent(ActionEvent.GENERIC, _loc4_),
                );
            }
            this.setInputs();
            if (this.currentSelection.length < 1) {
                return;
            }
            this.stage.addEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
            );
            this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.dragShapes);
        } else if (param1.target == this._currentCanvas) {
            this.stage.addEventListener(
                MouseEvent.MOUSE_MOVE,
                this.createSelectBox,
            );
            this.stage.addEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
            );
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: Action = null;
        if (!(param1.target instanceof RefSprite)) {
            if (!param1.shiftKey) {
                _loc2_ = this.deselectAll();
                if (_loc2_) {
                    this.dispatchEvent(
                        new ActionEvent(ActionEvent.GENERIC, _loc2_),
                    );
                }
                this.setInputs();
            }
        }
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.dragShapes);
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.createSelectBox,
        );
        this.dragging = false;
    }

    private doubleClickHandler(param1: MouseEvent) {
        var _loc2_: TextBoxRef = null;
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        var _loc5_: RefGroup = null;
        var _loc6_: GroupCanvas = null;
        var _loc7_: NPCharacterRef = null;
        var _loc8_: EdgeShape = null;
        trace("doubleclick " + (param1.target instanceof ArtShape));
        if (param1.target instanceof TextBoxRef) {
            _loc2_ = param1.target as TextBoxRef;
            _loc3_ = this.deselectAll();
            _loc4_ = this.addToSelection(_loc2_);
            if (_loc3_) {
                _loc4_.prevAction = _loc3_;
            }
            _loc2_.editing = true;
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc4_));
            this.setInputs();
        } else if (param1.target instanceof RefGroup) {
            _loc5_ = param1.target as RefGroup;
            this.openGroupCanvas(_loc5_);
        } else if (param1.target instanceof GroupCanvas) {
            _loc6_ = param1.target as GroupCanvas;
            this.closeGroupCanvas(_loc6_);
        } else if (param1.target instanceof NPCharacterRef) {
            _loc7_ = param1.target as NPCharacterRef;
            this.openPoser(_loc7_);
        } else if (param1.target instanceof EdgeShape) {
            _loc8_ = param1.target as EdgeShape;
            this.openVertEdit(_loc8_);
        }
    }

    private checkAlreadySelected(param1: Sprite): boolean {
        var _loc2_ = int(this.currentSelection.indexOf(param1));
        if (_loc2_ < 0) {
            return false;
        }
        return true;
    }

    private addToSelection(param1: RefSprite): Action {
        var _loc3_: number = 0;
        var _loc4_: number = 0;
        var _loc5_: number = 0;
        var _loc6_: number = 0;
        var _loc7_: RefSprite = null;
        var _loc8_: number = 0;
        param1.selected = true;
        var _loc2_: number = param1.parent.getChildIndex(param1);
        if (param1 instanceof RefShape) {
            if (this.numShapesSelected > 0) {
                _loc3_ = 0;
                _loc4_ = _loc5_ = this.numShapesSelected;
                _loc6_ = _loc3_;
                while (_loc6_ < _loc4_) {
                    _loc7_ = this.currentSelection[_loc6_];
                    _loc8_ = _loc7_.parent.getChildIndex(_loc7_);
                    if (_loc8_ > _loc2_) {
                        _loc5_ = _loc6_;
                        _loc6_ = 100000;
                    }
                    _loc6_++;
                }
            } else {
                _loc5_ = 0;
            }
            this.currentSelection.splice(_loc5_, 0, param1);
            this.numShapesSelected += 1;
        } else if (param1 instanceof Special) {
            if (this.numSpecialsSelected > 0) {
                _loc3_ = this.numShapesSelected;
                _loc4_ = _loc5_ =
                    this.numShapesSelected + this.numSpecialsSelected;
                _loc6_ = _loc3_;
                while (_loc6_ < _loc4_) {
                    _loc7_ = this.currentSelection[_loc6_];
                    _loc8_ = _loc7_.parent.getChildIndex(_loc7_);
                    if (_loc8_ > _loc2_) {
                        _loc5_ = _loc6_;
                        _loc6_ = 100000;
                    }
                    _loc6_++;
                }
            } else {
                _loc5_ = this.numShapesSelected;
            }
            this.currentSelection.splice(_loc5_, 0, param1);
            this.numSpecialsSelected += 1;
        } else if (param1 instanceof RefGroup) {
            if (this.numGroupsSelected > 0) {
                _loc3_ = this.numShapesSelected + this.numSpecialsSelected;
                _loc4_ = _loc5_ =
                    this.numShapesSelected +
                    this.numSpecialsSelected +
                    this.numGroupsSelected;
                _loc6_ = _loc3_;
                while (_loc6_ < _loc4_) {
                    _loc7_ = this.currentSelection[_loc6_];
                    _loc8_ = _loc7_.parent.getChildIndex(_loc7_);
                    if (_loc8_ > _loc2_) {
                        _loc5_ = _loc6_;
                        _loc6_ = 100000;
                    }
                    _loc6_++;
                }
            } else {
                _loc5_ = this.numShapesSelected + this.numSpecialsSelected;
            }
            this.currentSelection.splice(_loc5_, 0, param1);
            this.numGroupsSelected += 1;
        } else if (param1 instanceof RefJoint) {
            if (this.numJointsSelected > 0) {
                _loc3_ =
                    this.numShapesSelected +
                    this.numSpecialsSelected +
                    this.numGroupsSelected;
                _loc4_ = _loc5_ =
                    this.numShapesSelected +
                    this.numSpecialsSelected +
                    this.numGroupsSelected +
                    this.numJointsSelected;
                _loc6_ = _loc3_;
                while (_loc6_ < _loc4_) {
                    _loc7_ = this.currentSelection[_loc6_];
                    _loc8_ = _loc7_.parent.getChildIndex(_loc7_);
                    if (_loc8_ > _loc2_) {
                        _loc5_ = _loc6_;
                        _loc6_ = 100000;
                    }
                    _loc6_++;
                }
            } else {
                _loc5_ =
                    this.numShapesSelected +
                    this.numSpecialsSelected +
                    this.numGroupsSelected;
            }
            this.currentSelection.splice(_loc5_, 0, param1);
            this.numJointsSelected += 1;
        } else if (param1 instanceof RefTrigger) {
            if (this.numTriggersSelected > 0) {
                _loc3_ =
                    this.numShapesSelected +
                    this.numSpecialsSelected +
                    this.numGroupsSelected +
                    this.numJointsSelected;
                _loc4_ = _loc5_ =
                    this.numShapesSelected +
                    this.numSpecialsSelected +
                    this.numGroupsSelected +
                    this.numJointsSelected +
                    this.numTriggersSelected;
                _loc6_ = _loc3_;
                while (_loc6_ < _loc4_) {
                    _loc7_ = this.currentSelection[_loc6_];
                    _loc8_ = _loc7_.parent.getChildIndex(_loc7_);
                    if (_loc8_ > _loc2_) {
                        _loc5_ = _loc6_;
                        _loc6_ = 100000;
                    }
                    _loc6_++;
                }
            } else {
                _loc5_ =
                    this.numShapesSelected +
                    this.numSpecialsSelected +
                    this.numGroupsSelected +
                    this.numJointsSelected;
            }
            this.currentSelection.splice(_loc5_, 0, param1);
            this.numTriggersSelected += 1;
        } else {
            if (!(param1 instanceof StartPlaceHolder)) {
                throw new Error("What the fu");
            }
            _loc5_ = int(this.currentSelection.length);
            this.currentSelection.splice(_loc5_, 0, param1);
            this.numCharSelected += 1;
        }
        return new ActionSelect(param1, this.currentSelection, _loc5_, this);
    }

    private getNumSelectedOfType(param1) {
        var _loc5_: RefSprite = null;
        var _loc2_: number = 0;
        var _loc3_: number = 0;
        var _loc4_: number = 0;
        while (_loc4_ < this.currentSelection.length) {
            _loc5_ = this.currentSelection[_loc4_];
            if (_loc5_ instanceof param1) {
                _loc2_ += 1;
            }
            _loc4_++;
        }
    }

    private removeFromSelection(param1: RefSprite): Action {
        var _loc4_: TextBoxRef = null;
        var _loc5_: ActionProperty = null;
        var _loc2_ = int(this.currentSelection.indexOf(param1));
        if (param1 instanceof RefShape) {
            --this.numShapesSelected;
        } else if (param1 instanceof Special) {
            --this.numSpecialsSelected;
            if (param1 instanceof TextBoxRef) {
                _loc4_ = param1 as TextBoxRef;
                if (_loc4_.editing) {
                    _loc5_ = new ActionProperty(
                        _loc4_,
                        "caption",
                        _loc4_.caption,
                        _loc4_.currentText,
                    );
                    _loc4_.caption = _loc4_.currentText;
                    _loc4_.editing = false;
                }
            }
        } else if (param1 instanceof RefGroup) {
            --this.numGroupsSelected;
        } else if (param1 instanceof RefJoint) {
            --this.numJointsSelected;
        } else if (param1 instanceof RefTrigger) {
            --this.numTriggersSelected;
        } else {
            if (!(param1 instanceof StartPlaceHolder)) {
                throw new Error("tried to Deselect this... what is it");
            }
            --this.numCharSelected;
        }
        param1.selected = false;
        this.currentSelection.splice(_loc2_, 1);
        var _loc3_: Action = new ActionDeselect(
            param1,
            this.currentSelection,
            _loc2_,
            this,
        );
        if (_loc5_) {
            _loc3_.prevAction = _loc5_;
        }
        return _loc3_;
    }

    private deselectAll(): Action {
        var _loc1_: Action = null;
        var _loc2_: Action = null;
        var _loc4_: RefSprite = null;
        trace("deselectAll");
        var _loc3_ = int(this.currentSelection.length - 1);
        while (_loc3_ > -1) {
            _loc4_ = this.currentSelection[_loc3_];
            _loc1_ = this.removeFromSelection(_loc4_);
            if (_loc2_) {
                _loc2_.nextAction = _loc1_.firstAction;
            }
            _loc2_ = _loc1_;
            _loc3_--;
        }
        this.setInputs();
        return _loc1_;
    }

    private deleteSelection(): Action {
        var _loc1_: Action = null;
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc5_: RefSprite = null;
        if (this.currentSelection.length == 0) {
            return null;
        }
        trace("DELETE SELECTION");
        var _loc4_ = int(this.currentSelection.length - 1);
        while (_loc4_ > -1) {
            _loc5_ = this.currentSelection[_loc4_];
            _loc2_ = this.removeFromSelection(_loc5_);
            if (_loc3_) {
                _loc3_.nextAction = _loc2_.firstAction;
            }
            _loc3_ = _loc2_;
            if (_loc5_.deletable) {
                _loc1_ = _loc5_.deleteSelf(this._currentCanvas);
                if (_loc1_) {
                    _loc2_.nextAction = _loc1_.firstAction;
                    _loc3_ = _loc1_;
                }
            }
            _loc4_--;
        }
        this._canvas.relabelTriggers();
        this.currentSelection.splice(0, this.currentSelection.length);
        return _loc3_;
    }

    public editSelectText(param1: TextBoxRef) {
        var _loc2_: Action = this.addToSelection(param1);
        param1.editing = true;
        param1.selectAllText();
        this.setInputs();
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
    }

    private completeEdit(): Action {
        var _loc2_: TextBoxRef = null;
        var _loc3_: ActionProperty = null;
        var _loc1_ = int(this.currentSelection.length - 1);
        while (_loc1_ > -1) {
            if (this.currentSelection[_loc1_] instanceof TextBoxRef) {
                _loc2_ = this.currentSelection[_loc1_] as TextBoxRef;
                _loc3_ = new ActionProperty(
                    _loc2_,
                    "caption",
                    _loc2_.caption,
                    _loc2_.currentText,
                );
                _loc2_.caption = _loc2_.currentText;
                _loc2_.editing = false;
                return _loc3_;
            }
            _loc1_--;
        }
        return null;
    }

    public beginTriggerSelector(param1: RefTrigger = null) {
        var _loc3_: Action = null;
        var _loc4_: RefTrigger = null;
        this.stage.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownCanvasHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.DOUBLE_CLICK,
            this.doubleClickHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.selectContained,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.createSelectBox,
        );
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.dragShapes);
        if (param1) {
            _loc3_ = this.addToSelection(param1);
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc3_));
        }
        var _loc2_: number = 0;
        while (_loc2_ < this.currentSelection.length) {
            _loc4_ = this.currentSelection[_loc2_];
            _loc4_.addingTargets = true;
            _loc2_++;
        }
        this.setInputs();
        this.trigSelector = new TrigSelector(
            this.currentSelection,
            this.canvas,
        );
        this.trigSelector.addEventListener(
            ActionEvent.GENERIC,
            this.triggerSelectorHandler,
        );
        this.trigSelector.addEventListener(
            TrigSelector.SELECT_COMPLETE,
            this.triggerSelectorComplete,
        );
    }

    private triggerSelectorHandler(param1: ActionEvent) {
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, param1.action));
    }

    private triggerSelectorComplete(param1: Event) {
        this.killTriggerSelector();
        this.setInputs();
    }

    public killTriggerSelector(param1: boolean = true) {
        var _loc2_: number = 0;
        var _loc3_: RefTrigger = null;
        if (this.trigSelector) {
            this.trigSelector.removeEventListener(
                ActionEvent.GENERIC,
                this.triggerSelectorHandler,
            );
            this.trigSelector.removeEventListener(
                TrigSelector.SELECT_COMPLETE,
                this.triggerSelectorComplete,
            );
            this.trigSelector.die();
            this.trigSelector = null;
            _loc2_ = 0;
            while (_loc2_ < this.currentSelection.length) {
                _loc3_ = this.currentSelection[_loc2_];
                _loc3_.addingTargets = false;
                _loc2_++;
            }
            if (param1) {
                this.stage.addEventListener(
                    MouseEvent.MOUSE_DOWN,
                    this.mouseDownCanvasHandler,
                );
                this.stage.addEventListener(
                    MouseEvent.DOUBLE_CLICK,
                    this.doubleClickHandler,
                );
                this.stage.addEventListener(
                    KeyboardEvent.KEY_DOWN,
                    this.keyDownHandler,
                );
            }
        }
    }

    private keyDownHandler(param1: KeyboardEvent) {
        var _loc2_: Action = null;
        if (param1.target instanceof TextField) {
            return;
        }
        switch (param1.keyCode) {
            case 8:
                _loc2_ = this.deleteSelection();
                if (_loc2_) {
                    this.dispatchEvent(
                        new ActionEvent(ActionEvent.GENERIC, _loc2_),
                    );
                }
                this.setInputs();
                break;
            case 37:
                this.moveSelected(-1, 0, param1.shiftKey);
                break;
            case 38:
                if (param1.ctrlKey) {
                    this.raiseDepthSelected();
                } else {
                    this.moveSelected(0, -1, param1.shiftKey);
                }
                break;
            case 39:
                this.moveSelected(1, 0, param1.shiftKey);
                break;
            case 40:
                if (param1.ctrlKey) {
                    this.lowerDepthSelected();
                } else {
                    this.moveSelected(0, 1, param1.shiftKey);
                }
                break;
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
                break;
            case 67:
                this.copySelected();
                break;
            case 86:
                this.paste(param1.shiftKey);
                break;
            case 71:
                break;
            default:
                return;
        }
    }

    private groupSelected(param1: MouseEvent = null) {
        var _loc2_ = new RefGroup();
        var _loc3_: Action = _loc2_.build(this.currentSelection, this._canvas);
        var _loc4_: Action = this.deselectAll();
        _loc3_.nextAction = _loc4_.firstAction;
        this._canvas.addRefSprite(_loc2_);
        var _loc5_: Action = new ActionAdd(
            _loc2_,
            this._canvas,
            _loc2_.parent.getChildIndex(_loc2_),
        );
        _loc4_.nextAction = _loc5_;
        var _loc6_: Action = this.addToSelection(_loc2_);
        _loc5_.nextAction = _loc6_;
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc6_));
        this.setInputs();
    }

    private breakSelectedGroups(param1: MouseEvent = null) {
        var _loc4_: Action = null;
        var _loc5_: Action = null;
        var _loc7_: RefGroup = null;
        var _loc8_: RefSprite = null;
        var _loc2_ = new Array();
        var _loc3_ = new Array();
        var _loc6_: number = 0;
        while (_loc6_ < this.currentSelection.length) {
            _loc3_.push(this.currentSelection[_loc6_]);
            _loc6_++;
        }
        _loc5_ = _loc4_ = this.deleteSelection();
        _loc6_ = 0;
        while (_loc6_ < _loc3_.length) {
            _loc7_ = _loc3_[_loc6_];
            _loc4_ = _loc7_.breakApart(_loc2_, this._canvas);
            _loc5_.nextAction = _loc4_.firstAction;
            _loc5_ = _loc4_;
            _loc6_++;
        }
        _loc6_ = 0;
        while (_loc6_ < _loc2_.length) {
            _loc8_ = _loc2_[_loc6_];
            _loc4_ = this.addToSelection(_loc8_);
            _loc5_.nextAction = _loc4_;
            _loc5_ = _loc4_;
            _loc6_++;
        }
        this.setInputs();
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc4_));
    }

    private openGroupCanvas(param1: RefGroup) {
        var _loc2_: Action = this.deselectAll();
        var _loc3_: number = param1.parent.getChildIndex(param1);
        this._canvas.removeRefSprite(param1);
        var _loc4_ = new ActionDelete(param1, this._canvas, _loc3_);
        _loc2_.nextAction = _loc4_;
        var _loc5_ = new GroupCanvas(param1, this._canvas, _loc3_);
        this._canvas.parent.addChild(_loc5_);
        var _loc6_ = new ActionOpenGroup(_loc5_, _loc5_.parent, this);
        _loc6_.prevAction = _loc4_;
        var _loc7_ = new Array();
        var _loc8_: Action = param1.breakApart(_loc7_, _loc5_);
        _loc6_.nextAction = _loc8_.firstAction;
        this.currentCanvas = _loc5_;
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc8_));
    }

    private closeGroupCanvas(param1: GroupCanvas) {
        var _loc9_: RefSprite = null;
        var _loc10_: Action = null;
        var _loc11_: Action = null;
        var _loc2_: RefGroup = param1.refGroup;
        var _loc3_ = new Array();
        var _loc4_: number = 0;
        while (_loc4_ < param1.shapes.numChildren) {
            _loc9_ = param1.shapes.getChildAt(_loc4_) as RefSprite;
            _loc3_.push(_loc9_);
            _loc4_++;
        }
        _loc4_ = 0;
        while (_loc4_ < param1.special.numChildren) {
            _loc9_ = param1.special.getChildAt(_loc4_) as RefSprite;
            _loc3_.push(_loc9_);
            _loc4_++;
        }
        var _loc5_: Action = _loc2_.rebuild(_loc3_, param1, false);
        var _loc6_: Action = new ActionCloseGroup(param1, param1.parent, this);
        param1.parent.removeChild(param1);
        this.currentCanvas = this._canvas;
        var _loc7_ = new ActionAdd(_loc2_, this._canvas, param1.groupIndex);
        this._canvas.addRefSpriteAt(_loc2_, param1.groupIndex);
        var _loc8_: Action = this.addToSelection(_loc2_);
        if (_loc5_) {
            _loc5_.nextAction = _loc6_;
            _loc6_.nextAction = _loc7_;
            _loc7_.nextAction = _loc8_;
            _loc10_ = _loc8_;
        } else {
            _loc11_ = this.deleteSelection();
            _loc6_.nextAction = _loc7_;
            _loc7_.nextAction = _loc8_;
            _loc8_.nextAction = _loc11_.firstAction;
            _loc10_ = _loc11_;
        }
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc10_));
        this.setInputs();
        Settings.debugText.text = "";
    }

    private openPoser(param1: NPCharacterRef) {
        var _loc2_: Action = this.deselectAll();
        this.poser = new Poser(param1);
        this._canvas.parent.addChild(this.poser);
        this.poser.addEventListener(ActionEvent.GENERIC, this.poserHandler);
        this.poser.addEventListener(Poser.POSE_COMPLETE, this.closePoser);
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
    }

    private poserHandler(param1: ActionEvent) {
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, param1.action));
    }

    public closePoser(param1: Event = null) {
        if (this.poser) {
            this.poser.removeEventListener(
                ActionEvent.GENERIC,
                this.poserHandler,
            );
            this.poser.removeEventListener(
                Poser.POSE_COMPLETE,
                this.closePoser,
            );
            this.poser.die();
            this.poser = null;
            Settings.debugText.text = "";
        }
    }

    public openVertEdit(param1: EdgeShape, param2: boolean = true) {
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        if (param2) {
            _loc3_ = this.deselectAll();
            _loc4_ = new ActionOpenVertEdit(param1, this);
            if (_loc3_) {
                _loc3_.nextAction = _loc4_;
            }
        }
        this.vertEdit = new VertEdit(param1, this._currentCanvas);
        this._canvas.parent.addChild(this.vertEdit);
        this.vertEdit.addEventListener(
            ActionEvent.GENERIC,
            this.vertEditHandler,
        );
        this.vertEdit.addEventListener(
            VertEdit.EDIT_COMPLETE,
            this.closeVertEdit,
        );
        if (param2) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc4_));
        }
        if (param1 instanceof ArtShape) {
            HelpWindow.instance.populate(this.helpArtEdit);
        } else {
            HelpWindow.instance.populate(this.helpPolyEdit);
        }
    }

    private vertEditHandler(param1: ActionEvent) {
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, param1.action));
    }

    public closeVertEdit(param1: Event = null, param2: boolean = true) {
        var _loc3_: EdgeShape = null;
        var _loc4_: Action = null;
        var _loc5_: Action = null;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: Action = null;
        if (this.vertEdit) {
            _loc3_ = this.vertEdit.edgeShape;
            if (param2) {
                _loc4_ = this.vertEdit.deselectAll();
                _loc5_ = new ActionCloseVertEdit(_loc3_, this);
                if (_loc4_) {
                    _loc4_.nextAction = _loc5_;
                }
            }
            this.vertEdit.removeEventListener(
                ActionEvent.GENERIC,
                this.vertEditHandler,
            );
            this.vertEdit.removeEventListener(
                VertEdit.EDIT_COMPLETE,
                this.closeVertEdit,
            );
            this.vertEdit.die();
            this.vertEdit = null;
            Settings.debugText.text = "";
            if (param2) {
                _loc6_ = _loc3_.x;
                _loc7_ = _loc3_.y;
                _loc3_.x = _loc6_;
                _loc3_.y = _loc7_;
                _loc8_ = _loc5_;
                if (_loc3_.x != _loc6_ || _loc3_.y != _loc7_) {
                    _loc8_ = new ActionTranslateUnbound(
                        _loc3_,
                        new Point(_loc6_, _loc7_),
                        new Point(_loc3_.x, _loc3_.y),
                    );
                    _loc5_.nextAction = _loc8_;
                }
                this.dispatchEvent(
                    new ActionEvent(ActionEvent.GENERIC, _loc8_),
                );
            }
        }
        HelpWindow.instance.populate(this.helpMessage);
    }

    public vertEditOpen(): boolean {
        if (this.vertEdit) {
            return true;
        }
        return false;
    }

    public override resizeElements() {
        if (this.vertEdit) {
            this.vertEdit.resizeVerts();
        }
    }

    private copySelected() {
        var _loc2_: RefSprite = null;
        var _loc3_: RefSprite = null;
        var _loc4_: RefJoint = null;
        var _loc5_: RefJoint = null;
        var _loc6_: number = 0;
        var _loc7_: RefTrigger = null;
        var _loc8_: RefTrigger = null;
        var _loc9_: any[] = null;
        var _loc10_: any[] = null;
        var _loc11_: number = 0;
        var _loc12_: number = 0;
        var _loc13_: RefSprite = null;
        var _loc14_: RefSprite = null;
        var _loc15_: string = null;
        var _loc16_: Dictionary<any, any> = null;
        var _loc17_: any[] = null;
        var _loc18_ = undefined;
        var _loc19_: number = 0;
        trace("copy");
        if (this.currentSelection.length == 0) {
            return;
        }
        this.copiedSelection = new Array();
        var _loc1_: number = 0;
        while (_loc1_ < this.currentSelection.length) {
            _loc2_ = this.currentSelection[_loc1_] as RefSprite;
            _loc3_ = null;
            if (_loc2_.cloneable) {
                _loc3_ = _loc2_.clone();
                if (_loc3_ instanceof RefJoint) {
                    _loc4_ = _loc2_ as RefJoint;
                    _loc5_ = _loc3_ as RefJoint;
                    if (_loc4_.body1) {
                        _loc6_ = int(
                            this.currentSelection.indexOf(_loc4_.body1),
                        );
                        _loc5_.body1 =
                            _loc6_ > -1
                                ? this.copiedSelection[_loc6_]
                                : _loc4_.body1;
                    }
                    if (_loc4_.body2) {
                        _loc6_ = int(
                            this.currentSelection.indexOf(_loc4_.body2),
                        );
                        _loc5_.body2 =
                            _loc6_ > -1
                                ? this.copiedSelection[_loc6_]
                                : _loc4_.body2;
                    }
                    if (!_loc5_.body1 && !_loc5_.body2) {
                        _loc3_ = null;
                    }
                }
            }
            this.copiedSelection.push(_loc3_);
            _loc1_++;
        }
        _loc1_ = 0;
        while (_loc1_ < this.currentSelection.length) {
            _loc2_ = this.currentSelection[_loc1_];
            _loc3_ = this.copiedSelection[_loc1_];
            if (_loc2_ instanceof RefTrigger && Boolean(_loc3_)) {
                _loc7_ = _loc2_ as RefTrigger;
                _loc8_ = _loc3_ as RefTrigger;
                _loc9_ = _loc7_.targets;
                _loc10_ = _loc8_.cloneTargets;
                _loc11_ = int(_loc9_.length);
                _loc12_ = 0;
                while (_loc12_ < _loc11_) {
                    _loc13_ = _loc9_[_loc12_];
                    _loc6_ = int(this.currentSelection.indexOf(_loc13_));
                    _loc14_ =
                        _loc6_ > -1 ? this.copiedSelection[_loc6_] : _loc13_;
                    _loc10_[_loc12_] = _loc14_;
                    trace("addedtarget " + _loc14_);
                    for (_loc15_ in _loc14_.keyedPropertyObject) {
                        trace("prop " + _loc15_);
                        _loc16_ = _loc14_.keyedPropertyObject[_loc15_];
                        if (_loc16_) {
                            if (_loc16_.get(_loc7_)) {
                                trace("val 1: " + _loc16_.get(_loc7_));
                                _loc17_ = _loc16_.get(_loc7_);
                                _loc18_ = new Array();
                                _loc19_ = 0;
                                while (_loc19_ < _loc17_.length) {
                                    _loc18_.push(_loc17_[_loc19_]);
                                    _loc19_++;
                                }
                                _loc16_.set(_loc8_, _loc18_);
                                trace("val 2: " + _loc16_.get(_loc8_));
                            }
                        }
                    }
                    _loc12_++;
                }
            }
            _loc1_++;
        }
        trace("current selection " + this.currentSelection);
        trace("copied selection " + this.copiedSelection);
    }

    private paste(param1: boolean = false) {
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        var _loc5_: Action = null;
        var _loc6_: number = 0;
        var _loc7_: RefSprite = null;
        var _loc8_: RefSprite = null;
        var _loc9_: RefJoint = null;
        var _loc10_: RefJoint = null;
        var _loc11_: number = 0;
        var _loc12_: RefSprite = null;
        var _loc13_: RefTrigger = null;
        var _loc14_: RefTrigger = null;
        var _loc15_: number = 0;
        var _loc16_: any[] = null;
        var _loc17_: number = 0;
        var _loc18_: number = 0;
        var _loc19_: RefSprite = null;
        var _loc20_: RefSprite = null;
        var _loc21_: Action = null;
        var _loc22_: string = null;
        var _loc23_: Dictionary<any, any> = null;
        var _loc24_: GroupCanvas = null;
        trace("paste");
        if (this.copiedSelection.length == 0) {
            return;
        }
        var _loc2_: Action = this.deselectAll();
        if (!(this._currentCanvas instanceof GroupCanvas)) {
            _loc6_ = 0;
            while (_loc6_ < this.copiedSelection.length) {
                if (this.copiedSelection[_loc6_]) {
                    _loc7_ = this.copiedSelection[_loc6_];
                    _loc8_ = _loc7_.clone();
                    if (
                        _loc8_ instanceof RefShape ||
                        _loc8_ instanceof Special ||
                        _loc8_ instanceof RefGroup ||
                        _loc8_ instanceof RefTrigger
                    ) {
                        this._currentCanvas.addRefSprite(_loc8_);
                        trace("PARENT " + _loc8_.parent);
                        _loc8_.x = _loc8_.x;
                        _loc8_.y = _loc8_.y;
                        _loc4_ = new ActionAdd(
                            _loc8_,
                            this._currentCanvas,
                            _loc8_.parent.getChildIndex(_loc8_),
                        );
                        _loc3_ = this.addToSelection(_loc8_);
                        _loc4_.nextAction = _loc3_;
                        if (_loc2_) {
                            _loc2_.nextAction = _loc4_;
                        }
                        _loc2_ = _loc3_;
                    } else {
                        if (!(_loc8_ instanceof RefJoint)) {
                            throw new Error("clone is unknown type or null");
                        }
                        this._currentCanvas.addRefSprite(_loc8_);
                        _loc8_.x = _loc8_.x;
                        _loc8_.y = _loc8_.y;
                        _loc3_ = this.addToSelection(_loc8_);
                        _loc4_ = new ActionAdd(
                            _loc8_,
                            this._currentCanvas,
                            _loc8_.parent.getChildIndex(_loc8_),
                        );
                        _loc4_.nextAction = _loc3_;
                        if (_loc2_) {
                            _loc2_.nextAction = _loc4_;
                        }
                        _loc2_ = _loc3_;
                        _loc9_ = _loc7_ as RefJoint;
                        _loc10_ = _loc8_ as RefJoint;
                        if (_loc9_.body1) {
                            _loc11_ = int(
                                this.copiedSelection.indexOf(_loc9_.body1),
                            );
                            _loc12_ =
                                _loc11_ > -1
                                    ? this.currentSelection[_loc11_]
                                    : _loc9_.body1;
                            _loc10_.body1 = _loc12_;
                            _loc5_ = new ActionProperty(
                                _loc10_,
                                "body1",
                                null,
                                _loc12_,
                            );
                            _loc2_.nextAction = _loc5_;
                            _loc2_ = _loc5_;
                        }
                        if (_loc9_.body2) {
                            _loc11_ = int(
                                this.copiedSelection.indexOf(_loc9_.body2),
                            );
                            _loc12_ =
                                _loc11_ > -1
                                    ? this.currentSelection[_loc11_]
                                    : _loc9_.body2;
                            _loc10_.body2 = _loc12_;
                            _loc5_ = new ActionProperty(
                                _loc10_,
                                "body2",
                                null,
                                _loc12_,
                            );
                            _loc2_.nextAction = _loc5_;
                            _loc2_ = _loc5_;
                        }
                        _loc10_.x = _loc10_.x;
                    }
                }
                _loc6_++;
            }
            _loc6_ = 0;
            while (_loc6_ < this.copiedSelection.length) {
                if (this.copiedSelection[_loc6_]) {
                    _loc7_ = this.copiedSelection[_loc6_];
                    _loc8_ = this.currentSelection[_loc6_];
                    if (_loc7_ instanceof RefTrigger) {
                        _loc13_ = _loc7_ as RefTrigger;
                        _loc14_ = _loc8_ as RefTrigger;
                        _loc15_ = _loc14_.parent.getChildIndex(_loc14_);
                        _loc14_.setNumLabel(_loc15_ + 1);
                        _loc16_ = _loc13_.cloneTargets;
                        _loc17_ = int(_loc16_.length);
                        _loc18_ = 0;
                        while (_loc18_ < _loc17_) {
                            _loc19_ = _loc16_[_loc18_];
                            _loc11_ = int(
                                this.copiedSelection.indexOf(_loc19_),
                            );
                            _loc20_ =
                                _loc11_ > -1
                                    ? this.currentSelection[_loc11_]
                                    : _loc19_;
                            _loc21_ = _loc14_.addTarget(_loc20_);
                            _loc2_.nextAction = _loc21_;
                            _loc2_ = _loc21_;
                            for (_loc22_ in _loc20_.keyedPropertyObject) {
                                _loc23_ = _loc20_.keyedPropertyObject[_loc22_];
                                if (_loc23_) {
                                    if (_loc23_.get(_loc13_)) {
                                        _loc23_.set(_loc14_, _loc23_.get(_loc13_));
                                    }
                                }
                            }
                            _loc20_.setAttributes();
                            _loc18_++;
                        }
                        _loc14_.x = _loc14_.x;
                    }
                }
                _loc6_++;
            }
        } else {
            _loc24_ = this._currentCanvas as GroupCanvas;
            _loc6_ = 0;
            while (_loc6_ < this.copiedSelection.length) {
                if (this.copiedSelection[_loc6_]) {
                    _loc7_ = this.copiedSelection[_loc6_];
                    _loc8_ = _loc7_.clone();
                    if (
                        (_loc8_ instanceof RefShape ||
                            _loc8_ instanceof Special) &&
                        _loc8_.groupable
                    ) {
                        this._currentCanvas.addRefSprite(_loc8_);
                        _loc8_.x = _loc8_.x;
                        _loc8_.y = _loc8_.y;
                        _loc8_.inGroup = true;
                        _loc8_.group = _loc24_.refGroup;
                        _loc8_.setFilters();
                        _loc4_ = new ActionAdd(
                            _loc8_,
                            this._currentCanvas,
                            _loc8_.parent.getChildIndex(_loc8_),
                        );
                        _loc3_ = this.addToSelection(_loc8_);
                        _loc4_.nextAction = _loc3_;
                        if (_loc2_) {
                            _loc2_.nextAction = _loc4_;
                        }
                        _loc2_ = _loc3_;
                    }
                }
                _loc6_++;
            }
        }
        this.setInputs();
        if (_loc2_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
        }
        if (!param1) {
            this.centerSelected();
        }
    }

    private centerSelected() {
        if (this.currentSelection.length == 0) {
            return;
        }
        var _loc1_: RefSprite = this.currentSelection[0];
        var _loc2_: Rectangle = _loc1_.getBounds(this._currentCanvas);
        var _loc3_: number = 1;
        while (_loc3_ < this.currentSelection.length) {
            _loc1_ = this.currentSelection[_loc3_];
            _loc2_ = _loc2_.union(_loc1_.getBounds(this._currentCanvas));
            _loc3_++;
        }
        var _loc4_ = new Point(
            this.stage.stageWidth / 2,
            this.stage.stageHeight / 2,
        );
        _loc4_ = this._currentCanvas.globalToLocal(_loc4_);
        var _loc5_: number = _loc4_.x - (_loc2_.x + _loc2_.width / 2);
        var _loc6_: number = _loc4_.y - (_loc2_.y + _loc2_.height / 2);
        _loc3_ = 0;
        while (_loc3_ < this.currentSelection.length) {
            _loc1_ = this.currentSelection[_loc3_];
            _loc1_.x += _loc5_;
            _loc1_.y += _loc6_;
            _loc3_++;
        }
    }

    private moveSelected(param1: number, param2: number, param3: boolean) {
        var _loc4_: Action = null;
        var _loc5_: Action = null;
        var _loc7_: RefSprite = null;
        if (this.dragging) {
            return;
        }
        if (this.currentSelection.length == 0) {
            return;
        }
        if (param3) {
            param1 *= 10;
            param2 *= 10;
        }
        param1 *= 1 / this._canvas.parent.scaleX;
        param2 *= 1 / this._canvas.parent.scaleY;
        var _loc6_: number = 0;
        while (_loc6_ < this.currentSelection.length) {
            _loc7_ = this.currentSelection[_loc6_] as RefSprite;
            if (!this.translating) {
                _loc4_ = new ActionTranslate(
                    _loc7_,
                    new Point(_loc7_.x, _loc7_.y),
                );
                if (_loc5_) {
                    _loc4_.prevAction = _loc5_;
                }
                _loc5_ = _loc4_;
            }
            _loc7_.x += param1;
            _loc7_.y += param2;
            _loc6_++;
        }
        this.updateInputValues();
        if (!this.translating && Boolean(_loc5_)) {
            this.dispatchEvent(new ActionEvent(ActionEvent.TRANSLATE, _loc4_));
            this.translating = true;
        }
    }

    private raiseDepthSelected() {
        var _loc1_: ActionDepth = null;
        var _loc2_: ActionDepth = null;
        var _loc3_: DisplayObjectContainer = null;
        var _loc4_: number = 0;
        var _loc5_: number = 0;
        var _loc6_: boolean = false;
        var _loc8_: RefSprite = null;
        var _loc9_: DisplayObjectContainer = null;
        var _loc10_: number = 0;
        var _loc11_: number = 0;
        if (this.dragging) {
            return;
        }
        if (this.currentSelection.length == 0) {
            return;
        }
        var _loc7_ = int(this.currentSelection.length - 1);
        while (_loc7_ > -1) {
            _loc8_ = this.currentSelection[_loc7_] as RefSprite;
            _loc9_ = _loc8_.parent;
            if (_loc8_ instanceof RefTrigger) {
                _loc6_ = true;
            }
            if (_loc9_ != _loc3_) {
                _loc4_ = 10000000;
                _loc3_ = _loc9_;
                _loc5_ = _loc9_.numChildren;
            }
            _loc10_ = _loc9_.getChildIndex(_loc8_);
            _loc11_ = _loc10_ + 1;
            if (_loc11_ < _loc5_ && _loc11_ < _loc4_) {
                _loc9_.addChildAt(_loc8_, _loc11_);
                _loc1_ = new ActionDepth(_loc8_, _loc9_, _loc11_, _loc10_);
                if (_loc2_) {
                    _loc2_.nextAction = _loc1_;
                }
                _loc2_ = _loc1_;
                _loc4_ = _loc11_;
            } else {
                _loc4_ = _loc10_;
            }
            _loc7_--;
        }
        if (_loc6_) {
            this._canvas.relabelTriggers();
        }
        if (_loc1_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.DEPTH, _loc1_));
        }
    }

    private lowerDepthSelected() {
        var _loc1_: ActionDepth = null;
        var _loc2_: ActionDepth = null;
        var _loc3_: DisplayObjectContainer = null;
        var _loc4_: number = 0;
        var _loc5_: boolean = false;
        var _loc7_: RefSprite = null;
        var _loc8_: DisplayObjectContainer = null;
        var _loc9_: number = 0;
        var _loc10_: number = 0;
        if (this.dragging) {
            return;
        }
        if (this.currentSelection.length == 0) {
            return;
        }
        var _loc6_: number = 0;
        while (_loc6_ < this.currentSelection.length) {
            _loc7_ = this.currentSelection[_loc6_] as RefSprite;
            if (_loc7_ instanceof RefTrigger) {
                _loc5_ = true;
            }
            _loc8_ = _loc7_.parent;
            if (_loc8_ != _loc3_) {
                _loc4_ = -1;
                _loc3_ = _loc8_;
            }
            _loc9_ = _loc8_.getChildIndex(_loc7_);
            _loc10_ = _loc9_ - 1;
            if (_loc10_ < _loc9_ && _loc10_ > _loc4_) {
                _loc8_.addChildAt(_loc7_, _loc10_);
                _loc1_ = new ActionDepth(_loc7_, _loc8_, _loc10_, _loc9_);
                if (_loc2_) {
                    _loc2_.nextAction = _loc1_;
                }
                _loc2_ = _loc1_;
                _loc4_ = _loc10_;
            } else {
                _loc4_ = _loc9_;
            }
            _loc6_++;
        }
        if (_loc5_) {
            this._canvas.relabelTriggers();
        }
        if (_loc1_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.DEPTH, _loc1_));
        }
    }

    private adjustScale(param1: number, param2: number, param3: boolean) {
        var _loc4_: Action = null;
        var _loc5_: Action = null;
        var _loc6_: Action = null;
        var _loc8_: RefSprite = null;
        if (this.currentSelection.length == 0) {
            return;
        }
        if (param3) {
            param1 *= 10;
            param2 *= 10;
        }
        var _loc7_: number = 0;
        while (_loc7_ < this.currentSelection.length) {
            _loc8_ = this.currentSelection[_loc7_];
            if (_loc8_.scalable) {
                if (!this.scaling) {
                    _loc5_ = new ActionTranslate(
                        _loc8_,
                        new Point(_loc8_.x, _loc8_.y),
                    );
                    _loc4_ = new ActionScale(
                        _loc8_,
                        _loc8_.scaleX,
                        _loc8_.scaleY,
                    );
                    _loc5_.nextAction = _loc4_;
                    if (_loc6_) {
                        _loc5_.prevAction = _loc6_;
                    }
                    _loc6_ = _loc4_;
                }
                _loc8_.shapeWidth += param1;
                _loc8_.shapeHeight += param2;
            }
            _loc7_++;
        }
        this.updateInputValues();
        if (!this.scaling && Boolean(_loc6_)) {
            this.dispatchEvent(new ActionEvent(ActionEvent.SCALE, _loc4_));
            this.scaling = true;
        }
    }

    private adjustRotation(param1: number, param2: boolean) {
        var _loc3_: Action = null;
        var _loc4_: Action = null;
        var _loc5_: Action = null;
        var _loc7_: RefSprite = null;
        if (this.currentSelection.length == 0) {
            return;
        }
        if (param2) {
            param1 *= 10;
        }
        var _loc6_: number = 0;
        while (_loc6_ < this.currentSelection.length) {
            _loc7_ = this.currentSelection[_loc6_];
            if (_loc7_.rotatable) {
                if (!this.rotating) {
                    _loc4_ = new ActionTranslate(
                        _loc7_,
                        new Point(_loc7_.x, _loc7_.y),
                    );
                    _loc3_ = new ActionRotate(_loc7_, _loc7_.angle);
                    _loc4_.nextAction = _loc3_;
                    if (_loc5_) {
                        _loc4_.prevAction = _loc5_;
                    }
                    _loc5_ = _loc3_;
                }
                _loc7_.angle += param1;
            }
            _loc6_++;
        }
        this.updateInputValues();
        if (!this.rotating && Boolean(_loc5_)) {
            this.dispatchEvent(new ActionEvent(ActionEvent.ROTATE, _loc3_));
            this.rotating = true;
        }
    }

    private convertGroupToVehicle(param1: MouseEvent) {
        var _loc3_: Action = null;
        var _loc5_: RefGroup = null;
        var _loc6_: number = 0;
        var _loc7_: RefVehicle = null;
        var _loc8_: ActionAdd = null;
        var _loc9_: Action = null;
        var _loc10_: Action = null;
        var _loc11_: Action = null;
        var _loc12_: RefJoint = null;
        var _loc13_: Point = null;
        var _loc14_: ActionProperty = null;
        var _loc2_ = new Array();
        var _loc4_: number = 0;
        while (_loc4_ < this.currentSelection.length) {
            _loc5_ = this.currentSelection[_loc4_];
            _loc6_ = _loc5_.parent.getChildIndex(_loc5_);
            _loc7_ = _loc5_.vehicleClone();
            this._currentCanvas.addRefSpriteAt(_loc7_, _loc6_);
            _loc7_.x = _loc7_.x;
            _loc7_.y = _loc7_.y;
            _loc8_ = new ActionAdd(_loc7_, this._currentCanvas, _loc6_);
            if (_loc3_) {
                _loc8_.prevAction = _loc3_.lastAction;
            }
            _loc3_ = _loc8_;
            while (_loc5_.joints.length > 0) {
                _loc12_ = _loc5_.joints[0];
                _loc13_ = new Point(_loc12_.x, _loc12_.y);
                if (_loc12_.body1 == _loc5_) {
                    _loc12_.body1 = _loc7_;
                    _loc14_ = new ActionProperty(
                        _loc12_,
                        "body1",
                        _loc5_,
                        _loc7_,
                        _loc13_,
                        _loc13_,
                    );
                } else {
                    _loc12_.body2 = _loc7_;
                    _loc14_ = new ActionProperty(
                        _loc12_,
                        "body2",
                        _loc5_,
                        _loc7_,
                        _loc13_,
                        _loc13_,
                    );
                }
                _loc3_.nextAction = _loc14_;
                _loc3_ = _loc14_;
            }
            _loc9_ = this.removeFromSelection(_loc5_);
            _loc3_.nextAction = _loc9_.firstAction;
            _loc10_ = _loc5_.deleteSelf(this._currentCanvas);
            _loc9_.nextAction = _loc10_.firstAction;
            _loc11_ = this.addToSelection(_loc7_);
            _loc11_.prevAction = _loc10_.lastAction;
            _loc3_ = _loc11_.lastAction;
            _loc4_++;
        }
        this.setInputs();
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc3_));
    }

    public convertVehicleToGroup(param1: MouseEvent) {
        var _loc3_: Action = null;
        var _loc5_: RefVehicle = null;
        var _loc6_: number = 0;
        var _loc7_: RefGroup = null;
        var _loc8_: ActionAdd = null;
        var _loc9_: Action = null;
        var _loc10_: Action = null;
        var _loc11_: Action = null;
        var _loc12_: RefJoint = null;
        var _loc13_: Point = null;
        var _loc14_: ActionProperty = null;
        var _loc2_ = new Array();
        var _loc4_: number = 0;
        while (_loc4_ < this.currentSelection.length) {
            _loc5_ = this.currentSelection[_loc4_];
            _loc6_ = _loc5_.parent.getChildIndex(_loc5_);
            _loc7_ = _loc5_.cloneAsGroup();
            this._currentCanvas.addRefSpriteAt(_loc7_, _loc6_);
            _loc7_.x = _loc7_.x;
            _loc7_.y = _loc7_.y;
            _loc8_ = new ActionAdd(_loc7_, this._currentCanvas, _loc6_);
            if (_loc3_) {
                _loc8_.prevAction = _loc3_.lastAction;
            }
            _loc3_ = _loc8_;
            while (_loc5_.joints.length > 0) {
                _loc12_ = _loc5_.joints[0];
                _loc13_ = new Point(_loc12_.x, _loc12_.y);
                if (_loc12_.body1 == _loc5_) {
                    _loc12_.body1 = _loc7_;
                    _loc14_ = new ActionProperty(
                        _loc12_,
                        "body1",
                        _loc5_,
                        _loc7_,
                        _loc13_,
                        _loc13_,
                    );
                } else {
                    _loc12_.body2 = _loc7_;
                    _loc14_ = new ActionProperty(
                        _loc12_,
                        "body2",
                        _loc5_,
                        _loc7_,
                        _loc13_,
                        _loc13_,
                    );
                }
                _loc3_.nextAction = _loc14_;
                _loc3_ = _loc14_;
            }
            _loc9_ = this.removeFromSelection(_loc5_);
            _loc3_.nextAction = _loc9_.firstAction;
            _loc10_ = _loc5_.deleteSelf(this._currentCanvas);
            _loc9_.nextAction = _loc10_.firstAction;
            _loc11_ = this.addToSelection(_loc7_);
            _loc11_.prevAction = _loc10_.lastAction;
            _loc3_ = _loc11_.lastAction;
            _loc4_++;
        }
        this.setInputs();
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc3_));
    }

    public setShapeAsHandle(param1: MouseEvent) {
        var _loc2_: ActionProperty = null;
        var _loc3_: ActionProperty = null;
        var _loc5_: RefShape = null;
        var _loc4_: number = 0;
        while (_loc4_ < this.currentSelection.length) {
            _loc5_ = this.currentSelection[_loc4_];
            _loc5_.vehicleHandle = true;
            _loc3_ = new ActionProperty(_loc5_, "vehicleHandle", false, true);
            if (_loc2_) {
                _loc2_.nextAction = _loc3_;
            }
            _loc2_ = _loc3_;
            _loc4_++;
        }
        this.setInputs();
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc3_));
    }

    public removeHandleProperty(param1: MouseEvent) {
        var _loc2_: ActionProperty = null;
        var _loc3_: ActionProperty = null;
        var _loc5_: RefShape = null;
        var _loc4_: number = 0;
        while (_loc4_ < this.currentSelection.length) {
            _loc5_ = this.currentSelection[_loc4_];
            _loc5_.vehicleHandle = false;
            _loc3_ = new ActionProperty(_loc5_, "vehicleHandle", true, false);
            if (_loc2_) {
                _loc2_.nextAction = _loc3_;
            }
            _loc2_ = _loc3_;
            _loc4_++;
        }
        this.setInputs();
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc3_));
    }

    public addNewTarget(param1: MouseEvent) {
        this.beginTriggerSelector();
    }

    public removeTarget(param1: MouseEvent) {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc5_: RefTrigger = null;
        var _loc4_: number = 0;
        while (_loc4_ < this.currentSelection.length) {
            _loc5_ = this.currentSelection[_loc4_];
            _loc2_ = _loc5_.removeLastTarget();
            if (_loc3_) {
                _loc3_.nextAction = _loc2_;
            }
            _loc3_ = _loc2_;
            _loc4_++;
        }
        this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc2_));
    }

    public setInputs() {
        var _loc11_ = undefined;
        var _loc12_: number = 0;
        var _loc13_: number = 0;
        var _loc14_: string = null;
        var _loc15_: {} = null;
        var _loc16_: number = 0;
        var _loc17_: boolean = false;
        var _loc18_: number = 0;
        var _loc19_: any[] = null;
        var _loc20_: string = null;
        var _loc21_ = undefined;
        var _loc22_ = undefined;
        var _loc23_: InputObject = null;
        var _loc24_: InputObject = null;
        trace("SET INPUTS");
        var _loc1_ = int(this.currentSelection.length);
        if (_loc1_ == 0) {
            this.removeInputs();
            this.labelText.text = "nothing selected";
            this.inputMask.height = 0;
            this.disableScrolling();
            this.window.setDimensions(this.windowWidth, this.height + 5);
            return;
        }
        var _loc2_: any[] = this.currentAttributes;
        var _loc3_: any[] = this.inputs;
        var _loc4_: RefSprite = this.currentSelection[0];
        var _loc5_: string = _loc4_.name;
        var _loc6_: boolean = true;
        var _loc7_ = new Array();
        var _loc8_: number = 0;
        while (_loc8_ < _loc4_.attributes.length) {
            _loc11_ = _loc4_.attributes[_loc8_];
            _loc7_.push(_loc11_);
            _loc8_++;
        }
        _loc8_ = 1;
        while (_loc8_ < _loc1_) {
            _loc4_ = this.currentSelection[_loc8_];
            if (_loc4_.name != _loc5_) {
                _loc6_ = false;
            }
            _loc12_ = 0;
            while (_loc12_ < _loc7_.length) {
                _loc11_ = _loc7_[_loc12_];
                if (typeof _loc11_ === "string") {
                    _loc13_ = int(_loc4_.attributes.indexOf(_loc11_));
                    if (_loc13_ < 0) {
                        _loc7_.splice(_loc12_, 1);
                        _loc12_--;
                    }
                } else {
                    _loc14_ = _loc11_[0];
                    _loc15_ = _loc11_[1];
                    _loc16_ = int(_loc11_[2]);
                    _loc17_ = false;
                    _loc18_ = 0;
                    while (_loc18_ < _loc4_.attributes.length) {
                        if (Array.isArray(_loc4_.attributes[_loc18_])) {
                            _loc19_ = _loc4_.attributes[_loc18_];
                            if (
                                _loc19_[0] == _loc14_ &&
                                _loc19_[1] == _loc15_ &&
                                _loc19_[2] == _loc16_
                            ) {
                                _loc17_ = true;
                            }
                        }
                        _loc18_++;
                    }
                    if (!_loc17_) {
                        _loc7_.splice(_loc12_, 1);
                        _loc12_--;
                    }
                }
                _loc12_++;
            }
            _loc8_++;
        }
        _loc4_ = this.currentSelection[0];
        if (_loc6_) {
            _loc20_ = _loc1_ > 1 ? "s" : "";
            this.labelText.text = "" + _loc5_ + _loc20_;
        } else {
            this.labelText.text = "multiple objects";
        }
        var _loc9_ = int(_loc2_.length);
        _loc8_ = 0;
        while (_loc8_ < _loc2_.length) {
            _loc21_ = _loc7_[_loc8_];
            _loc22_ = _loc2_[_loc8_];
            if (typeof _loc21_ === "string" && typeof _loc22_ === "string") {
                if (_loc22_ != _loc21_) {
                    _loc9_ = _loc8_;
                    _loc8_ = int(_loc2_.length);
                }
            } else if (Array.isArray(_loc21_) && Array.isArray(_loc22_)) {
                if (
                    _loc21_[0] != _loc22_[0] ||
                    _loc21_[1] != _loc22_[1] ||
                    _loc21_[2] != _loc22_[2]
                ) {
                    _loc9_ = 1;
                    _loc8_ = int(_loc2_.length);
                }
            } else {
                _loc9_ = 1;
                _loc8_ = int(_loc2_.length);
            }
            _loc8_++;
        }
        this.removeInputs(_loc9_);
        var _loc10_: number = 0;
        if (_loc9_ > 0) {
            _loc24_ = this.inputs[this.inputs.length - 1];
            _loc10_ = _loc24_.y + _loc24_.height;
            if (_loc24_.childInputs) {
                _loc12_ = 0;
                while (_loc12_ < _loc24_.childInputs.length) {
                    _loc23_ = _loc24_.childInputs[_loc12_];
                    _loc10_ += _loc23_.height;
                    _loc12_++;
                }
            }
        }
        this.currentAttributes = _loc7_;
        _loc8_ = _loc9_;
        while (_loc8_ < this.currentAttributes.length) {
            _loc21_ = this.currentAttributes[_loc8_];
            if (Array.isArray(this.currentAttributes[_loc8_])) {
                _loc24_ = AttributeReference.buildKeyedInput(
                    _loc21_[0],
                    _loc21_[1],
                    _loc21_[2],
                    _loc4_,
                );
            } else {
                _loc24_ = AttributeReference.buildInput(_loc21_);
            }
            _loc24_.y = _loc10_;
            _loc24_.x = this.indent;
            this.inputHolder.addChild(_loc24_);
            _loc24_.addEventListener(
                ValueEvent.VALUE_CHANGE,
                this.inputValueChange,
            );
            if (_loc24_.expandable) {
                _loc24_.addEventListener(
                    ValueEvent.ADD_INPUT,
                    this.inputAddInput,
                );
                _loc24_.addEventListener(
                    ValueEvent.REMOVE_INPUT,
                    this.inputRemoveInput,
                );
            }
            this.inputs.push(_loc24_);
            _loc10_ += _loc24_.height;
            if (_loc24_.childInputs) {
                _loc12_ = 0;
                while (_loc12_ < _loc24_.childInputs.length) {
                    _loc23_ = _loc24_.childInputs[_loc12_];
                    _loc23_.y = _loc10_;
                    _loc23_.x = this.indent;
                    this.inputHolder.addChild(_loc23_);
                    _loc10_ += _loc23_.height;
                    _loc12_++;
                }
            }
            _loc8_++;
        }
        this.updateInputValues();
        this.setButtons();
        if (this.inputHolder.height > this.cutoffHeight) {
            this.inputMask.height = this.cutoffHeight + 5 - this.inputMask.y;
            this.window.setDimensions(this.windowWidth, this.cutoffHeight + 5);
            this.enableScrolling();
        } else {
            this.inputMask.height = this.inputHolder.height;
            this.disableScrolling();
            this.inputHolder.y = this.holderY;
            this.window.setDimensions(
                this.windowWidth,
                this.holderY + this.inputMask.height + 5,
            );
        }
    }

    private setButtons() {
        var _loc6_: string = null;
        var _loc7_: number = 0;
        var _loc8_: number = 0;
        var _loc9_: string = null;
        var _loc10_: GenericButton = null;
        var _loc1_ = int(this.currentSelection.length);
        var _loc2_: RefSprite = this.currentSelection[0];
        var _loc3_ = new Array();
        var _loc4_: number = 0;
        while (_loc4_ < _loc2_.functions.length) {
            _loc6_ = _loc2_.functions[_loc4_];
            _loc3_.push(_loc6_);
            _loc4_++;
        }
        _loc4_ = 1;
        while (_loc4_ < _loc1_) {
            _loc2_ = this.currentSelection[_loc4_];
            _loc7_ = 0;
            while (_loc7_ < _loc3_.length) {
                _loc6_ = _loc3_[_loc7_];
                _loc8_ = int(_loc2_.functions.indexOf(_loc6_));
                if (_loc8_ < 0) {
                    _loc3_.splice(_loc7_, 1);
                    _loc7_--;
                }
                _loc7_++;
            }
            _loc4_++;
        }
        var _loc5_: number = Math.ceil(this.inputHolder.height) + 5;
        this.currentFunctions = _loc3_;
        _loc4_ = 0;
        while (_loc4_ < this.currentFunctions.length) {
            _loc9_ = this.currentFunctions[_loc4_];
            _loc10_ = FunctionReference.buildButton(_loc9_);
            _loc10_.y = _loc5_;
            _loc10_.x = this.indent;
            this.inputHolder.addChild(_loc10_);
            _loc10_.addEventListener(
                MouseEvent.MOUSE_UP,
                this[_loc10_.functionString],
                false,
                0,
                true,
            );
            this.buttons.push(_loc10_);
            _loc5_ += Math.ceil(_loc10_.height) + 5;
            _loc4_++;
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
        var _loc6_ = undefined;
        var _loc7_: number = 0;
        var _loc8_: RefSprite = null;
        var _loc9_: Dictionary<any, any> = null;
        var _loc10_ = undefined;
        var _loc11_: number = 0;
        var _loc12_: InputObject = null;
        var _loc2_: string = param1.attribute;
        var _loc3_: {} = param1.multipleKey;
        var _loc4_: number = param1.multipleIndex;
        var _loc5_: boolean = false;
        if (!_loc3_) {
            _loc6_ = this.currentSelection[0][_loc2_];
            _loc7_ = 1;
            while (_loc7_ < this.currentSelection.length) {
                if (this.currentSelection[_loc7_][_loc2_] != _loc6_) {
                    _loc5_ = true;
                    break;
                }
                _loc7_++;
            }
        } else {
            _loc8_ = this.currentSelection[0] as RefSprite;
            _loc9_ = _loc8_.keyedPropertyObject[_loc2_];
            if (!_loc9_) {
                _loc9_ = _loc8_.keyedPropertyObject[_loc2_] = new Dictionary();
            }
            _loc6_ = _loc9_.get(_loc3_).get(_loc4_);
            if (!_loc6_) {
                _loc9_.get(_loc3_).set(_loc4_, _loc6_ = param1.defaultValue);
            }
            _loc7_ = 1;
            while (_loc7_ < this.currentSelection.length) {
                _loc8_ = this.currentSelection[_loc7_];
                _loc9_ = _loc8_.keyedPropertyObject[_loc2_];
                if (!_loc9_) {
                    _loc9_ = _loc8_.keyedPropertyObject[_loc2_] = new Dictionary();
                }
                _loc10_ = _loc9_.get(_loc3_).get(_loc4_);
                if (!_loc10_) {
                    _loc9_.get(_loc3_).set(_loc4_, _loc10_ = param1.defaultValue);
                }
                if (_loc9_.get(_loc3_).get(_loc4_) != _loc6_) {
                    _loc5_ = true;
                    break;
                }
                _loc7_++;
            }
        }
        if (_loc5_) {
            param1.setToAmbiguous();
        } else {
            param1.setValue(_loc6_);
            _loc11_ = 0;
            while (_loc11_ < param1.childInputs.length) {
                _loc12_ = param1.childInputs[_loc11_];
                this.updateInput(_loc12_);
                _loc11_++;
            }
        }
    }

    private removeInputs(param1: number = 0) {
        var _loc3_: InputObject = null;
        var _loc4_: number = 0;
        var _loc5_: InputObject = null;
        var _loc6_: GenericButton = null;
        var _loc2_: number = param1;
        while (_loc2_ < this.inputs.length) {
            _loc3_ = this.inputs[_loc2_];
            _loc4_ = 0;
            while (_loc4_ < _loc3_.childInputs.length) {
                _loc5_ = _loc3_.childInputs[_loc4_];
                this.inputHolder.removeChild(_loc5_);
                _loc4_++;
            }
            _loc3_.removeEventListener(
                ValueEvent.VALUE_CHANGE,
                this.inputValueChange,
            );
            _loc3_.removeEventListener(
                ValueEvent.ADD_INPUT,
                this.inputAddInput,
            );
            _loc3_.removeEventListener(
                ValueEvent.REMOVE_INPUT,
                this.inputRemoveInput,
            );
            _loc3_.die();
            this.inputHolder.removeChild(_loc3_);
            this.inputs.splice(_loc2_, 1);
            this.currentAttributes.splice(_loc2_, 1);
            _loc2_--;
            _loc2_++;
        }
        _loc2_ = 0;
        while (_loc2_ < this.buttons.length) {
            _loc6_ = this.buttons[_loc2_];
            _loc6_.removeEventListener(
                MouseEvent.MOUSE_UP,
                this[_loc6_.functionString],
            );
            this.inputHolder.removeChild(_loc6_);
            _loc2_++;
        }
        this.buttons = new Array();
        this.currentFunctions = new Array();
    }

    private inputValueChange(param1: ValueEvent) {
        var _loc6_: Action = null;
        var _loc7_: Action = null;
        var _loc8_: number = 0;
        var _loc9_: RefSprite = null;
        var _loc2_: InputObject = param1.inputObject;
        var _loc3_: string = _loc2_.attribute;
        var _loc4_: {} = _loc2_.multipleKey;
        var _loc5_: number = _loc2_.multipleIndex;
        if (!_loc4_) {
            _loc8_ = 0;
            while (_loc8_ < this.currentSelection.length) {
                _loc9_ = this.currentSelection[_loc8_];
                _loc6_ = _loc9_.setProperty(_loc3_, param1.value);
                if (_loc6_) {
                    if (_loc7_) {
                        _loc6_.firstAction.prevAction = _loc7_;
                    }
                    _loc7_ = _loc6_;
                }
                _loc8_++;
            }
        } else {
            _loc8_ = 0;
            while (_loc8_ < this.currentSelection.length) {
                _loc9_ = this.currentSelection[_loc8_];
                _loc6_ = _loc9_.setKeyedProperty(
                    _loc3_,
                    _loc4_,
                    _loc5_,
                    param1.value,
                );
                if (_loc6_) {
                    if (_loc7_) {
                        _loc6_.firstAction.prevAction = _loc7_;
                    }
                    _loc7_ = _loc6_;
                }
                _loc8_++;
            }
        }
        if (_loc6_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc6_));
        }
        if (param1.resetInputs) {
            this.setInputs();
        }
    }

    private inputAddInput(param1: ValueEvent) {
        var _loc6_ = undefined;
        var _loc7_: Action = null;
        var _loc8_: Action = null;
        var _loc10_: RefSprite = null;
        var _loc11_: Dictionary<any, any> = null;
        var _loc12_: any[] = null;
        var _loc2_: InputObject = param1.inputObject;
        var _loc3_: string = _loc2_.attribute;
        var _loc4_: {} = _loc2_.multipleKey;
        var _loc5_: number = _loc2_.multipleIndex;
        var _loc9_: number = 0;
        while (_loc9_ < this.currentSelection.length) {
            _loc10_ = this.currentSelection[_loc9_];
            _loc11_ = _loc10_.keyedPropertyObject[_loc3_];
            _loc12_ = _loc11_.get(_loc4_);
            _loc6_ = _loc12_.length;
            if (_loc6_ < 10) {
                _loc12_.push(_loc10_.triggerActionList[0]);
                _loc10_.setAttributes();
                _loc7_ = new ActionAddKeyedIndex(
                    _loc10_,
                    _loc3_,
                    _loc4_,
                    _loc5_,
                );
                if (_loc8_) {
                    _loc8_.nextAction = _loc7_;
                }
                _loc8_ = _loc7_;
            }
            _loc9_++;
        }
        if (param1.resetInputs) {
            this.removeInputs();
            this.setInputs();
        }
        if (_loc8_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc8_));
        }
    }

    private inputRemoveInput(param1: ValueEvent) {
        var _loc6_: any[] = null;
        var _loc7_: Action = null;
        var _loc8_: Action = null;
        var _loc10_: RefSprite = null;
        var _loc11_: Dictionary<any, any> = null;
        var _loc12_: {} = null;
        var _loc13_: any[] = null;
        var _loc14_: number = 0;
        var _loc15_: number = 0;
        var _loc16_: number = 0;
        var _loc17_: string = null;
        var _loc18_: Dictionary<any, any> = null;
        var _loc19_: any[] = null;
        var _loc2_: InputObject = param1.inputObject;
        var _loc3_: string = _loc2_.attribute;
        var _loc4_: {} = _loc2_.multipleKey;
        var _loc5_: number = _loc2_.multipleIndex;
        var _loc9_: number = 0;
        while (_loc9_ < this.currentSelection.length) {
            _loc10_ = this.currentSelection[_loc9_];
            _loc11_ = _loc10_.keyedPropertyObject[_loc3_];
            _loc12_ = new Object();
            _loc13_ = _loc11_.get(_loc4_);
            _loc14_ = int(_loc13_.length);
            if (_loc14_ > 1) {
                _loc12_[_loc3_] = _loc13_[_loc5_];
                _loc13_.splice(_loc5_, 1);
                _loc15_ = 0;
                while (_loc15_ < _loc10_.triggerActionList.length) {
                    _loc6_ = _loc10_.triggerActionListProperties[_loc15_];
                    if (_loc6_) {
                        _loc16_ = 0;
                        while (_loc16_ < _loc6_.length) {
                            _loc17_ = _loc6_[_loc16_];
                            _loc18_ = _loc10_.keyedPropertyObject[_loc17_];
                            trace(_loc18_);
                            if (_loc18_) {
                                _loc19_ = _loc18_.get(_loc4_);
                                if (_loc19_) {
                                    _loc12_[_loc17_] = _loc19_[_loc5_];
                                    _loc19_.splice(_loc5_, 1);
                                }
                            }
                            _loc16_++;
                        }
                    }
                    _loc15_++;
                }
                _loc7_ = new ActionRemoveKeyedIndex(
                    _loc10_,
                    _loc3_,
                    _loc4_,
                    _loc5_,
                    _loc12_,
                );
                if (_loc8_) {
                    _loc8_.nextAction = _loc7_;
                }
                _loc8_ = _loc7_;
                _loc10_.setAttributes();
            }
            _loc9_++;
        }
        if (param1.resetInputs) {
            this.removeInputs();
            this.setInputs();
        }
        if (_loc8_) {
            this.dispatchEvent(new ActionEvent(ActionEvent.GENERIC, _loc8_));
        }
    }

    public updateCopiedVerts() {
        var _loc6_: RefSprite = null;
        var _loc7_: PolygonShape = null;
        var _loc8_: number = 0;
        var _loc9_: ArtShape = null;
        var _loc10_: RefGroup = null;
        var _loc11_: Sprite = null;
        var _loc12_: number = 0;
        var _loc13_: DisplayObject = null;
        trace("UPDATE COPIED VERT IDS");
        var _loc1_ = new Array();
        var _loc2_ = new Array();
        var _loc3_: number = PolygonTool.getIDCounter();
        var _loc4_: number = ArtTool.getIDCounter();
        var _loc5_: number = 0;
        while (_loc5_ < this.copiedSelection.length) {
            _loc6_ = this.copiedSelection[_loc5_];
            if (_loc6_ instanceof PolygonShape) {
                _loc7_ = _loc6_ as PolygonShape;
                _loc8_ = _loc7_.vID;
                if (_loc1_[_loc8_]) {
                    _loc7_.vID = _loc1_[_loc8_];
                } else {
                    _loc7_.vID = _loc3_;
                    _loc1_[_loc8_] = _loc3_;
                }
                _loc3_ += 1;
            } else if (_loc6_ instanceof ArtShape) {
                _loc9_ = _loc6_ as ArtShape;
                _loc8_ = _loc9_.vID;
                if (_loc2_[_loc8_]) {
                    _loc9_.vID = _loc2_[_loc8_];
                } else {
                    _loc9_.vID = _loc4_;
                    _loc2_[_loc8_] = _loc4_;
                }
                _loc4_ += 1;
            } else if (_loc6_ instanceof RefGroup) {
                _loc10_ = _loc6_ as RefGroup;
                _loc11_ = _loc10_.shapeContainer;
                _loc12_ = 0;
                while (_loc12_ < _loc11_.numChildren) {
                    _loc13_ = _loc11_.getChildAt(_loc12_);
                    if (_loc13_ instanceof PolygonShape) {
                        _loc7_ = _loc13_ as PolygonShape;
                        _loc8_ = _loc7_.vID;
                        if (_loc1_[_loc8_]) {
                            _loc7_.vID = _loc1_[_loc8_];
                        } else {
                            _loc7_.vID = _loc3_;
                            _loc1_[_loc8_] = _loc3_;
                        }
                        _loc3_ += 1;
                    } else if (_loc13_ instanceof ArtShape) {
                        // @ts-expect-error
                        _loc9_ = _loc6_ as ArtShape;
                        _loc8_ = _loc9_.vID;
                        if (_loc2_[_loc8_]) {
                            _loc9_.vID = _loc2_[_loc8_];
                        } else {
                            _loc9_.vID = _loc4_;
                            _loc2_[_loc8_] = _loc4_;
                        }
                        _loc4_ += 1;
                    }
                    _loc12_++;
                }
            }
            _loc5_++;
        }
    }

    private enableScrolling() {
        if (!this.scrolling) {
            this.scrolling = true;
            this.scrollUpSprite = new ScrollUpSprite();
            this.addChild(this.scrollUpSprite);
            this.scrollUpSprite.y = this.holderY;
            this.scrollDownSprite = new ScrollUpSprite();
            this.addChild(this.scrollDownSprite);
            this.scrollDownSprite.y = this.cutoffHeight + 5;
            this.scrollDownSprite.scaleY = -1;
            this.addEventListener(Event.ENTER_FRAME, this.scrollInputs);
        }
    }

    private disableScrolling() {
        this.scrolling = false;
        if (this.scrollUpSprite) {
            this.removeChild(this.scrollUpSprite);
        }
        if (this.scrollDownSprite) {
            this.removeChild(this.scrollDownSprite);
        }
        this.scrollUpSprite = null;
        this.scrollDownSprite = null;
        this.removeEventListener(Event.ENTER_FRAME, this.scrollInputs);
    }

    private scrollInputs(param1: Event) {
        var _loc2_: number = this.inputHolder.height;
        var _loc3_: number = Math.round(
            this.holderY - (_loc2_ - this.inputMask.height) - 5,
        );
        if (this.mouseX > 0 && this.mouseX < this.windowWidth) {
            if (
                this.mouseY >= this.cutoffHeight - 30 &&
                this.mouseY <= this.cutoffHeight + 5
            ) {
                this.inputHolder.y -= 10;
                if (this.inputHolder.y < _loc3_) {
                    this.inputHolder.y = _loc3_;
                }
            } else if (this.mouseY > 0 && this.mouseY < 35) {
                this.inputHolder.y += 10;
                if (this.inputHolder.y > this.holderY) {
                    this.inputHolder.y = this.holderY;
                }
            }
        }
        this.scrollUpSprite.visible =
            this.inputHolder.y == this.holderY ? false : true;
        this.scrollDownSprite.visible =
            this.inputHolder.y == _loc3_ ? false : true;
    }

    public override die() {
        super.die();
    }

    public get currentCanvas(): Canvas {
        return this._currentCanvas;
    }

    public set currentCanvas(param1: Canvas) {
        this._currentCanvas = param1;
    }
}