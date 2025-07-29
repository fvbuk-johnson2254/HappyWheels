import Settings from "@/com/totaljerkface/game/Settings";
import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import StatusSprite from "@/com/totaljerkface/game/editor/StatusSprite";
import CheckBox from "@/com/totaljerkface/game/editor/ui/CheckBox";
import LibraryButton from "@/com/totaljerkface/game/editor/ui/LibraryButton";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import BrowserEvent from "@/com/totaljerkface/game/events/BrowserEvent";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import DropMenu from "@/com/totaljerkface/game/menus/DropMenu";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import ListScroller from "@/com/totaljerkface/game/menus/ListScroller";
import PageFlipperNew from "@/com/totaljerkface/game/menus/PageFlipperNew";
import RefreshButton from "@/com/totaljerkface/game/menus/RefreshButton";
import ReplayDataObject from "@/com/totaljerkface/game/menus/ReplayDataObject";
import ReplayList from "@/com/totaljerkface/game/menus/ReplayList";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import IOErrorEvent from "flash/events/IOErrorEvent";
import MouseEvent from "flash/events/MouseEvent";
import SecurityErrorEvent from "flash/events/SecurityErrorEvent";
import URLLoader from "flash/net/URLLoader";
import URLLoaderDataFormat from "flash/net/URLLoaderDataFormat";
import URLRequest from "flash/net/URLRequest";
import URLRequestMethod from "flash/net/URLRequestMethod";
import URLVariables from "flash/net/URLVariables";
import TextField from "flash/text/TextField";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2984")] */
@boundClass
export default class ReplayBrowser extends Sprite {
    private static _levelId: number;
    private static _levelDataObject: LevelDataObject;
    private static replayDataArray: any[];
    private static urlVariables: URLVariables;
    private static currentPage: number;
    private static totalResults: number;
    private static pageLength: number = 50;
    private static setLength: number = 500;
    private static dropMenuSpacing: number = 10;
    private static currentDropSettings: any[] = [3];
    private static savedDropSettings: any[] = [3];
    private static dropStates: any[] = [1];
    private static selectedCharacter: number = -1;
    private static lastReplayId: number = -1;
    private static hideInnaccurate: boolean = false;
    private static currentSet: number = 1;
    public bg: Sprite;
    public shadow: Sprite;
    public listHeader: Sprite;
    public backButton: LibraryButton;
    public titleText: TextField;
    private archCheck: CheckBox;
    private refreshButton: RefreshButton;
    private sortDropMenu: DropMenu;
    private dropMenuArray: any[];
    private listContainer: Sprite;
    private list: ReplayList;
    private listMask: Sprite;
    private scrollBar: ListScroller;
    private pageFlipper: PageFlipperNew;
    private loader: URLLoader;
    private statusSprite: StatusSprite;

    constructor(param1: LevelDataObject = null) {
        super();
        if (param1) {
            ReplayBrowser._levelId = param1.id;
            ReplayBrowser._levelDataObject = param1;
        }
    }

    public static importReplayDataArray(
        param1: any[],
        param2: LevelDataObject,
    ) {
        ReplayBrowser.replayDataArray = param1;
        var _loc3_: ReplayDataObject = ReplayBrowser.replayDataArray[0];
        ReplayBrowser.lastReplayId = _loc3_.id;
        ReplayBrowser._levelDataObject = param2;
        ReplayBrowser._levelId = param2.id;
        ReplayBrowser.currentPage = 1;
        ReplayBrowser.currentSet = 1;
        ReplayBrowser.hideInnaccurate = false;
    }

