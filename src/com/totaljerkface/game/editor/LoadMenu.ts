import Settings from "@/com/totaljerkface/game/Settings";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import LoadLevelItem from "@/com/totaljerkface/game/editor/ui/LoadLevelItem";
import SpecialListScroller from "@/com/totaljerkface/game/editor/ui/SpecialListScroller";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import SecurityErrorEvent from "flash/events/SecurityErrorEvent";
import URLLoader from "flash/net/URLLoader";
import URLRequest from "flash/net/URLRequest";
import URLRequestMethod from "flash/net/URLRequestMethod";
import URLVariables from "flash/net/URLVariables";
import TextField from "flash/text/TextField";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol783")] */
@boundClass
export default class LoadMenu extends Sprite {
    public static levelDataArray: any[];
    public static LOAD_SELECTED: string = "loadselected";
    public static DELETE_SELECTED: string = "deleteselected";
    public static IMPORT_DATA: string = "importdata";
    private static windowX: number = 30;
    private static windowY: number = 250;
    public loaderText: TextField;
    public errorText: TextField;
    public listBg: Sprite;
    public levelText: TextField;
    public refreshButton: Sprite;
    private loadButton: GenericButton;
    private deleteButton: GenericButton;
    private importButton: GenericButton;
    private loader: URLLoader;
    private levelList: any[];
    private listMask: Sprite;
    private listHolder: Sprite;
    private list: Sprite;
    private scroller: SpecialListScroller;
    private disableSpin: boolean;
    private _leveldata: XML;
    private _currentItem: LoadLevelItem;
    private _window: Window;

    constructor() {
        super();
        this.init();
    }

