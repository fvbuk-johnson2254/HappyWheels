import Settings from "@/com/totaljerkface/game/Settings";
import ChoiceSprite from "@/com/totaljerkface/game/editor/ChoiceSprite";
import HelpWindow from "@/com/totaljerkface/game/editor/HelpWindow";
import LevelOptionsMenu from "@/com/totaljerkface/game/editor/LevelOptionsMenu";
import LoadMenu from "@/com/totaljerkface/game/editor/LoadMenu";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import SaveMenu from "@/com/totaljerkface/game/editor/SaveMenu";
import SaverLoader from "@/com/totaljerkface/game/editor/SaverLoader";
import CheckBox from "@/com/totaljerkface/game/editor/ui/CheckBox";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import TweenLite from "@/gs/TweenLite";
import Strong from "@/gs/easing/Strong";
import Sprite from "flash/display/Sprite";
import StageDisplayState from "flash/display/StageDisplayState";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol773")] */
@boundClass
export default class TopMenu extends Sprite {
    public static MENU_BUSY: string;
    public static MENU_IDLE: string = "menuidle";
    public static TEST_LEVEL: string = "testlevel";
    public static CLEAR_STAGE: string = "clearstage";
    public static GO_MAIN_MENU: string = "gomainmenu";
    public bg: Sprite;
    public menuText: Sprite;
    private mainMenuButton: GenericButton;
    private optionsButton: GenericButton;
    private saveButton: GenericButton;
    private loadButton: GenericButton;
    private clearButton: GenericButton;
    private testButton: GenericButton;
    private helpCheck: CheckBox;
    private debugCheck: CheckBox;
    private fullScreenCheck: CheckBox;
    private _help: boolean;
    private _useDebugDraw: boolean;
    private _useFullScreen: boolean;
    private bgWidth: number;
    private bgHeight: number;
    private hiddenY: number;
    private edgePixels: number = 20;
    private tweenTime: number = 0.5;
    private saveMenu: SaveMenu;
    private loadMenu: LoadMenu;
    private levelOptionsMenu: LevelOptionsMenu;
    private promptSprite: PromptSprite;
    private currentLevelDataObject: LevelDataObject;
    public levelTested: boolean;

