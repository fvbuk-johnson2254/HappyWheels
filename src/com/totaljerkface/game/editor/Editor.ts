import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import SwfLoader from "@/com/totaljerkface/game/SwfLoader";
import UserLevelLoader from "@/com/totaljerkface/game/UserLevelLoader";
import ActionEvent from "@/com/totaljerkface/game/editor/ActionEvent";
import ActionRecorder from "@/com/totaljerkface/game/editor/ActionRecorder";
import ArrowTool from "@/com/totaljerkface/game/editor/ArrowTool";
import ArtTool from "@/com/totaljerkface/game/editor/ArtTool";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import CanvasHorizontalScroller from "@/com/totaljerkface/game/editor/CanvasHorizontalScroller";
import CanvasVerticalScroller from "@/com/totaljerkface/game/editor/CanvasVerticalScroller";
import GroupCanvas from "@/com/totaljerkface/game/editor/GroupCanvas";
import HelpWindow from "@/com/totaljerkface/game/editor/HelpWindow";
import JointTool from "@/com/totaljerkface/game/editor/JointTool";
import PolygonTool from "@/com/totaljerkface/game/editor/PolygonTool";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import RefGroup from "@/com/totaljerkface/game/editor/RefGroup";
import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import SaverLoader from "@/com/totaljerkface/game/editor/SaverLoader";
import ShapeTool from "@/com/totaljerkface/game/editor/ShapeTool";
import SpecialTool from "@/com/totaljerkface/game/editor/SpecialTool";
import TextTool from "@/com/totaljerkface/game/editor/TextTool";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import ToolBar from "@/com/totaljerkface/game/editor/ToolBar";
import TopMenu from "@/com/totaljerkface/game/editor/TopMenu";
import TriggerTool from "@/com/totaljerkface/game/editor/TriggerTool";
import ActionAdd from "@/com/totaljerkface/game/editor/actions/ActionAdd";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import TextBoxRef from "@/com/totaljerkface/game/editor/specials/TextBoxRef";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import HandCursor from "@/top/HandCursor";
import PositionMark from "@/top/PositionMark";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import TimerEvent from "flash/events/TimerEvent";
import TextField from "flash/text/TextField";
import Mouse from "flash/ui/Mouse";
import Timer from "flash/utils/Timer";

@boundClass
export default class Editor extends Sprite {
    public static currentZoom: number;
    public toolBar: ToolBar;
    private topMenu: TopMenu;
    private canvas: Canvas;
    private canvasHolder: Sprite;
    public horizontalScroller: CanvasHorizontalScroller;
    public verticalScroller: CanvasVerticalScroller;
    private actionRecorder: ActionRecorder;
    private saverLoader: SaverLoader;
    private helpWindow: HelpWindow;
    private _currentTool: Tool;
    private arrowTool: ArrowTool;
    private shapeTool: ShapeTool;
    private polygonTool: PolygonTool;
    private jointTool: JointTool;
    private specialTool: SpecialTool;
    private textTool: TextTool;
    private triggerTool: TriggerTool;
    private artTool: ArtTool;
    private maxZoom: number = 2;
    private minZoom: number = -5;
    private maxBorderX: number = 100;
    private maxBorderY: number = 50;
    private session: Session;
    private characterLoader: SwfLoader;
    private handNav: boolean;
    private handCursor: Sprite;
    private currMouseX: number;
    private currMouseY: number;
    private loginPrompt: PromptSprite;
    private abusiveTextPrompt: PromptSprite;
    private startLevelId: number;
    private startAuthorId: number;
    private intitialLevel: number = 0;
    private autoSaveTimer: Timer;
    private autoSaveInterval: number = 20000;
    private paused: boolean;
    private flags: any[];
    private flagHolder: Sprite;
    private abusiveText: boolean = false;
    private abusiveStrings: any[] = [
        "***",
        "****",
        "*****",
        "ratev",
        "ratefive",
        "ratefour",
        "ratethree",
        "ratetwo",
        "rateone",
        "rate5",
        "rate4",
        "rate3",
        "rate2",
        "rate1",
        "ratehigh",
        "rateif",
        "ratefor",
        "5star",
        "4star",
        "3star",
        "2star",
        "1star",
        "fivestar",
        "fourstar",
        "threestar",
        "twostar",
        "onestar",
        "goodrating",
        "goodvote",
        "votehigh",
        "vote5",
        "vote4",
        "vote3",
        "vote2",
        "vote1",
        "votefive",
        "votefour",
        "votethree",
        "votetwo",
        "voteone",
        "highrating",
    ];
    private abusivePromptText: string = "There appears to be text in your level that abuses the rating system. Stop doing that. Misguided people apparently follow your instructions, and it\'s ruining Happy Wheels. I\'ve been letting it slide, but including it in your level will now get it permanently deleted once noticed.";

