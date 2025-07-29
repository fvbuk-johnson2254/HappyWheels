import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import ToolButton from "@/com/totaljerkface/game/editor/ToolButton";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol719")] */
@boundClass
export default class ToolBar extends Sprite {
    public static TOOL_SELECTED: string;
    public static ARROW: string = "arrow";
    public static SHAPE: string = "shape";
    public static POLYGON: string = "polygon";
    public static JOINT: string = "joint";
    public static SPECIAL: string = "special";
    public static TEXT: string = "text";
    public static TRIGGER: string = "trigger";
    public static ART: string = "art";
    public arrowButton: ToolButton;
    public shapeButton: ToolButton;
    public polygonButton: ToolButton;
    public pinButton: ToolButton;
    public specialButton: ToolButton;
    public textButton: ToolButton;
    public triggerButton: ToolButton;
    public artButton: ToolButton;
    private window: Window;
    private _currentButton: ToolButton;

    public init() {
        var _loc1_: DisplayObjectContainer = null;
        _loc1_ = this.parent;
        this.window = new Window(false);
        this.window.x = this.x;
        this.window.y = this.y;
        this.window.populate(this);
        _loc1_.addChild(this.window);
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.addEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: ToolButton = null;
        if (param1.target instanceof ToolButton) {
            _loc2_ = param1.target as ToolButton;
            this.currentButton = _loc2_;
        }
        param1.stopPropagation();
    }

    private mouseOverHandler(param1: MouseEvent) {
        var _loc2_ = MouseHelper.instance;
        switch (param1.target) {
            case this.arrowButton:
                _loc2_.show("selection tool (1)", this.arrowButton);
                break;
            case this.shapeButton:
                _loc2_.show("shape tool (2)", this.shapeButton);
                break;
            case this.polygonButton:
                _loc2_.show("poly tool (3)", this.polygonButton);
                break;
            case this.pinButton:
                _loc2_.show("joint tool (5)", this.pinButton);
                break;
            case this.specialButton:
                _loc2_.show("special item tool (6)", this.specialButton);
                break;
            case this.textButton:
                _loc2_.show("text tool (7)", this.textButton);
                break;
            case this.triggerButton:
                _loc2_.show("trigger tool (8)", this.triggerButton);
                break;
            case this.artButton:
                _loc2_.show("art tool (4)", this.artButton);
        }
    }

    private set currentButton(param1: ToolButton) {
        if (this._currentButton) {
            if (param1 == this._currentButton) {
                return;
            }
            this._currentButton.selected = false;
        }
        this._currentButton = param1;
        this._currentButton.selected = true;
        this.dispatchEvent(new Event(ToolBar.TOOL_SELECTED));
    }

    public get currentSelection(): string {
        switch (this._currentButton) {
            case this.arrowButton:
                return ToolBar.ARROW;
            case this.shapeButton:
                return ToolBar.SHAPE;
            case this.polygonButton:
                return ToolBar.POLYGON;
            case this.pinButton:
                return ToolBar.JOINT;
            case this.specialButton:
                return ToolBar.SPECIAL;
            case this.textButton:
                return ToolBar.TEXT;
            case this.triggerButton:
                return ToolBar.TRIGGER;
            case this.artButton:
                return ToolBar.ART;
            default:
                return "";
        }
    }

    public pressButton(param1: string) {
        switch (param1) {
            case ToolBar.ARROW:
                this.currentButton = this.arrowButton;
                break;
            case ToolBar.SHAPE:
                this.currentButton = this.shapeButton;
                break;
            case ToolBar.POLYGON:
                this.currentButton = this.polygonButton;
                break;
            case ToolBar.JOINT:
                this.currentButton = this.pinButton;
                break;
            case ToolBar.SPECIAL:
                this.currentButton = this.specialButton;
                break;
            case ToolBar.TEXT:
                this.currentButton = this.textButton;
                break;
            case ToolBar.TRIGGER:
                this.currentButton = this.triggerButton;
                break;
            case ToolBar.ART:
                this.currentButton = this.artButton;
        }
    }

    public die() {
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.removeEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
    }
}