    public init() {
        this.mouseChildren = false;
        this.shadow.mouseEnabled = false;
        this.refreshButton = new RefreshButton();
        this.addChild(this.refreshButton);
        this.refreshButton.x = this.shadow.x + this.shadow.width + 10;
        this.refreshButton.y = this.shadow.y - 22;
        this.buildDropMenus();
        var _loc1_ = "<b>Replays - " +
            ReplayBrowser._levelDataObject.name +
            " <font color=\'#E1E1E1\' size=\'15\'>by</font> <font color=\'#FFFF66\' size=\'15\'>" +
            ReplayBrowser._levelDataObject.author_name +
            "</font></b>";
        trace(_loc1_);
        this.titleText.htmlText = _loc1_;
        this.archCheck = new CheckBox(
            "only show accurate replays",
            "hideInnaccurate",
            ReplayBrowser.hideInnaccurate,
            true,
            false,
            13421772,
        );
        this.archCheck.x = this.shadow.x;
        this.archCheck.y = this.shadow.y - 23;
        this.addChild(this.archCheck);
        this.archCheck.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.archValueChange,
        );
        this.archCheck.addEventListener(
            MouseEvent.ROLL_OVER,
            this.archRollOver,
        );
        this.refreshButton.addEventListener(MouseEvent.MOUSE_UP, this.loadData);
        this.backButton.addEventListener(MouseEvent.MOUSE_UP, this.backPress);
    }

    public activate() {
        this.mouseChildren = true;
        if (ReplayBrowser.replayDataArray) {
            this.buildList();
        } else {
            this.loadData();
        }
    }

    public clearReplayList() {
        ReplayBrowser.replayDataArray = null;
        ReplayBrowser.urlVariables = null;
    }

    private loadData(param1: MouseEvent = null) {
        var _loc5_ = undefined;
        var _loc2_: number = 0;
        while (_loc2_ < this.dropMenuArray.length) {
            ReplayBrowser.savedDropSettings[_loc2_] =
                ReplayBrowser.currentDropSettings[_loc2_];
            _loc2_++;
        }
        this.refreshButton.setSpin(true);
        ReplayBrowser.replayDataArray = new Array();
        var _loc3_ = new URLRequest(Settings.siteURL + "replay.hw");
        _loc3_.method = URLRequestMethod.POST;
        ReplayBrowser.urlVariables = new URLVariables();
        ReplayBrowser.urlVariables.action = "get_all_by_level";
        ReplayBrowser.urlVariables.page =
            ReplayBrowser.currentSet =
            ReplayBrowser.currentPage =
            1;
        ReplayBrowser.urlVariables.level_id = ReplayBrowser._levelId;
        ReplayBrowser.urlVariables.sortby = this.sortDropMenu.value;
        _loc3_.data = ReplayBrowser.urlVariables;
        if (param1) {
            Tracker.trackEvent(
                Tracker.REPLAY_BROWSER,
                Tracker.REFRESH_REPLAYS,
                this.sortDropMenu.value,
            );
        }
        this.statusSprite = new StatusSprite("loading replays...");
        var _loc4_: Window = this.statusSprite.window;
        this.addChild(_loc4_);
        _loc4_.center();
        trace("LOAD DATA");
        for (_loc5_ in ReplayBrowser.urlVariables) {
            trace(
                "urlVariables." +
                _loc5_ +
                " = " +
                ReplayBrowser.urlVariables[_loc5_],
            );
        }
        this.loader = new URLLoader();
        this.loader.addEventListener(Event.COMPLETE, this.replayDataLoaded);
        this.loader.addEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.loader.addEventListener(
            SecurityErrorEvent.SECURITY_ERROR,
            this.securityErrorHandler,
        );
        this.loader.load(_loc3_);
    }

    private loadDataOffset() {
        var _loc3_ = undefined;
        this.refreshButton.setSpin(true);
        var _loc1_ = new URLRequest(Settings.siteURL + "replay.hw");
        _loc1_.method = URLRequestMethod.POST;
        _loc1_.data = ReplayBrowser.urlVariables;
        ReplayBrowser.urlVariables.page = ReplayBrowser.currentSet;
        this.statusSprite = new StatusSprite("loading replays...");
        var _loc2_: Window = this.statusSprite.window;
        this.addChild(_loc2_);
        _loc2_.center();
        Tracker.trackEvent(
            Tracker.REPLAY_BROWSER,
            Tracker.PAGE_REPLAYS,
            this.sortDropMenu.value,
            ReplayBrowser.currentSet,
        );
        trace("LOAD DATA OFFSET");
        for (_loc3_ in ReplayBrowser.urlVariables) {
            trace(
                "urlVariables." +
                _loc3_ +
                " = " +
                ReplayBrowser.urlVariables[_loc3_],
            );
        }
        this.loader = new URLLoader();
        this.loader.addEventListener(Event.COMPLETE, this.replayDataLoaded);
        this.loader.addEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.loader.addEventListener(
            SecurityErrorEvent.SECURITY_ERROR,
            this.securityErrorHandler,
        );
        this.loader.load(_loc1_);
    }

    private replayDataLoaded(param1: Event) {
        var _loc8_: any[] = null;
        var _loc9_: XML = null;
        var _loc10_: ReplayDataObject = null;
        trace("LOAD COMPLETE");
        this.statusSprite.die();
        this.removeLoaderListeners();
        this.refreshButton.setSpin(false);
        var _loc2_ = this.loader.data.toString();
        var _loc3_: string = _loc2_.substr(0, 8);
        trace("dataString " + _loc3_);
        if (_loc3_.indexOf("<html>") > -1) {
            this.createPromptSprite(
                "There was an unexpected system Error",
                "oh",
            );
            this.updateRefreshButton(true);
            return;
        }
        if (_loc3_.indexOf("failure") > -1) {
            _loc8_ = _loc2_.split(":");
            if (_loc8_[1] == "invalid_action") {
                this.createPromptSprite(
                    "An invalid action was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc8_[1] == "bad_param") {
                this.createPromptSprite(
                    "A bad parameter was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc8_[1] == "app_error") {
                this.createPromptSprite(
                    "Sorry, there was an application error. It was most likely database related. Please try again in a moment.",
                    "ok",
                );
            } else {
                this.createPromptSprite("An unknown Error has occurred.", "oh");
            }
            this.updateRefreshButton(true);
            return;
        }
        this.updateRefreshButton();
        var _loc4_ = new XML(this.loader.data.toString());
        var _loc5_: number = -1;
        if (!ReplayBrowser.replayDataArray) {
            ReplayBrowser.replayDataArray = new Array();
        }
        var _loc6_ = int(_loc4_.rp.length());
        trace("total results = " + _loc6_);
        if (_loc6_ > 50) {
            trace("MORE THAN 50 RESULTS");
        }
        var _loc7_: number = 0;
        while (_loc7_ < _loc6_) {
            _loc9_ = _loc4_.rp[_loc7_];
            _loc10_ = new ReplayDataObject(
                _loc9_["id"],
                _loc9_["li"],
                _loc9_["ui"],
                _loc9_["un"],
                _loc9_["rg"],
                _loc9_["vs"],
                _loc9_["vw"],
                _loc9_["dc"],
                _loc9_.uc,
                _loc9_["pc"],
                _loc9_["ct"],
                _loc9_["ar"],
                _loc9_["vr"],
            );
            ReplayBrowser.replayDataArray.push(_loc10_);
            if (
                ReplayBrowser.lastReplayId > -1 &&
                _loc10_.id == ReplayBrowser.lastReplayId
            ) {
                _loc5_ = _loc7_;
            }
            _loc7_++;
        }
        if (this.list) {
            this.killList();
        }
        this.buildList();
    }

    private IOErrorHandler(param1: IOErrorEvent) {
        trace("replaybrowser: " + param1.text);
        if (this.statusSprite) {
            this.statusSprite.die();
        }
        this.removeLoaderListeners();
        this.updateRefreshButton();
        this.refreshButton.setSpin(false);
        this.createPromptSprite("Sorry, there was an IO Error.", "ugh, ok");
    }

    private createPromptSprite(param1: string, param2: string) {
        var _loc3_ = new PromptSprite(param1, param2);
        var _loc4_: Window = _loc3_.window;
        this.addChild(_loc4_);
        _loc4_.center();
    }

    private securityErrorHandler(param1: SecurityErrorEvent) {
        trace("replaybrowser: " + param1.text);
        if (this.statusSprite) {
            this.statusSprite.die();
        }
        this.removeLoaderListeners();
        this.updateRefreshButton();
        this.refreshButton.setSpin(false);
        this.createPromptSprite(
            "Sorry, there was a Security Error.",
            "ugh, ok",
        );
    }

    private removeLoaderListeners() {
        this.loader.removeEventListener(Event.COMPLETE, this.replayDataLoaded);
        this.loader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.loader.removeEventListener(
            SecurityErrorEvent.SECURITY_ERROR,
            this.securityErrorHandler,
        );
    }

    private buildDropMenus() {
        var _loc1_: any[] = ["newest", "oldest", "rating", "completion time"];
        var _loc2_: any[] = ["newest", "oldest", "rating", "completion_time"];
        var _loc3_: any[] = ["today", "this week", "this month", "anytime"];
        var _loc4_: any[] = ["today", "week", "month", "anytime"];
        this.sortDropMenu = new DropMenu(
            "sort by:",
            _loc1_,
            _loc2_,
            ReplayBrowser.savedDropSettings[0],
        );
        this.addChild(this.sortDropMenu);
        this.sortDropMenu.y = this.shadow.y - 21;
        this.sortDropMenu.addEventListener(
            DropMenu.ITEM_SELECTED,
            this.dropMenuSelected,
        );
        this.dropMenuArray = [this.sortDropMenu];
        this.organizeDropMenus();
    }

    private organizeDropMenus() {
        var _loc3_: DropMenu = null;
        var _loc4_: number = 0;
        var _loc1_: number = this.shadow.width + this.shadow.x;
        var _loc2_ = int(this.dropMenuArray.length - 1);
        while (_loc2_ > -1) {
            _loc3_ = this.dropMenuArray[_loc2_];
            _loc4_ = int(ReplayBrowser.dropStates[_loc2_]);
            if (_loc4_ == 1) {
                _loc3_.visible = true;
                _loc3_.xLeft = _loc1_ - _loc3_.width;
                _loc1_ = _loc3_.xLeft - ReplayBrowser.dropMenuSpacing;
            } else {
                _loc3_.visible = false;
            }
            _loc2_--;
        }
    }

    private dropMenuSelected(param1: Event = null) {
        var _loc2_: DropMenu = param1.target as DropMenu;
        var _loc3_ = int(this.dropMenuArray.indexOf(_loc2_));
        var _loc4_: number = _loc2_.currentIndex;
        ReplayBrowser.currentDropSettings[_loc3_] = _loc4_;
        this.organizeDropMenus();
        this.updateRefreshButton(param1 == null);
    }

    private updateRefreshButton(param1: boolean = false) {
        var _loc2_: number = 0;
        while (_loc2_ < this.dropMenuArray.length) {
            if (
                ReplayBrowser.currentDropSettings[_loc2_] !=
                ReplayBrowser.savedDropSettings[_loc2_]
            ) {
                param1 = true;
            }
            _loc2_++;
        }
        this.refreshButton.setGlow(param1);
    }

    private backPress(param1: MouseEvent) {
        ReplayBrowser.currentPage = 1;
        Tracker.trackEvent(Tracker.REPLAY_BROWSER, Tracker.GOTO_LEVEL_BROWSER);
        this.dispatchEvent(new NavigationEvent(NavigationEvent.PREVIOUS_MENU));
    }

    private flipPage(param1: Event) {
        var _loc2_: number = ReplayBrowser.currentSet;
        ReplayBrowser.currentPage = this.pageFlipper.currentPage;
        ReplayBrowser.currentSet = Math.ceil(
            (ReplayBrowser.currentPage * ReplayBrowser.pageLength) /
            ReplayBrowser.setLength,
        );
        var _loc3_ = int(ReplayBrowser.replayDataArray.length);
        if (
            ReplayBrowser.currentSet > _loc2_ &&
            _loc3_ <= (ReplayBrowser.currentSet - 1) * ReplayBrowser.setLength
        ) {
            this.loadDataOffset();
        } else {
            this.killList();
            this.buildList();
        }
    }

    private flagReplay(param1: BrowserEvent) {
        trace("FLAG REPLAY");
        var _loc2_ = param1.extra as number;
        this.statusSprite = new StatusSprite("flagging replay...");
        var _loc3_: Window = this.statusSprite.window;
        this.addChild(_loc3_);
        _loc3_.center();
        var _loc4_ = new URLRequest(Settings.siteURL + Settings.FLAG_REPLAY);
        var _loc5_ = new URLVariables();
        _loc5_.replayid = _loc2_;
        _loc4_.data = _loc5_;
        this.loader = new URLLoader();
        this.loader.dataFormat = URLLoaderDataFormat.VARIABLES;
        this.loader.addEventListener(Event.COMPLETE, this.flagComplete);
        this.loader.addEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.loader.addEventListener(
            SecurityErrorEvent.SECURITY_ERROR,
            this.securityErrorHandler,
        );
        this.loader.load(_loc4_);
    }

    private flagComplete(param1: Event) {
        var _loc2_: PromptSprite = null;
        var _loc3_: Window = null;
        this.statusSprite.die();
        this.removeLoaderListeners();
        trace((this.loader.data as any).ToFlash);
        if ((this.loader.data as any).ToFlash != "error") {
            _loc2_ = new PromptSprite("Replay flagged, Thank you.", "ok");
            _loc3_ = _loc2_.window;
            this.addChild(_loc3_);
            _loc3_.center();
        }
    }

    private buildList() {
        var _loc5_: PromptSprite = null;
        var _loc6_: Window = null;
        var _loc7_: boolean = false;
        var _loc1_: number =
            (ReplayBrowser.currentPage - 1) * ReplayBrowser.pageLength;
        var _loc2_: number = _loc1_ + ReplayBrowser.pageLength;
        _loc2_ = Math.min(_loc2_, ReplayBrowser.replayDataArray.length);
        var _loc3_: any[] = ReplayBrowser.replayDataArray.slice(_loc1_, _loc2_);
        this.listContainer = new Sprite();
        this.list = new ReplayList(
            _loc3_,
            ReplayBrowser.lastReplayId,
            ReplayBrowser.selectedCharacter,
            ReplayBrowser.hideInnaccurate,
        );
        ReplayBrowser.lastReplayId = -1;
        this.listMask = new Sprite();
        this.listContainer.x = this.listHeader.x;
        this.listContainer.y = this.listHeader.y + this.listHeader.height;
        this.listMask.graphics.beginFill(16711680);
        this.listMask.graphics.drawRect(
            0,
            0,
            this.shadow.width,
            this.shadow.height - this.listHeader.height,
        );
        this.listMask.graphics.endFill();
        this.list.mask = this.listMask;
        this.addChildAt(
            this.listContainer,
            this.getChildIndex(this.listHeader),
        );
        this.listContainer.addChild(this.list);
        this.listContainer.addChild(this.listMask);
        this.list.addEventListener(
            ReplayList.UPDATE_SCROLLER,
            this.updateScroller,
        );
        this.list.addEventListener(ReplayList.FACE_SELECTED, this.faceSelected);
        this.list.addEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.list.addEventListener(BrowserEvent.FLAG, this.flagReplay);
        this.scrollBar = new ListScroller(this.list, this.listMask, 22);
        this.scrollBar.x = this.shadow.x + this.shadow.width + 10;
        this.scrollBar.y = this.listContainer.y;
        this.addChildAt(this.scrollBar, 1);
        this.faceSelected();
        if (this.pageFlipper) {
            this.pageFlipper.die();
            this.pageFlipper.removeEventListener(
                PageFlipperNew.FLIP_PAGE,
                this.flipPage,
            );
            this.removeChild(this.pageFlipper);
            this.pageFlipper = null;
        }
        var _loc4_ = int(ReplayBrowser.replayDataArray.length);
        if (_loc4_ == 0) {
            _loc5_ = new PromptSprite(
                "no replays found using these parameters",
                "ok",
            );
            _loc6_ = _loc5_.window;
            this.addChild(_loc6_);
            _loc6_.center();
        } else {
            _loc7_ = _loc4_ % ReplayBrowser.setLength > 0 ? true : false;
            this.pageFlipper = new PageFlipperNew(
                ReplayBrowser.currentPage,
                ReplayBrowser.pageLength,
                _loc4_,
                _loc7_,
            );
            this.addChild(this.pageFlipper);
            this.pageFlipper.x = this.shadow.x + this.shadow.width;
            this.pageFlipper.y = this.shadow.y + this.shadow.height + 7;
            this.pageFlipper.addEventListener(
                PageFlipperNew.FLIP_PAGE,
                this.flipPage,
            );
        }
    }

    private killList() {
        this.list.removeEventListener(
            ReplayList.UPDATE_SCROLLER,
            this.updateScroller,
        );
        this.list.removeEventListener(
            ReplayList.FACE_SELECTED,
            this.faceSelected,
        );
        this.list.removeEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.list.removeEventListener(BrowserEvent.FLAG, this.flagReplay);
        this.list.die();
        this.list = null;
        this.scrollBar.die();
        this.removeChild(this.scrollBar);
        this.scrollBar = null;
        this.removeChild(this.listContainer);
        this.listContainer = null;
        this.listMask = null;
    }

    private cloneAndDispatchEvent(param1: NavigationEvent) {
        var _loc2_: NavigationEvent = null;
        var _loc3_: Event = null;
        trace("Replay browser clone event");
        if (param1.type == NavigationEvent.SESSION) {
            if (param1.replayDataObject) {
                ReplayBrowser.lastReplayId = param1.replayDataObject.id;
            }
            _loc2_ = new NavigationEvent(
                param1.type,
                ReplayBrowser._levelDataObject,
                param1.replayDataObject,
                param1.extra,
            );
            this.dispatchEvent(_loc2_);
        } else {
            _loc3_ = param1.clone();
            this.dispatchEvent(_loc3_);
        }
    }

    private faceSelected(param1: Event = null) {
        ReplayBrowser.selectedCharacter = this.list.selectedCharacter;
        if (ReplayBrowser.selectedCharacter > 0) {
            this.scrollBar.addTickMarks(this.list.highlightedArray);
        } else {
            this.scrollBar.removeTickMarks();
        }
    }

    private updateScroller(param1: Event = null) {
        this.scrollBar.updateScrollTab();
    }

    private listMouseWheelHandler(param1: MouseEvent) {
        var _loc2_: boolean = param1.delta < 0 ? true : false;
        this.scrollBar.step(_loc2_);
    }

    private archValueChange(param1: ValueEvent) {
        ReplayBrowser.hideInnaccurate = param1.value;
        trace("HIDE INACCURATE " + ReplayBrowser.hideInnaccurate);
        this.list.inaccurateHidden = ReplayBrowser.hideInnaccurate;
        this.updateScroller();
    }

    private archRollOver(param1: MouseEvent) {
        MouseHelper.instance.show(
            "When a replay is saved, the type of computer it was created on is saved along with it.  Computers that match this type will show the replay 100% accurately.  Those that do not will playback the replay with slightly different floating point math, which often (but not always) creates a different end result entirely.<br><br>Users may only rate replays they can view accurately.",
            this.archCheck,
        );
    }

    public die() {
        this.sortDropMenu.removeEventListener(
            DropMenu.ITEM_SELECTED,
            this.dropMenuSelected,
        );
        this.sortDropMenu.die();
        if (this.pageFlipper) {
            this.pageFlipper.die();
            this.pageFlipper.removeEventListener(
                PageFlipperNew.FLIP_PAGE,
                this.flipPage,
            );
        }
        this.backButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.backPress,
        );
        this.archCheck.die();
        this.archCheck.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.archValueChange,
        );
        this.archCheck.removeEventListener(
            MouseEvent.ROLL_OVER,
            this.archRollOver,
        );
        this.refreshButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.loadData,
        );
        if (this.list) {
            this.killList();
        }
    }
}