    constructor(param1: LevelDataObject = null) {
        super();
        if (param1) {
            this.intitialLevel = 1;
            this.startLevelId = param1.id;
            this.startAuthorId = param1.author_id;
        } else if (Settings.sharedObject.data["editorLevelData"] != undefined) {
            this.intitialLevel = 2;
            trace("EDITOR LEVEL DATA");
        }
        if (this.parent) {
            this.init();
        }
    }

    public init() {
        var _loc1_: Window = null;
        Editor.currentZoom = 0;
        this.canvas = new Canvas();
        this.canvasHolder = new Sprite();
        this.canvasHolder.addChild(this.canvas);
        this.addChildAt(this.canvasHolder, 0);
        this.canvas.createTextField(this);
        this.canvasHolder.y = -Canvas.canvasHeight / 2;
        this.canvas.addEventListener(
            Canvas.SHAPE_LIMIT_STATUS,
            this.shapeLimitStatus,
        );
        this.canvas.addEventListener(
            Canvas.ART_LIMIT_STATUS,
            this.artLimitStatus,
        );
        this.actionRecorder = new ActionRecorder();
        this.horizontalScroller = new CanvasHorizontalScroller(
            this,
            this.canvasHolder,
            this.maxBorderX,
        );
        this.addChild(this.horizontalScroller);
        this.horizontalScroller.x = 200;
        this.horizontalScroller.y = 490;
        this.verticalScroller = new CanvasVerticalScroller(
            this,
            this.canvasHolder,
            this.maxBorderY,
        );
        this.addChild(this.verticalScroller);
        this.verticalScroller.x = 890;
        this.verticalScroller.y = 115;
        this.arrowTool = new ArrowTool(this, this.canvas);
        this.shapeTool = new ShapeTool(this, this.canvas);
        this.polygonTool = new PolygonTool(this, this.canvas);
        this.jointTool = new JointTool(this, this.canvas);
        this.specialTool = new SpecialTool(this, this.canvas);
        this.textTool = new TextTool(this, this.canvas);
        this.triggerTool = new TriggerTool(this, this.canvas);
        this.artTool = new ArtTool(this, this.canvas);
        this.helpWindow = new HelpWindow();
        this.helpWindow.window.x = 900 - (this.helpWindow.window.width + 20);
        this.helpWindow.window.y = 10;
        this.addChild(this.helpWindow.window);
        this.helpWindow.populate(
            "<u><b>HELLO</b></u><br><br>This is the level editor, where you can accomplish all of your lifelong goals.  Build levels and save them to your profile.  Make them public for everyone else to play and rate.  The best levels will be showcased in the featured level menu.<br><br>Start by selecting a tool to the left.  Press \'<b>t</b>\' at any time to test your level.  Press again to resume editing.",
        );
        this.toolBar = new ToolBar();
        this.toolBar.x = 10;
        this.toolBar.y = 30;
        this.addChild(this.toolBar);
        this.topMenu = new TopMenu();
        this.addChild(this.topMenu);
        this.topMenu.init();
        this.topMenu.addEventListener(TopMenu.MENU_BUSY, this.putShitOnHold);
        this.topMenu.addEventListener(TopMenu.MENU_IDLE, this.resumeThatShit);
        this.topMenu.addEventListener(TopMenu.TEST_LEVEL, this.testLevel);
        this.topMenu.addEventListener(TopMenu.CLEAR_STAGE, this.clearStage);
        this.topMenu.addEventListener(
            TopMenu.GO_MAIN_MENU,
            this.exitToMainMenu,
        );
        this.addListeners();
        this.toolBar.init();
        this.saverLoader = new SaverLoader(this.canvas);
        this.saverLoader.addEventListener(
            SaverLoader.CLEAR_STAGE,
            this.clearStage,
        );
        this.saverLoader.addEventListener(
            SaverLoader.UPDATE_COPIED_VERTS,
            this.updateCopiedVerts,
        );
        if (Settings.user_id <= 0) {
            this.putShitOnHold();
            this.loginPrompt = new PromptSprite(
                "You are not currently logged in.  Login or register for free above to save and share your creations with others who might possibly care.",
                "ok",
            );
            _loc1_ = this.loginPrompt.window;
            this.addChild(_loc1_);
            _loc1_.center();
            this.loginPrompt.addEventListener(
                PromptSprite.BUTTON_PRESSED,
                this.loginPromptAccepted,
            );
            return;
        }
        if (Settings.disableUpload) {
            this.putShitOnHold();
            this.loginPrompt = new PromptSprite(
                Settings.disableMessage,
                "OH FINE",
            );
            _loc1_ = this.loginPrompt.window;
            this.addChild(_loc1_);
            _loc1_.center();
            this.loginPrompt.addEventListener(
                PromptSprite.BUTTON_PRESSED,
                this.loginPromptAccepted,
            );
            return;
        }
        if (this.intitialLevel == 1) {
            this.topMenu.importLevel(this.startLevelId, this.startAuthorId);
        } else if (this.intitialLevel == 2) {
            this.saverLoader.importLevelData(
                Settings.sharedObject.data["editorLevelData"],
            );
        }
        this.autoSaveTimer = new Timer(this.autoSaveInterval, 0);
        this.autoSaveTimer.addEventListener(
            TimerEvent.TIMER,
            this.timerHandler,
        );
        this.autoSaveTimer.start();
    }