    public init() {
        var _loc1_: number = 0;
        this._useFullScreen =
            this.stage.displayState == StageDisplayState.FULL_SCREEN_INTERACTIVE
                ? true
                : false;
        _loc1_ = 10;
        this.testButton = new GenericButton("Test Level >>", 16776805, 90, 0);
        this.testButton.x = 10;
        this.testButton.y = _loc1_;
        this.addChild(this.testButton);
        _loc1_ += 40;
        this.optionsButton = new GenericButton("Level Options", 16613761, 90);
        this.optionsButton.x = 10;
        this.optionsButton.y = _loc1_;
        this.addChild(this.optionsButton);
        _loc1_ += 30;
        this.saveButton = new GenericButton("Save Level", 4032711, 90);
        this.saveButton.x = 10;
        this.saveButton.y = _loc1_;
        this.addChild(this.saveButton);
        _loc1_ += 30;
        this.loadButton = new GenericButton("Load Level", 4032711, 90);
        this.loadButton.x = 10;
        this.loadButton.y = _loc1_;
        this.addChild(this.loadButton);
        _loc1_ += 30;
        this.clearButton = new GenericButton("New Level", 4032711, 90);
        this.clearButton.x = 10;
        this.clearButton.y = _loc1_;
        this.addChild(this.clearButton);
        _loc1_ += 30;
        this.helpCheck = new CheckBox("show help", "help");
        this.helpCheck.x = 10;
        this.helpCheck.y = _loc1_;
        this.addChild(this.helpCheck);
        _loc1_ += 25;
        this.debugCheck = new CheckBox("debug draw", "useDebugDraw", false);
        this.debugCheck.x = 10;
        this.debugCheck.y = _loc1_;
        this.debugCheck.helpCaption = "Debug draw shows all physics shapes and joints when testing your level.";
        this.addChild(this.debugCheck);
        _loc1_ += 25;
        this.fullScreenCheck = new CheckBox(
            "fullscreen",
            "useFullScreen",
            this._useFullScreen,
        );
        this.fullScreenCheck.x = 10;
        this.fullScreenCheck.y = _loc1_;
        this.fullScreenCheck.helpCaption = "Fullscreen mode may not function with older flash plugins. Performance may be greatly reduced when using fullscreen mode. Non-vector graphics will appear pixelated due to scaling up. The only blood setting that will look as intended will be setting 2, which is rendered in vector. Press escape at any time to exit fullscreen mode.";
        this.addChild(this.fullScreenCheck);
        _loc1_ += 30;
        this.mainMenuButton = new GenericButton("<< Main Menu", 16613761, 90);
        this.mainMenuButton.x = 10;
        this.mainMenuButton.y = _loc1_;
        this.addChild(this.mainMenuButton);
        this.bgWidth = this.bg.width;
        this.bgHeight = this.bg.height;
        this.hiddenY = this.edgePixels - this.bgHeight;
        this.x = 10;
        this.y = this.hiddenY;
        this.addEventListener(MouseEvent.ROLL_OVER, this.rollOverHandler);
        this.addEventListener(MouseEvent.ROLL_OUT, this.rollOutHandler);
        this.testButton.addEventListener(MouseEvent.MOUSE_UP, this.testLevel);
        this.mainMenuButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.mainMenuPress,
        );
        this.clearButton.addEventListener(MouseEvent.MOUSE_UP, this.clearPress);
        this.optionsButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.openOptionsMenu,
        );
        this.helpCheck.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.helpToggle,
        );
        this.debugCheck.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.debugToggle,
        );
        this.fullScreenCheck.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.fullScreenToggle,
        );
        HelpWindow.instance.addEventListener(
            Window.WINDOW_CLOSED,
            this.helpClosed,
        );
        if (Settings.user_id > 0) {
            this.saveButton.addEventListener(
                MouseEvent.MOUSE_UP,
                this.openSaveMenu,
            );
            this.loadButton.addEventListener(
                MouseEvent.MOUSE_UP,
                this.openLoadMenu,
            );
        } else {
            this.saveButton.addEventListener(
                MouseEvent.MOUSE_UP,
                this.openLoginWarning,
            );
            this.loadButton.addEventListener(
                MouseEvent.MOUSE_UP,
                this.openLoginWarning,
            );
        }
    }

    private rollOverHandler(param1: MouseEvent) {
        if (this.parent) {
            this.parent.addChild(this);
        }
        TweenLite.to(this, this.tweenTime, {
            y: 0,
            ease: Strong.easeInOut,
        });
        TweenLite.to(this.menuText, this.tweenTime, {
            alpha: 0,
            ease: Strong.easeInOut,
        });
    }

    private rollOutHandler(param1: MouseEvent) {
        TweenLite.to(this, this.tweenTime, {
            y: this.hiddenY,
            ease: Strong.easeInOut,
        });
        TweenLite.to(this.menuText, this.tweenTime, {
            alpha: 1,
            ease: Strong.easeInOut,
        });
    }

    private get help(): boolean {
        return this._help;
    }

    private set help(param1: boolean) {
        this._help = param1;
    }

    private get useDebugDraw(): boolean {
        return this._useDebugDraw;
    }

    private set useFullScreen(param1: boolean) {
        this._useFullScreen = param1;
        if (param1) {
            this.stage.displayState = StageDisplayState.FULL_SCREEN_INTERACTIVE;
        } else {
            this.stage.displayState = StageDisplayState.NORMAL;
        }
    }

    private get useFullScreen(): boolean {
        return this._useFullScreen;
    }

    private set useDebugDraw(param1: boolean) {
        this._useDebugDraw = param1;
    }

    private testLevel(param1: MouseEvent) {
        this.dispatchEvent(new Event(TopMenu.TEST_LEVEL));
    }

    private openLoginWarning(param1: MouseEvent) {
        this.openPrompt(
            "WHAT THE HELL<br>ARE YOU DOING?<br>You must be logged in to save and load levels.",
            "oh ok",
        );
    }

    private openPrompt(param1: string, param2: string) {
        this.dispatchEvent(new Event(TopMenu.MENU_BUSY));
        this.promptSprite = new PromptSprite(param1, param2);
        var _loc3_: Window = this.promptSprite.window;
        this.parent.addChild(_loc3_);
        _loc3_.center();
        this.promptSprite.addEventListener(
            PromptSprite.BUTTON_PRESSED,
            this.promptSpriteClosed,
        );
    }

    private promptSpriteClosed(param1: Event) {
        this.promptSprite.removeEventListener(
            PromptSprite.BUTTON_PRESSED,
            this.promptSpriteClosed,
        );
        this.promptSprite = null;
        this.dispatchEvent(new Event(TopMenu.MENU_IDLE));
    }

    private openOptionsMenu(param1: MouseEvent) {
        if (this.levelOptionsMenu) {
            return;
        }
        this.levelOptionsMenu = new LevelOptionsMenu();
        var _loc2_: Window = this.levelOptionsMenu.window;
        this.parent.addChild(_loc2_);
        _loc2_.center();
        this.levelOptionsMenu.addEventListener(
            Window.WINDOW_CLOSED,
            this.closeOptionsMenu,
        );
    }

    private closeOptionsMenu(param1: Event = null) {
        this.levelOptionsMenu.removeEventListener(
            Window.WINDOW_CLOSED,
            this.closeOptionsMenu,
        );
        this.levelOptionsMenu.die();
        this.levelOptionsMenu = null;
    }

    private openSaveMenu(param1: MouseEvent) {
        if (!this.levelTested) {
            this.openPrompt("Please test your level before saving.", "ok");
            return;
        }
        if (this.saveMenu) {
            return;
        }
        if (this.loadMenu) {
            this.closeLoadMenu();
        }
        this.dispatchEvent(new Event(TopMenu.MENU_BUSY));
        this.saveMenu = new SaveMenu(this.currentLevelDataObject);
        var _loc2_: Window = this.saveMenu.window;
        this.parent.addChild(_loc2_);
        _loc2_.center();
        this.saveMenu.addEventListener(SaveMenu.SAVE_NEW, this.saveNewLevel);
        this.saveMenu.addEventListener(SaveMenu.SAVE_OVER, this.saveOverLevel);
        this.saveMenu.addEventListener(
            Window.WINDOW_CLOSED,
            this.closeSaveMenu,
        );
    }

    private openLoadMenu(param1: MouseEvent) {
        if (this.loadMenu) {
            return;
        }
        if (this.saveMenu) {
            this.closeSaveMenu();
        }
        this.dispatchEvent(new Event(TopMenu.MENU_BUSY));
        this.loadMenu = new LoadMenu();
        var _loc2_: Window = this.loadMenu.window;
        this.parent.addChild(_loc2_);
        _loc2_.center();
        this.loadMenu.addEventListener(LoadMenu.LOAD_SELECTED, this.loadLevel);
        this.loadMenu.addEventListener(
            LoadMenu.DELETE_SELECTED,
            this.deleteCheck,
        );
        this.loadMenu.addEventListener(LoadMenu.IMPORT_DATA, this.importData);
        this.loadMenu.addEventListener(
            Window.WINDOW_CLOSED,
            this.closeLoadMenu,
        );
    }

    private closeSaveMenu(param1: Event = null) {
        this.saveMenu.removeEventListener(SaveMenu.SAVE_NEW, this.saveNewLevel);
        this.saveMenu.removeEventListener(
            SaveMenu.SAVE_OVER,
            this.saveOverLevel,
        );
        this.saveMenu.removeEventListener(
            Window.WINDOW_CLOSED,
            this.closeSaveMenu,
        );
        this.saveMenu.die();
        this.saveMenu = null;
        this.dispatchEvent(new Event(TopMenu.MENU_IDLE));
    }

    private closeLoadMenu(param1: Event = null) {
        this.loadMenu.removeEventListener(
            LoadMenu.LOAD_SELECTED,
            this.loadLevel,
        );
        this.loadMenu.removeEventListener(
            LoadMenu.DELETE_SELECTED,
            this.deleteCheck,
        );
        this.loadMenu.removeEventListener(
            LoadMenu.IMPORT_DATA,
            this.importData,
        );
        this.loadMenu.removeEventListener(
            Window.WINDOW_CLOSED,
            this.closeLoadMenu,
        );
        this.loadMenu.die();
        this.loadMenu = null;
        this.dispatchEvent(new Event(TopMenu.MENU_IDLE));
    }

    private saveNewLevel(param1: Event) {
        trace("save new level");
        var _loc2_: string = this.saveMenu.levelName;
        var _loc3_: string = this.saveMenu.comments;
        this.closeSaveMenu();
        this.dispatchEvent(new Event(TopMenu.MENU_BUSY));
        var _loc4_ = SaverLoader.instance;
        _loc4_.addEventListener(SaverLoader.SAVE_COMPLETE, this.saveComplete);
        _loc4_.addEventListener(SaverLoader.GENERIC_ERROR, this.saveComplete);
        _loc4_.saveNewLevel(_loc2_, _loc3_);
    }

    private saveOverLevel(param1: Event) {
        trace("save over level");
        var _loc2_: string = this.saveMenu.levelName;
        var _loc3_: string = this.saveMenu.comments;
        this.closeSaveMenu();
        this.dispatchEvent(new Event(TopMenu.MENU_BUSY));
        var _loc4_ = SaverLoader.instance;
        _loc4_.addEventListener(SaverLoader.SAVE_COMPLETE, this.saveComplete);
        _loc4_.addEventListener(SaverLoader.GENERIC_ERROR, this.saveComplete);
        _loc4_.saveOverLevel(this.currentLevelDataObject.id, _loc2_, _loc3_);
    }

    private saveComplete(param1: Event = null) {
        var _loc3_: string = null;
        var _loc4_: ChoiceSprite = null;
        var _loc5_: Window = null;
        var _loc2_ = SaverLoader.instance;
        _loc2_.removeEventListener(
            SaverLoader.SAVE_COMPLETE,
            this.saveComplete,
        );
        _loc2_.removeEventListener(
            SaverLoader.GENERIC_ERROR,
            this.saveComplete,
        );
        if (param1.type == SaverLoader.SAVE_COMPLETE) {
            this.currentLevelDataObject = _loc2_.lastSavedData;
            _loc3_ = "Your level saved successfully.<br><br>Would you like to publish<br>your level now?<br><br>";
            _loc4_ = new ChoiceSprite(
                _loc3_,
                ">> Publish Level <<",
                "Not Yet!",
                true,
                280,
                120,
                5162061,
                16613761,
                0,
            );
            _loc5_ = _loc4_.window;
            this.parent.addChild(_loc5_);
            _loc5_.center();
            LoadMenu.levelDataArray = null;
            _loc4_.addEventListener(
                ChoiceSprite.ANSWER_CHOSEN,
                this.publishChoiceSelected,
                false,
                0,
                true,
            );
            _loc4_.answer1Btn.helpString = "When published, a level will be submitted to the public user level browser. Once a level is published, its contents cannot be altered, so make sure everything is exactly as you\'d like it before hitting this button. You may publish one level per 24 hours.";
            return;
        }
        this.dispatchEvent(new Event(TopMenu.MENU_IDLE));
    }

    private publishChoiceSelected(param1: Event) {
        var _loc4_: SaverLoader = null;
        var _loc2_: ChoiceSprite = param1.target as ChoiceSprite;
        _loc2_.removeEventListener(
            ChoiceSprite.ANSWER_CHOSEN,
            this.publishChoiceSelected,
        );
        var _loc3_: number = _loc2_.index;
        _loc2_.die();
        if (_loc3_ == 0) {
            _loc4_ = SaverLoader.instance;
            _loc4_.addEventListener(
                SaverLoader.PUBLISH_COMPLETE,
                this.publishComplete,
            );
            _loc4_.addEventListener(
                SaverLoader.GENERIC_ERROR,
                this.publishComplete,
            );
            _loc4_.publishLevel(this.currentLevelDataObject.id);
            return;
        }
        this.dispatchEvent(new Event(TopMenu.MENU_IDLE));
    }

    private publishComplete(param1: Event) {
        var _loc2_ = SaverLoader.instance;
        _loc2_.removeEventListener(
            SaverLoader.PUBLISH_COMPLETE,
            this.publishComplete,
        );
        _loc2_.removeEventListener(
            SaverLoader.GENERIC_ERROR,
            this.publishComplete,
        );
        if (param1.type == SaverLoader.PUBLISH_COMPLETE) {
            this.openPrompt(
                "Your level was successfully published. It should appear in the user level browser momentarily.",
                "ok",
            );
            LoadMenu.levelDataArray = null;
            return;
        }
        this.dispatchEvent(new Event(TopMenu.MENU_IDLE));
    }

    private loadLevel(param1: Event) {
        trace("load level");
        this.currentLevelDataObject = this.loadMenu.currentLevelInfo;
        var _loc2_: number = this.currentLevelDataObject.id;
        this.closeLoadMenu();
        this.dispatchEvent(new Event(TopMenu.MENU_BUSY));
        var _loc3_ = SaverLoader.instance;
        _loc3_.addEventListener(SaverLoader.LOAD_COMPLETE, this.loadComplete);
        _loc3_.addEventListener(SaverLoader.GENERIC_ERROR, this.loadComplete);
        _loc3_.loadLevel(_loc2_);
    }

    public importData(param1: Event) {
        trace("load level");
        this.currentLevelDataObject = null;
        var _loc2_: XML = this.loadMenu.levelData;
        this.closeLoadMenu();
        var _loc3_ = SaverLoader.instance;
        if (_loc3_.checkStolen(_loc2_)) {
            this.openPrompt("Invalid data.", "oh, ok");
        } else {
            _loc3_.importLevelData(_loc2_);
        }
    }

    public importLevel(param1: number, param2: number) {
        trace("importing level");
        this.dispatchEvent(new Event(TopMenu.MENU_BUSY));
        var _loc3_ = SaverLoader.instance;
        _loc3_.addEventListener(SaverLoader.LOAD_COMPLETE, this.loadComplete);
        _loc3_.addEventListener(SaverLoader.GENERIC_ERROR, this.loadComplete);
        _loc3_.loadLevel(param1, param2);
    }

    private loadComplete(param1: Event) {
        var _loc2_ = SaverLoader.instance;
        _loc2_.removeEventListener(
            SaverLoader.LOAD_COMPLETE,
            this.loadComplete,
        );
        _loc2_.removeEventListener(
            SaverLoader.GENERIC_ERROR,
            this.loadComplete,
        );
        if (param1.type != SaverLoader.LOAD_COMPLETE) {
            this.currentLevelDataObject = null;
        }
        this.dispatchEvent(new Event(TopMenu.MENU_IDLE));
    }

    private deleteCheck(param1: Event) {
        var _loc2_ = new ChoiceSprite(
            "Are you sure you\'d like to delete this level?",
            "yes",
            "no",
        );
        var _loc3_: Window = _loc2_.window;
        this.parent.addChild(_loc3_);
        _loc3_.center();
        _loc2_.addEventListener(
            ChoiceSprite.ANSWER_CHOSEN,
            this.deleteLevel,
            false,
            0,
            true,
        );
    }

    private deleteLevel(param1: Event) {
        var _loc2_: ChoiceSprite = param1.target as ChoiceSprite;
        _loc2_.removeEventListener(
            ChoiceSprite.ANSWER_CHOSEN,
            this.deleteLevel,
        );
        var _loc3_: number = _loc2_.index;
        _loc2_.die();
        if (_loc3_ != 0) {
            return;
        }
        trace("delete level");
        this.currentLevelDataObject = this.loadMenu.currentLevelInfo;
        var _loc4_: number = this.currentLevelDataObject.id;
        var _loc5_ = SaverLoader.instance;
        _loc5_.addEventListener(
            SaverLoader.DELETE_COMPLETE,
            this.deleteComplete,
        );
        _loc5_.addEventListener(SaverLoader.GENERIC_ERROR, this.deleteComplete);
        _loc5_.deleteLevel(_loc4_, this.currentLevelDataObject.isPublic);
    }

    private deleteComplete(param1: Event) {
        var _loc2_ = SaverLoader.instance;
        _loc2_.removeEventListener(
            SaverLoader.DELETE_COMPLETE,
            this.deleteComplete,
        );
        _loc2_.removeEventListener(
            SaverLoader.GENERIC_ERROR,
            this.deleteComplete,
        );
        if (param1.type == SaverLoader.DELETE_COMPLETE) {
            this.openPrompt("Your level was deleted.", "ok");
            this.loadMenu.loadLevels();
            return;
        }
    }

    private mainMenuPress(param1: MouseEvent) {
        var _loc2_ = new ChoiceSprite(
            "Are you sure you\'d like to exit to the main menu?<br>Unsaved work will be lost<br>FOREVER.",
            "yes",
            "no",
        );
        var _loc3_: Window = _loc2_.window;
        this.parent.addChild(_loc3_);
        _loc3_.center();
        _loc2_.addEventListener(
            ChoiceSprite.ANSWER_CHOSEN,
            this.mainMenuResult,
            false,
            0,
            true,
        );
        this.dispatchEvent(new Event(TopMenu.MENU_BUSY));
    }

    private mainMenuResult(param1: Event) {
        var _loc2_: ChoiceSprite = param1.target as ChoiceSprite;
        _loc2_.removeEventListener(
            ChoiceSprite.ANSWER_CHOSEN,
            this.mainMenuResult,
        );
        var _loc3_: number = _loc2_.index;
        _loc2_.die();
        if (_loc3_ == 0) {
            this.dispatchEvent(new Event(TopMenu.GO_MAIN_MENU));
        }
        this.dispatchEvent(new Event(TopMenu.MENU_IDLE));
    }

    private clearPress(param1: MouseEvent) {
        var _loc2_ = new ChoiceSprite(
            "Are you sure you\'d like to clear the stage?<br>This cannot be undone.",
            "yes",
            "no",
        );
        var _loc3_: Window = _loc2_.window;
        this.parent.addChild(_loc3_);
        _loc3_.center();
        _loc2_.addEventListener(
            ChoiceSprite.ANSWER_CHOSEN,
            this.clearResult,
            false,
            0,
            true,
        );
        this.dispatchEvent(new Event(TopMenu.MENU_BUSY));
    }

    private clearResult(param1: Event) {
        var _loc2_: ChoiceSprite = param1.target as ChoiceSprite;
        _loc2_.removeEventListener(
            ChoiceSprite.ANSWER_CHOSEN,
            this.clearResult,
        );
        var _loc3_: number = _loc2_.index;
        _loc2_.die();
        if (_loc3_ == 0) {
            this.currentLevelDataObject = null;
            this.dispatchEvent(new Event(TopMenu.CLEAR_STAGE));
        }
        this.dispatchEvent(new Event(TopMenu.MENU_IDLE));
    }

    private helpToggle(param1: ValueEvent) {
        if (HelpWindow.instance.window) {
            HelpWindow.instance.closeWindow();
        } else {
            HelpWindow.instance.createWindow();
            this.parent.addChild(HelpWindow.instance.window);
        }
    }

    private helpClosed(param1: Event) {
        this.helpCheck.setValue(false);
    }

    private debugToggle(param1: ValueEvent) {
        Settings.editorDebugDraw = param1.value;
        trace(this._useDebugDraw);
    }

    private fullScreenToggle(param1: ValueEvent) {
        this.useFullScreen = param1.value;
    }

    public die() {
        this.removeEventListener(MouseEvent.ROLL_OVER, this.rollOverHandler);
        this.removeEventListener(MouseEvent.ROLL_OUT, this.rollOutHandler);
        if (this.levelOptionsMenu) {
            this.closeOptionsMenu();
        }
        this.testButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.testLevel,
        );
        this.optionsButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.openOptionsMenu,
        );
        this.saveButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.openSaveMenu,
        );
        this.loadButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.openLoadMenu,
        );
        this.clearButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.clearPress,
        );
        this.mainMenuButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mainMenuPress,
        );
        this.helpCheck.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.helpToggle,
        );
        HelpWindow.instance.removeEventListener(
            Window.WINDOW_CLOSED,
            this.helpClosed,
        );
        this.saveButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.openLoginWarning,
        );
        this.loadButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.openLoginWarning,
        );
    }
}