    private init() {
        this.loaderText.embedFonts = this.errorText.embedFonts = true;
        this.loadButton = new GenericButton("Load Level", 16613761, 200);
        this.loadButton.x = 20;
        this.loadButton.y = 260;
        this.addChild(this.loadButton);
        this.loadButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.loadSelected,
        );
        this.deleteButton = new GenericButton("Delete Level", 16776805, 200, 0);
        this.deleteButton.x = 20;
        this.deleteButton.y = this.loadButton.y + 28;
        this.addChild(this.deleteButton);
        this.deleteButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.deleteSelected,
        );
        this.importButton = new GenericButton(
            "Import Level Data",
            4032711,
            200,
        );
        this.importButton.x = 20;
        this.importButton.y = 408;
        this.addChild(this.importButton);
        this.importButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.importLevel,
        );
        this.refreshButton.buttonMode = true;
        this.buildWindow();
        this._window.resize();
        if (LoadMenu.levelDataArray) {
            this.refreshButton.addEventListener(
                MouseEvent.MOUSE_UP,
                this.loadLevels,
                false,
                0,
                true,
            );
            this.buildList();
        } else {
            this.loadLevels();
        }
    }

    public loadLevels(param1: MouseEvent = null) {
        this.clearList();
        this.refreshButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.loadLevels,
        );
        var _loc2_ = new URLRequest(Settings.siteURL + "get_level.hw");
        _loc2_.method = URLRequestMethod.POST;
        var _loc3_ = new URLVariables();
        _loc3_.action = "get_cmb_by_user";
        _loc2_.data = _loc3_;
        this.loader = new URLLoader();
        this.addLoaderListeners();
        this.loader.load(_loc2_);
        this.addEventListener(Event.ENTER_FRAME, this.spin, false, 0, true);
    }

    private addLoaderListeners() {
        this.loader.addEventListener(Event.COMPLETE, this.dataLoadComplete);
        this.loader.addEventListener(
            SecurityErrorEvent.SECURITY_ERROR,
            this.securityErrorHandler,
        );
    }

    private removeLoaderListeners() {
        this.loader.removeEventListener(Event.COMPLETE, this.dataLoadComplete);
        this.loader.removeEventListener(
            SecurityErrorEvent.SECURITY_ERROR,
            this.securityErrorHandler,
        );
    }

    private dataLoadComplete(param1: Event) {
        var _loc2_: string = null;
        var _loc4_: PromptSprite = null;
        var _loc8_: number = 0;
        var _loc9_: any[] = null;
        var _loc10_: Window = null;
        var _loc11_: XML = null;
        var _loc12_: LevelDataObject = null;
        this.removeLoaderListeners();
        this.disableSpin = true;
        _loc2_ = this.loader.data.toString();
        var _loc3_: string = _loc2_.substr(0, 8);
        trace("dataString " + _loc3_);
        if (_loc3_.indexOf("<html>") > -1) {
            _loc4_ = new PromptSprite(
                "There was an unexpected system Error",
                "oh",
            );
        } else if (_loc3_.indexOf("failure") > -1) {
            _loc9_ = _loc2_.split(":");
            if (_loc9_[1] == "invalid_action") {
                _loc4_ = new PromptSprite(
                    "An invalid action was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc9_[1] == "app_error") {
                _loc4_ = new PromptSprite(
                    "Sorry, there was an application error. It was most likely database related. Please try again in a moment.",
                    "ok",
                );
            } else if (_loc9_[1] == "not_logged_in") {
                _loc4_ = new PromptSprite(
                    "Sorry, you are no longer logged in.",
                    "ok",
                );
            } else {
                _loc4_ = new PromptSprite(
                    "An unknown Error has occurred.",
                    "oh",
                );
            }
        }
        if (_loc4_) {
            _loc10_ = _loc4_.window;
            if (this.stage) {
                this.stage.addChild(_loc10_);
                _loc10_.center();
            }
            return;
        }
        _loc2_ = this.loader.data.toString();
        var _loc5_: any[] = _loc2_.split(":");
        if (_loc5_[0] == "failure") {
            trace("loading failure");
        }
        var _loc6_ = new XML(this.loader.data.toString());
        LoadMenu.levelDataArray = new Array();
        var _loc7_ = int(_loc6_["§private§"].lvs.lv.length());
        trace("total private levels " + _loc7_);
        _loc8_ = 0;
        while (_loc8_ < _loc7_) {
            _loc11_ = _loc6_["§private§"].lvs.lv[_loc8_];
            _loc12_ = new LevelDataObject(
                _loc11_["id"],
                _loc11_["ln"],
                _loc11_["ui"],
                _loc11_["un"],
                0,
                0,
                0,
                _loc11_["dc"],
                _loc11_.uc,
                _loc11_["pc"],
                0,
                0,
                0,
            );
            LoadMenu.levelDataArray.push(_loc12_);
            _loc8_++;
        }
        _loc7_ = int(_loc6_.published.lvs.lv.length());
        trace("total published levels " + _loc7_);
        _loc8_ = 0;
        while (_loc8_ < _loc7_) {
            _loc11_ = _loc6_.published.lvs.lv[_loc8_];
            _loc12_ = new LevelDataObject(
                _loc11_["id"],
                _loc11_["ln"],
                _loc11_["ui"],
                _loc11_["un"],
                0,
                0,
                0,
                _loc11_["dc"],
                _loc11_.uc,
                _loc11_["pc"],
                0,
                0,
                1,
            );
            LoadMenu.levelDataArray.push(_loc12_);
            _loc8_++;
        }
        this.loaderText.text = "" + LoadMenu.levelDataArray.length + " total";
        this.buildList();
    }

    private spin(param1: Event) {
        this.refreshButton.rotation = (this.refreshButton.rotation + 15) % 360;
        if (this.refreshButton.rotation == 0 && this.disableSpin) {
            this.disableSpin = false;
            this.removeEventListener(Event.ENTER_FRAME, this.spin);
            this.refreshButton.addEventListener(
                MouseEvent.MOUSE_UP,
                this.loadLevels,
                false,
                0,
                true,
            );
        }
    }

    private securityErrorHandler(param1: SecurityErrorEvent) {
        trace(param1.text);
        this.removeLoaderListeners();
    }

    private buildList() {
        var _loc3_: LevelDataObject = null;
        var _loc4_: LoadLevelItem = null;
        this.levelList = new Array();
        this.list = new Sprite();
        this.listHolder = new Sprite();
        this.listMask = new Sprite();
        this.listMask.graphics.beginFill(16711680);
        this.listMask.graphics.drawRect(
            0,
            0,
            this.listBg.width - 4,
            this.listBg.height - 4,
        );
        this.listMask.graphics.endFill();
        this.listHolder.x = this.listMask.x = this.listBg.x + 2;
        this.listHolder.y = this.listMask.y = this.listBg.y + 2;
        this.listHolder.addChild(this.list);
        this.addChild(this.listHolder);
        this.addChild(this.listMask);
        this.listHolder.mask = this.listMask;
        var _loc1_: number = 0;
        var _loc2_: number = 0;
        while (_loc2_ < LoadMenu.levelDataArray.length) {
            _loc3_ = LoadMenu.levelDataArray[_loc2_];
            _loc4_ = new LoadLevelItem(_loc3_.name);
            _loc4_.y = _loc1_;
            _loc1_ += _loc4_.height;
            this.list.addChild(_loc4_);
            this.levelList.push(_loc4_);
            _loc2_++;
        }
        this.list.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.scroller = new SpecialListScroller(this.list, this.listMask, 22);
        this.addChild(this.scroller);
        this.scroller.y = this.listMask.y;
        this.scroller.x = this.listMask.x + this.listMask.width - 12;
    }

    private clearList() {
        if (this.list) {
            this.list.removeEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
            );
        }
        if (this.listHolder) {
            this.removeChild(this.listHolder);
        }
        if (this.listMask) {
            this.removeChild(this.listMask);
        }
        if (this.scroller) {
            this.scroller.die();
            this.removeChild(this.scroller);
        }
        this._currentItem = null;
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: LoadLevelItem = null;
        if (param1.target instanceof LoadLevelItem) {
            _loc2_ = param1.target as LoadLevelItem;
            this.currentItem = _loc2_;
        }
    }

    private set currentItem(param1: LoadLevelItem) {
        if (this._currentItem) {
            this._currentItem.selected = false;
        }
        this._currentItem = param1;
        this._currentItem.selected = true;
    }

    public get currentLevelInfo(): LevelDataObject {
        if (!this._currentItem) {
            return null;
        }
        var _loc1_ = int(this.levelList.indexOf(this._currentItem));
        return LoadMenu.levelDataArray[_loc1_];
    }

    private loadSelected(param1: MouseEvent) {
        if (!this._currentItem) {
            this.errorText.text = "Select a Level, you fool!";
            return;
        }
        this.dispatchEvent(new Event(LoadMenu.LOAD_SELECTED));
    }

    private deleteSelected(param1: MouseEvent) {
        if (!this._currentItem) {
            this.errorText.text = "Select a Level, you fool!";
            return;
        }
        this.dispatchEvent(new Event(LoadMenu.DELETE_SELECTED));
    }

    private importLevel(param1: MouseEvent) {
        this._leveldata = new XML(this.levelText.text);
        this.dispatchEvent(new Event(LoadMenu.IMPORT_DATA));
    }

    public get levelData(): XML {
        return this._leveldata;
    }

    private buildWindow() {
        this._window = new Window(true, this, true);
        this._window.x = LoadMenu.windowX;
        this._window.y = LoadMenu.windowY;
        this._window.addEventListener(Window.WINDOW_CLOSED, this.windowClosed);
    }

    public get window(): Window {
        return this._window;
    }

    private windowClosed(param1: Event) {
        this.dispatchEvent(param1.clone());
    }

    public die() {
        this.loadButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.loadSelected,
        );
        this.importButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.importLevel,
        );
        this.refreshButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.loadLevels,
        );
        this.refreshButton.removeEventListener(Event.ENTER_FRAME, this.spin);
        if (this.list) {
            this.list.removeEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
            );
        }
        this._window.removeEventListener(
            Window.WINDOW_CLOSED,
            this.windowClosed,
        );
        this._window.closeWindow();
        if (this.loader) {
            this.removeLoaderListeners();
        }
        if (this.scroller) {
            this.scroller.die();
        }
    }
}