    private loginPromptAccepted(param1: Event) {
        this.loginPrompt.removeEventListener(
            PromptSprite.BUTTON_PRESSED,
            this.loginPromptAccepted,
        );
        this.loginPrompt = null;
        this.resumeThatShit();
        if (this.intitialLevel == 1) {
            this.topMenu.importLevel(this.startLevelId, this.startAuthorId);
        } else if (this.intitialLevel == 2) {
            this.saverLoader.importLevelData(
                Settings.sharedObject.data["editorLevelData"],
            );
        }
        this.autoSaveTimer = new Timer(this.autoSaveInterval, 0);
        this.autoSaveTimer.addEventListener(
            TimerEvent.TIMER,
            this.timerHandler,
        );
        this.autoSaveTimer.start();
    }

    private addListeners() {
        this.actionRecorder.addEventListener(
            ActionRecorder.UNDO,
            this.undoHandler,
        );
        this.actionRecorder.addEventListener(
            ActionRecorder.REDO,
            this.redoHandler,
        );
        this.toolBar.addEventListener(ToolBar.TOOL_SELECTED, this.toolSelected);
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.canvasHolder.addEventListener(
            MouseEvent.MOUSE_WHEEL,
            this.mouseWheelHandler,
        );
        this.stage.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.addEventListener(KeyboardEvent.KEY_UP, this.keyUpHandler);
        this.shapeTool.addEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.polygonTool.addEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.artTool.addEventListener(ActionEvent.GENERIC, this.actionHandler);
        this.jointTool.addEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.specialTool.addEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.textTool.addEventListener(ActionEvent.GENERIC, this.actionHandler);
        this.textTool.addEventListener(ActionEvent.GENERIC, this.textPlaced);
        this.triggerTool.addEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.triggerTool.addEventListener(
            ActionEvent.GENERIC,
            this.triggerPlaced,
        );
        this.arrowTool.addEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.arrowTool.addEventListener(ActionEvent.SCALE, this.actionHandler);
        this.arrowTool.addEventListener(
            ActionEvent.TRANSLATE,
            this.actionHandler,
        );
        this.arrowTool.addEventListener(ActionEvent.ROTATE, this.actionHandler);
        this.arrowTool.addEventListener(ActionEvent.DEPTH, this.actionHandler);
    }

    private removeListeners() {
        this.actionRecorder.removeEventListener(
            ActionRecorder.UNDO,
            this.undoHandler,
        );
        this.actionRecorder.removeEventListener(
            ActionRecorder.REDO,
            this.redoHandler,
        );
        this.toolBar.removeEventListener(
            ToolBar.TOOL_SELECTED,
            this.toolSelected,
        );
        this.removeEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.canvasHolder.removeEventListener(
            MouseEvent.MOUSE_WHEEL,
            this.mouseWheelHandler,
        );
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.removeEventListener(KeyboardEvent.KEY_UP, this.keyUpHandler);
        this.shapeTool.removeEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.polygonTool.removeEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.artTool.removeEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.jointTool.removeEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.specialTool.removeEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.textTool.removeEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.textTool.removeEventListener(ActionEvent.GENERIC, this.textPlaced);
        this.triggerTool.removeEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.triggerTool.removeEventListener(
            ActionEvent.GENERIC,
            this.triggerPlaced,
        );
        this.arrowTool.removeEventListener(
            ActionEvent.GENERIC,
            this.actionHandler,
        );
        this.arrowTool.removeEventListener(
            ActionEvent.SCALE,
            this.actionHandler,
        );
        this.arrowTool.removeEventListener(
            ActionEvent.TRANSLATE,
            this.actionHandler,
        );
        this.arrowTool.removeEventListener(
            ActionEvent.ROTATE,
            this.actionHandler,
        );
        this.arrowTool.removeEventListener(
            ActionEvent.DEPTH,
            this.actionHandler,
        );
    }

    public get currentTool(): Tool {
        return this._currentTool;
    }

    public set currentTool(param1: Tool) {
        if (this._currentTool) {
            if (this._currentTool == param1) {
                return;
            }
            this._currentTool.deactivate();
        }
        this._currentTool = param1;
        this._currentTool.activate();
    }

    private toolSelected(param1: Event) {
        switch (this.toolBar.currentSelection) {
            case ToolBar.ARROW:
                this.currentTool = this.arrowTool;
                break;
            case ToolBar.SHAPE:
                this.currentTool = this.shapeTool;
                break;
            case ToolBar.POLYGON:
                this.currentTool = this.polygonTool;
                break;
            case ToolBar.JOINT:
                this.currentTool = this.jointTool;
                break;
            case ToolBar.SPECIAL:
                this.currentTool = this.specialTool;
                break;
            case ToolBar.TEXT:
                this.currentTool = this.textTool;
                break;
            case ToolBar.TRIGGER:
                this.currentTool = this.triggerTool;
                break;
            case ToolBar.ART:
                this.currentTool = this.artTool;
                break;
            default:
                throw new Error("uhh what");
        }
    }

    private actionHandler(param1: ActionEvent) {
        if (param1.action.resetTested) {
            this.topMenu.levelTested = false;
        }
        this.actionRecorder.pushAction(param1.action);
        if (this.currentTool == this.arrowTool) {
            this.arrowTool.resetActionVars(param1.type);
        }
        if (this.autoSaveTimer) {
            if (
                !this.autoSaveTimer.running &&
                !(this.arrowTool.currentCanvas instanceof GroupCanvas) &&
                !this.arrowTool.vertEditOpen()
            ) {
                trace("AUTO-SAVING LEVEL DATA");
                Settings.sharedObject.data["editorLevelData"] =
                    this.saverLoader.createXML();
                this.autoSaveTimer.start();
            }
        }
    }

    private undoHandler(param1: Event) {
        if (this.currentTool == this.arrowTool) {
            this.arrowTool.killTriggerSelector();
            this.arrowTool.closePoser();
            this.arrowTool.resetActionVars(ActionEvent.GENERIC);
            this.arrowTool.setInputs();
            this.canvas.relabelTriggers();
        }
    }

    private redoHandler(param1: Event) {
        if (this.currentTool == this.arrowTool) {
            this.arrowTool.killTriggerSelector();
            this.arrowTool.closePoser();
            this.arrowTool.resetActionVars(ActionEvent.GENERIC);
            this.arrowTool.setInputs();
            this.canvas.relabelTriggers();
        }
    }

    private textPlaced(param1: ActionEvent) {
        var _loc2_: ActionAdd = param1.action as ActionAdd;
        var _loc3_: TextBoxRef = _loc2_.refSprite as TextBoxRef;
        this.toolBar.pressButton(ToolBar.ARROW);
        this.arrowTool.editSelectText(_loc3_);
    }

    private triggerPlaced(param1: ActionEvent) {
        var _loc2_: ActionAdd = param1.action as ActionAdd;
        var _loc3_: RefTrigger = _loc2_.refSprite as RefTrigger;
        if (_loc3_.typeIndex == 1) {
            this.toolBar.pressButton(ToolBar.ARROW);
            this.arrowTool.beginTriggerSelector(_loc3_);
        }
    }

    private mouseDownHandler(param1: MouseEvent) {
        if (this.handNav) {
            this.currMouseX = this.mouseX;
            this.currMouseY = this.mouseY;
            this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.stageDrag);
            return;
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        if (this.handNav) {
            this.stage.removeEventListener(
                MouseEvent.MOUSE_MOVE,
                this.stageDrag,
            );
        }
    }

    private mouseWheelHandler(param1: MouseEvent) {
        var _loc2_: number = param1.delta < 0 ? -1 : 1;
        this.zoom(_loc2_, this.canvasHolder.mouseX, this.canvasHolder.mouseY);
    }

    private keyDownHandler(param1: KeyboardEvent) {
        var _loc2_: string = null;
        if (param1.target instanceof TextField) {
            return;
        }
        switch (param1.keyCode) {
            case 49:
                this.toolBar.pressButton(ToolBar.ARROW);
                break;
            case 50:
                this.toolBar.pressButton(ToolBar.SHAPE);
                break;
            case 51:
                this.toolBar.pressButton(ToolBar.POLYGON);
                break;
            case 52:
                this.toolBar.pressButton(ToolBar.ART);
                break;
            case 53:
                this.toolBar.pressButton(ToolBar.JOINT);
                break;
            case 54:
                this.toolBar.pressButton(ToolBar.SPECIAL);
                break;
            case 55:
                this.toolBar.pressButton(ToolBar.TEXT);
                break;
            case 56:
                this.toolBar.pressButton(ToolBar.TRIGGER);
                break;
            case 32:
                this.startHandNav();
                break;
            case 84:
                this.testLevel();
                break;
            case 73:
                for (_loc2_ of this.actionRecorder.dictionary.keys()) {
                }
                break;
            case 189:
                this.zoom(
                    -1,
                    this.canvasHolder.mouseX,
                    this.canvasHolder.mouseY,
                );
                break;
            case 187:
                this.zoom(
                    1,
                    this.canvasHolder.mouseX,
                    this.canvasHolder.mouseY,
                );
                break;
            case 90:
                if (param1.ctrlKey) {
                    this.actionRecorder.undo();
                }
                break;
            case 89:
                if (param1.ctrlKey) {
                    this.actionRecorder.redo();
                }
        }
        param1.stopPropagation();
    }

    private keyUpHandler(param1: KeyboardEvent) {
        if (param1.target instanceof TextField) {
            return;
        }
        switch (param1.keyCode) {
            case 32:
                this.endHandNav();
        }
    }

    private startHandNav() {
        if (this.handNav) {
            return;
        }
        this.handNav = true;
        if (this.currentTool == this.arrowTool) {
            this.arrowTool.deactivateKeepSelection();
        } else if (this.currentTool == this.polygonTool) {
            this.polygonTool.deactivateContinueDrawing();
        } else if (this.currentTool == this.artTool) {
            this.artTool.deactivateContinueDrawing();
        } else {
            this.currentTool.deactivate();
        }
        this.handCursor = new HandCursor();
        this.handCursor.x = this.mouseX;
        this.handCursor.y = this.mouseY;
        this.handCursor.mouseEnabled = this.handCursor.mouseChildren = false;
        this.addChild(this.handCursor);
        Mouse.hide();
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.followCursor);
    }

    private endHandNav() {
        if (!this.handNav) {
            return;
        }
        this.handNav = false;
        this.removeChild(this.handCursor);
        this.handCursor = null;
        if (this.currentTool == this.polygonTool) {
            this.polygonTool.activateContinueDrawing();
        } else if (this.currentTool == this.artTool) {
            this.artTool.activateContinueDrawing();
        } else {
            this.currentTool.activate();
        }
        Mouse.show();
        this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.stageDrag);
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.followCursor,
        );
        this.stage.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
    }

    private followCursor(param1: MouseEvent) {
        this.handCursor.x = this.mouseX;
        this.handCursor.y = this.mouseY;
    }

    private stageDrag(param1: MouseEvent) {
        var _loc2_: number = this.mouseX - this.currMouseX;
        var _loc3_: number = this.mouseY - this.currMouseY;
        this.canvasHolder.x = this.canvasHolder.x + _loc2_;
        this.canvasHolder.y = this.canvasHolder.y + _loc3_;
        this.currMouseX = this.mouseX;
        this.currMouseY = this.mouseY;
        if (
            this.canvasHolder.x +
            Canvas.canvasWidth * this.canvasHolder.scaleX <
            900 - this.maxBorderX
        ) {
            var _loc4_ =
                900 -
                this.maxBorderX -
                Canvas.canvasWidth * this.canvasHolder.scaleX;
            this.canvasHolder.x =
                900 -
                this.maxBorderX -
                Canvas.canvasWidth * this.canvasHolder.scaleX;
            _loc4_;
        }
        if (
            this.canvasHolder.y +
            Canvas.canvasHeight * this.canvasHolder.scaleY <
            500 - this.maxBorderY
        ) {
            _loc4_ =
                500 -
                this.maxBorderY -
                Canvas.canvasHeight * this.canvasHolder.scaleY;
            this.canvasHolder.y =
                500 -
                this.maxBorderY -
                Canvas.canvasHeight * this.canvasHolder.scaleY;
            _loc4_;
        }
        if (this.canvasHolder.x > this.maxBorderX) {
            this.canvasHolder.x = this.maxBorderX;
        }
        if (this.canvasHolder.y > this.maxBorderY) {
            this.canvasHolder.y = this.maxBorderY;
        }
        this.horizontalScroller.updateScrollTab();
        this.verticalScroller.updateScrollTab();
    }

    private zoom(param1: number, param2: number, param3: number) {
        Editor.currentZoom = Editor.currentZoom + param1;
        if (Editor.currentZoom < this.minZoom) {
            Editor.currentZoom = this.minZoom;
        }
        if (Editor.currentZoom > this.maxZoom) {
            Editor.currentZoom = this.maxZoom;
        }
        this.canvasHolder.scaleX = this.canvasHolder.scaleY = Math.pow(
            2,
            Editor.currentZoom,
        );
        var _loc4_: number =
            this.canvasHolder.x + param2 * this.canvasHolder.scaleX;
        var _loc5_: number =
            this.canvasHolder.y + param3 * this.canvasHolder.scaleY;
        var _loc6_ = this.canvasHolder.x + (450 - _loc4_);
        this.canvasHolder.x += 450 - _loc4_;
        _loc6_;
        _loc6_ = this.canvasHolder.y + (250 - _loc5_);
        this.canvasHolder.y += 250 - _loc5_;
        _loc6_;
        if (
            this.canvasHolder.x +
            Canvas.canvasWidth * this.canvasHolder.scaleX <
            900 - this.maxBorderX
        ) {
            _loc6_ =
                900 -
                this.maxBorderX -
                Canvas.canvasWidth * this.canvasHolder.scaleX;
            this.canvasHolder.x =
                900 -
                this.maxBorderX -
                Canvas.canvasWidth * this.canvasHolder.scaleX;
            _loc6_;
        }
        if (
            this.canvasHolder.y +
            Canvas.canvasHeight * this.canvasHolder.scaleY <
            500 - this.maxBorderY
        ) {
            _loc6_ =
                500 -
                this.maxBorderY -
                Canvas.canvasHeight * this.canvasHolder.scaleY;
            this.canvasHolder.y =
                500 -
                this.maxBorderY -
                Canvas.canvasHeight * this.canvasHolder.scaleY;
            _loc6_;
        }
        if (this.canvasHolder.x > this.maxBorderX) {
            this.canvasHolder.x = this.maxBorderX;
        }
        if (this.canvasHolder.y > this.maxBorderY) {
            this.canvasHolder.y = this.maxBorderY;
        }
        this.arrowTool.resizeElements();
        this.artTool.resizeElements();
        this.polygonTool.resizeElements();
        this.horizontalScroller.updateScrollTab();
        this.verticalScroller.updateScrollTab();
    }

    private putShitOnHold(param1: Event = null) {
        if (this.paused) {
            return;
        }
        this.paused = true;
        if (this._currentTool) {
            this._currentTool.deactivate();
        }
        this.removeListeners();
    }

    private resumeThatShit(param1: Event = null) {
        if (!this.paused) {
            return;
        }
        this.paused = false;
        this.addListeners();
        if (this._currentTool) {
            this._currentTool.activate();
        }
    }

    private testLevel(param1: Event = null) {
        var _loc4_: XML = null;
        var _loc5_: number = 0;
        if (this.canvas.tooManyShapes || this.canvas.tooMuchArt) {
            return;
        }
        this.toolBar.pressButton(ToolBar.ARROW);
        if (this.canvasHolder.numChildren > 1) {
            Settings.debugText.text = "exit group before testing level";
            return;
        }
        var _loc2_: XMLList = this.saverLoader.createXML().specials.sp;
        var _loc3_: number = 0;
        while (_loc3_ < _loc2_.length()) {
            _loc4_ = _loc2_[_loc3_];
            _loc5_ = int(_loc4_["t"]);
            if (_loc5_ == 16) {
                // @ts-expect-error
                if (this.checkForAbusiveText(_loc4_.child("p7"))) {
                    this.abusiveText = true;
                }
            }
            _loc3_++;
        }
        this.putShitOnHold();
        Settings.levelIndex = 2;
        Settings.characterIndex = this.canvas.startPlaceHolder.characterIndex;
        Settings.hideVehicle = this.canvas.startPlaceHolder.hideVehicle;
        Settings.stageSprite = this.stage;
        this.characterLoader = new SwfLoader(Settings.characterSWF);
        this.characterLoader.addEventListener(
            Event.COMPLETE,
            this.characterLoaded,
        );
        this.characterLoader.loadSWF();
        Settings.debugText.text = "press \'T\' again to end the test run";
        this.flags = null;
        if (this.flagHolder) {
            this.canvas.removeChild(this.flagHolder);
            this.flagHolder = null;
        }
    }

    private characterLoaded(param1: Event) {
        this.characterLoader.removeEventListener(
            Event.COMPLETE,
            this.characterLoaded,
        );
        var _loc2_: Sprite = this.characterLoader.swfContent as Sprite;
        this.characterLoader.unLoadSwf();
        var _loc3_: XML = this.saverLoader.createXML();
        var _loc4_ = new UserLevelLoader(-1, -1);
        _loc4_.levelXML = _loc3_;
        var _loc5_: Sprite = _loc4_.buildLevelSourceObject();
        Settings.currentSession = this.session = new Session(
            Settings.CURRENT_VERSION,
            _loc2_,
            _loc5_,
            Settings.CURRENT_VERSION,
            Settings.editorDebugDraw,
        );
        this.addChild(this.session);
        this.session.create();
        this.topMenu.levelTested = true;
        this.removeChild(this.canvasHolder);
        this.stage.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownSessionHandler,
        );
    }

    private keyDownSessionHandler(param1: KeyboardEvent) {
        switch (param1.keyCode) {
            case 84:
                this.endLevelTest();
                break;
            case 70:
                this.flagCharacterPosition();
        }
    }

    private checkForAbusiveText(param1: string): boolean {
        var _loc2_: boolean = false;
        param1 = param1.toLowerCase();
        var _loc3_: RegExp = / /g;
        var _loc4_: string = param1.replace(_loc3_, "");
        var _loc5_: number = 0;
        while (_loc5_ < this.abusiveStrings.length) {
            if (_loc4_.indexOf(this.abusiveStrings[_loc5_]) > -1) {
                _loc2_ = true;
            }
            _loc5_++;
        }
        return _loc2_;
    }

    private flagCharacterPosition() {
        if (!this.flags) {
            this.flags = new Array();
        }
        if (this.flags.length > 99) {
            return;
        }
        var _loc1_: b2Vec2 = this.session.character.cameraFocus.GetPosition();
        this.flags.push(new b2Vec2(_loc1_.x, _loc1_.y));
        SoundController.instance.playSoundItem("Ping");
    }

    private addFlags() {
        var _loc2_: b2Vec2 = null;
        var _loc3_: Sprite = null;
        this.flagHolder = new Sprite();
        this.canvas.addChild(this.flagHolder);
        var _loc1_: number = 0;
        while (_loc1_ < this.flags.length) {
            _loc2_ = this.flags[_loc1_];
            _loc3_ = new PositionMark();
            _loc3_.buttonMode = false;
            _loc3_.mouseEnabled = false;
            _loc3_.x = _loc2_.x * this.session.m_physScale;
            _loc3_.y = _loc2_.y * this.session.m_physScale;
            this.flagHolder.addChild(_loc3_);
            _loc1_++;
        }
    }

    private endLevelTest() {
        var _loc1_: Window = null;
        this.stage.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownSessionHandler,
        );
        this.session.die();
        this.removeChild(this.session);
        this.addChildAt(this.canvasHolder, 0);
        this.stage.focus = this.stage;
        if (this.flags) {
            this.addFlags();
        }
        this.session = null;
        Settings.currentSession = null;
        Settings.debugText.text = "";
        if (this.abusiveText) {
            this.abusiveText = false;
            this.abusiveTextPrompt = new PromptSprite(
                this.abusivePromptText,
                "ok",
            );
            _loc1_ = this.abusiveTextPrompt.window;
            this.addChild(_loc1_);
            _loc1_.center();
            this.abusiveTextPrompt.addEventListener(
                PromptSprite.BUTTON_PRESSED,
                this.abusiveTextPromptAccepted,
            );
        } else {
            this.resumeThatShit();
        }
    }

    private abusiveTextPromptAccepted(param1: Event) {
        this.abusiveTextPrompt.removeEventListener(
            PromptSprite.BUTTON_PRESSED,
            this.loginPromptAccepted,
        );
        this.abusiveTextPrompt = null;
        this.resumeThatShit();
    }

    private shapeLimitStatus(param1: Event) {
        if (this.canvas.tooManyShapes) {
            Settings.debugText.text = "You\'ve reached the shape limit.  Delete some objects.";
        } else {
            Settings.debugText.text = "";
        }
    }

    private artLimitStatus(param1: Event) {
        if (this.canvas.tooMuchArt) {
            Settings.debugText.text = "You\'ve reached the art limit.  Delete some art objects.";
        } else {
            Settings.debugText.text = "";
        }
    }

    private exitToMainMenu(param1: Event) {
        Tracker.trackEvent(Tracker.EDITOR, Tracker.GOTO_MAIN_MENU);
        Settings.debugText.text = "";
        this.dispatchEvent(new NavigationEvent(NavigationEvent.MAIN_MENU));
    }

    private clearStage(param1: Event = null) {
        var _loc3_: RefShape = null;
        var _loc4_: Special = null;
        var _loc5_: RefGroup = null;
        var _loc6_: RefJoint = null;
        var _loc7_: RefTrigger = null;
        var _loc2_: number = this.canvas.shapes.numChildren;
        while (_loc2_ > 0) {
            _loc3_ = this.canvas.shapes.getChildAt(_loc2_ - 1) as RefShape;
            _loc3_.deleteSelf(this.canvas);
            _loc2_--;
        }
        _loc2_ = this.canvas.special.numChildren;
        while (_loc2_ > 0) {
            _loc4_ = this.canvas.special.getChildAt(_loc2_ - 1) as Special;
            _loc4_.deleteSelf(this.canvas);
            _loc2_--;
        }
        _loc2_ = this.canvas.groups.numChildren;
        while (_loc2_ > 0) {
            _loc5_ = this.canvas.groups.getChildAt(_loc2_ - 1) as RefGroup;
            _loc5_.deleteSelf(this.canvas);
            _loc2_--;
        }
        _loc2_ = this.canvas.joints.numChildren;
        while (_loc2_ > 0) {
            _loc6_ = this.canvas.joints.getChildAt(_loc2_ - 1) as RefJoint;
            _loc6_.deleteSelf(this.canvas);
            _loc2_--;
        }
        _loc2_ = this.canvas.triggers.numChildren;
        while (_loc2_ > 0) {
            _loc7_ = this.canvas.triggers.getChildAt(_loc2_ - 1) as RefTrigger;
            _loc7_.deleteSelf(this.canvas);
            _loc2_--;
        }
        this.canvas.startPlaceHolder.x = 300;
        var _loc8_ = 100 + Canvas.canvasHeight / 2;
        this.canvas.startPlaceHolder.y = 100 + Canvas.canvasHeight / 2;
        _loc8_;
        Editor.currentZoom = 0;
        this.canvasHolder.scaleX = this.canvasHolder.scaleY = 1;
        this.canvasHolder.x = 0;
        _loc8_ = -Canvas.canvasHeight / 2;
        this.canvasHolder.y = -Canvas.canvasHeight / 2;
        _loc8_;
        this.horizontalScroller.updateScrollTab();
        this.verticalScroller.updateScrollTab();
        this.actionRecorder.clearActions();
        delete Settings.sharedObject.data["editorLevelData"];
    }

    private updateCopiedVerts(param1: Event = null) {
        this.arrowTool.updateCopiedVerts();
    }

    private timerHandler(param1: TimerEvent) {
        trace("autosave timer interval");
        this.autoSaveTimer.stop();
    }

    public die() {
        this.removeListeners();
        this.canvas.removeEventListener(
            Canvas.SHAPE_LIMIT_STATUS,
            this.shapeLimitStatus,
        );
        this.canvas.removeEventListener(
            Canvas.ART_LIMIT_STATUS,
            this.artLimitStatus,
        );
        this.topMenu.removeEventListener(TopMenu.MENU_BUSY, this.putShitOnHold);
        this.topMenu.removeEventListener(
            TopMenu.MENU_IDLE,
            this.resumeThatShit,
        );
        this.topMenu.removeEventListener(TopMenu.TEST_LEVEL, this.testLevel);
        this.topMenu.removeEventListener(TopMenu.CLEAR_STAGE, this.clearStage);
        this.topMenu.removeEventListener(
            TopMenu.GO_MAIN_MENU,
            this.exitToMainMenu,
        );
        this.topMenu.die();
        this.helpWindow.die();
        this.toolBar.die();
        this.horizontalScroller.die();
        this.verticalScroller.die();
        this.actionRecorder.die();
        this.saverLoader.die();
        this.saverLoader.removeEventListener(
            SaverLoader.CLEAR_STAGE,
            this.clearStage,
        );
        this.saverLoader.removeEventListener(
            SaverLoader.UPDATE_COPIED_VERTS,
            this.updateCopiedVerts,
        );
        this.saverLoader = null;
        this.arrowTool.die();
        this.shapeTool.die();
        this.polygonTool.die();
        this.jointTool.die();
        this.specialTool.die();
        this.textTool.die();
        this.triggerTool.die();
        this.artTool.die();
        if (this.autoSaveTimer) {
            this.autoSaveTimer.stop();
            this.autoSaveTimer.removeEventListener(
                TimerEvent.TIMER,
                this.timerHandler,
            );
        }
        delete Settings.sharedObject.data["editorLevelData"];
    }
}