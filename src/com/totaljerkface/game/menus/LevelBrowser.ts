import Settings from "@/com/totaljerkface/game/Settings";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import StatusSprite from "@/com/totaljerkface/game/editor/StatusSprite";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import LibraryButton from "@/com/totaljerkface/game/editor/ui/LibraryButton";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import XButton from "@/com/totaljerkface/game/editor/ui/XButton";
import BrowserEvent from "@/com/totaljerkface/game/events/BrowserEvent";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import DropMenu from "@/com/totaljerkface/game/menus/DropMenu";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import LevelList from "@/com/totaljerkface/game/menus/LevelList";
import ListScroller from "@/com/totaljerkface/game/menus/ListScroller";
import PageFlipperNew from "@/com/totaljerkface/game/menus/PageFlipperNew";
import RefreshButton from "@/com/totaljerkface/game/menus/RefreshButton";
import SearchLevelMenu from "@/com/totaljerkface/game/menus/SearchLevelMenu";
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

/* [Embed(source="/_assets/assets.swf", symbol="symbol3027")] */
@boundClass
export default class LevelBrowser extends Sprite {
    private static savedTerm: string;
    private static levelDataArray: any[];
    private static urlVariables: URLVariables;
    private static _favorites: boolean;
    private static _importable: boolean;
    private static levelSearch: string;
    private static authorNameSearch: string;
    private static setLength: number = 500;
    private static pageLength: number = 50;
    private static dropMenuSpacing: number = 10;
    private static currentDropSettings: any[] = [0, 0, 1];
    private static savedDropSettings: any[] = [0, 0, 1];
    private static currentDropStates: any[] = [1, 1, 1];
    private static savedDropStates: any[] = [1, 1, 1];
    private static savedSearch: number = 0;
    private static selectedCharacter: number = -1;
    private static authorDisplay: any[] = ["everyone"];
    private static authorValues: any[] = [0];
    private static lastLevelId: number = -1;
    private static currentSet: number = 1;
    private static currentPage: number = 1;
    public bg: Sprite;
    public shadow: Sprite;
    public listHeader: Sprite;
    public backButton: LibraryButton;
    private favoriteId: number;
    private authorDropMenu: DropMenu;
    private charDropMenu: DropMenu;
    private sortDropMenu: DropMenu;
    private uploadDropMenu: DropMenu;
    private dropMenuArray: any[];
    private searchButton: GenericButton;
    private refreshButton: RefreshButton;
    private favoritesButton: GenericButton;
    private searchTermButton: XButton;
    private listContainer: Sprite;
    private list: LevelList;
    private listMask: Sprite;
    private scrollBar: ListScroller;
    private pageFlipper: PageFlipperNew;
    private loader: URLLoader;
    private statusSprite: StatusSprite;
    private searchMenu: SearchLevelMenu;

    public static importLevelDataArray(param1: any[]) {
        LevelBrowser.levelDataArray = param1;
        var _loc2_: LevelDataObject = LevelBrowser.levelDataArray[0];
        LevelBrowser.lastLevelId = _loc2_.id;
        LevelBrowser.currentPage = 1;
        LevelBrowser.currentSet = 1;
        LevelBrowser.levelSearch = null;
        LevelBrowser.authorNameSearch = null;
        LevelBrowser._favorites = false;
    }

    public static importAuthor(param1: string, param2: number) {
        var _loc3_ = int(LevelBrowser.authorValues.indexOf(param2));
        if (_loc3_ == -1) {
            LevelBrowser.authorValues.push(param2);
            LevelBrowser.authorDisplay.push(param1);
            LevelBrowser.currentDropSettings = [
                LevelBrowser.authorValues.length - 1,
                0,
                3,
            ];
            LevelBrowser.savedDropSettings = [
                LevelBrowser.authorValues.length - 1,
                0,
                3,
            ];
            LevelBrowser.currentDropStates = [1, 0, 0];
            LevelBrowser.savedDropStates = [1, 0, 0];
        } else {
            LevelBrowser.savedDropSettings = [_loc3_, 0, 3];
            LevelBrowser.savedDropStates = [1, 0, 0];
        }
        LevelBrowser.authorNameSearch = null;
        LevelBrowser.levelSearch = null;
        LevelBrowser._favorites = false;
        LevelBrowser.currentPage = 1;
        LevelBrowser.currentSet = 1;
        LevelBrowser.urlVariables = null;
        LevelBrowser.levelDataArray = null;
    }

    public init() {
        this.mouseChildren = false;
        this.shadow.mouseEnabled = false;
        this.refreshButton = new RefreshButton();
        this.addChild(this.refreshButton);
        this.refreshButton.x = this.shadow.x + this.shadow.width + 10;
        this.refreshButton.y = this.shadow.y - 22;
        this.buildDropMenus();
        this.searchButton = new GenericButton("search by name", 4032711, 120);
        this.addChild(this.searchButton);
        this.searchButton.x = this.shadow.x;
        this.searchButton.y = this.shadow.y - 27;
        this.searchButton.y = this.shadow.y + this.shadow.height + 6;
        this.favoritesButton = new GenericButton(
            "list favorites",
            16776805,
            120,
            6312772,
        );
        this.addChild(this.favoritesButton);
        this.favoritesButton.x =
            this.searchButton.x + this.searchButton.width + 6;
        this.favoritesButton.y = this.searchButton.y;
        trace("Settings.id = " + Settings.user_id);
        if (Settings.user_id <= 0) {
            trace("FUCKING SHIT");
            this.removeChild(this.favoritesButton);
        }
        this.backButton.addEventListener(MouseEvent.MOUSE_UP, this.backPress);
        this.searchButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.openSearchMenu,
        );
        this.favoritesButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.listFavorites,
        );
        this.refreshButton.addEventListener(MouseEvent.MOUSE_UP, this.loadData);
        if (LevelBrowser.savedSearch > 0) {
            this.createSearchTermButton(LevelBrowser.savedSearch);
        }
    }

    public activate() {
        this.mouseChildren = true;
        if (LevelBrowser.levelDataArray) {
            this.buildList();
        } else {
            trace("---------------LOAD DATA");
            this.loadData();
        }
    }

    private loadData(param1: MouseEvent = null) {
        var _loc5_ = undefined;
        var _loc2_: number = 0;
        while (_loc2_ < this.dropMenuArray.length) {
            LevelBrowser.savedDropSettings[_loc2_] =
                LevelBrowser.currentDropSettings[_loc2_];
            LevelBrowser.savedDropStates[_loc2_] =
                LevelBrowser.currentDropStates[_loc2_];
            _loc2_++;
        }
        this.refreshButton.setSpin(true);
        LevelBrowser.savedSearch = 0;
        LevelBrowser.levelDataArray = new Array();
        var _loc3_ = new URLRequest(Settings.siteURL + "get_level.hw");
        _loc3_.method = URLRequestMethod.POST;
        LevelBrowser.urlVariables = new URLVariables();
        LevelBrowser.urlVariables.action = "get_all";
        LevelBrowser.urlVariables.page =
            LevelBrowser.currentSet =
            LevelBrowser.currentPage =
            1;
        LevelBrowser.urlVariables.sortby = this.sortDropMenu.value;
        LevelBrowser.urlVariables.uploaded = this.uploadDropMenu.value;
        if (LevelBrowser.levelSearch) {
            LevelBrowser.savedSearch = 1;
            LevelBrowser.urlVariables.action = "search_by_name";
            LevelBrowser.urlVariables.sterm = LevelBrowser.levelSearch;
        } else if (LevelBrowser.authorNameSearch) {
            LevelBrowser.savedSearch = 2;
            LevelBrowser.urlVariables.action = "search_by_user";
            LevelBrowser.urlVariables.sterm = LevelBrowser.authorNameSearch;
        } else if (LevelBrowser._favorites) {
            LevelBrowser.savedSearch = 3;
            _loc3_.url = Settings.siteURL + "user.hw";
            LevelBrowser.urlVariables = new URLVariables();
            LevelBrowser.urlVariables.action = "get_favorites";
            Settings.favoriteLevelIds = new Array();
        } else if (this.authorDropMenu.value != 0) {
            LevelBrowser.urlVariables.action = "get_pub_by_user";
            LevelBrowser.urlVariables.user_id = this.authorDropMenu.value;
        } else if (param1) {
            Tracker.trackEvent(
                Tracker.LEVEL_BROWSER,
                Tracker.REFRESH_LEVELS,
                this.sortDropMenu.value + "_" + this.uploadDropMenu.value,
            );
        }
        _loc3_.data = LevelBrowser.urlVariables;
        this.statusSprite = new StatusSprite("loading levels...");
        var _loc4_: Window = this.statusSprite.window;
        this.addChild(_loc4_);
        _loc4_.center();
        trace("LOAD DATA");
        for (_loc5_ in LevelBrowser.urlVariables) {
            trace(
                "urlVariables." +
                _loc5_ +
                " = " +
                LevelBrowser.urlVariables[_loc5_],
            );
        }
        trace(_loc3_.requestHeaders);
        trace(_loc3_.url);
        this.loader = new URLLoader();
        this.loader.addEventListener(Event.COMPLETE, this.levelDataLoaded);
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
        var _loc1_ = new URLRequest(Settings.siteURL + "get_level.hw");
        _loc1_.method = URLRequestMethod.POST;
        _loc1_.data = LevelBrowser.urlVariables;
        LevelBrowser.urlVariables.page = LevelBrowser.currentSet;
        this.statusSprite = new StatusSprite("loading levels...");
        var _loc2_: Window = this.statusSprite.window;
        this.addChild(_loc2_);
        _loc2_.center();
        if (LevelBrowser.urlVariables.action == "get_all") {
            Tracker.trackEvent(
                Tracker.LEVEL_BROWSER,
                Tracker.PAGE_LEVELS,
                this.sortDropMenu.value + "_" + this.uploadDropMenu.value,
                LevelBrowser.currentSet,
            );
        }
        trace("LOAD DATA OFFSET");
        for (_loc3_ in LevelBrowser.urlVariables) {
            trace(
                "urlVariables." +
                _loc3_ +
                " = " +
                LevelBrowser.urlVariables[_loc3_],
            );
        }
        this.loader = new URLLoader();
        this.loader.addEventListener(Event.COMPLETE, this.levelDataLoaded);
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

    private levelDataLoaded(param1: Event) {
        var _loc8_: any[] = null;
        var _loc9_: XML = null;
        var _loc10_: LevelDataObject = null;
        trace("LOAD COMPLETE");
        this.statusSprite.die();
        this.removeLoaderListeners();
        this.refreshButton.setSpin(false);
        var _loc2_ = this.loader.data.toString();
        trace("result " + _loc2_);
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
        trace("NUM PER PAGE " + _loc4_["pp"]);
        var _loc5_ = int(_loc4_["pp"]);
        if (_loc5_ > 1) {
            LevelBrowser.setLength = _loc5_;
        }
        if (!LevelBrowser.levelDataArray) {
            LevelBrowser.levelDataArray = new Array();
        }
        var _loc6_ = int(_loc4_.lv.length());
        trace("total results = " + _loc6_);
        if (_loc6_ > 50) {
            trace("MORE THAN 50 RESULTS");
        }
        var _loc7_: number = 0;
        while (_loc7_ < _loc6_) {
            _loc9_ = _loc4_.lv[_loc7_];
            _loc10_ = new LevelDataObject(
                _loc9_["id"],
                _loc9_["ln"],
                _loc9_["ui"],
                _loc9_["un"],
                _loc9_["rg"],
                _loc9_["vs"],
                _loc9_["ps"],
                _loc9_["dp"],
                _loc9_.uc,
                _loc9_["pc"],
                "1",
                "1",
                "1",
                _loc9_["dp"],
            );
            LevelBrowser.levelDataArray.push(_loc10_);
            if (LevelBrowser._favorites) {
                Settings.favoriteLevelIds.push(_loc10_.id);
            }
            _loc7_++;
        }
        if (this.list) {
            this.killList();
        }
        this.buildList();
    }

    private IOErrorHandler(param1: IOErrorEvent) {
        trace("levelbrowser: " + param1.text);
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
        trace("levelbrowser: " + param1.text);
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
        this.loader.removeEventListener(Event.COMPLETE, this.flagComplete);
        this.loader.removeEventListener(Event.COMPLETE, this.levelDataLoaded);
        this.loader.removeEventListener(
            Event.COMPLETE,
            this.editFavoritesComplete,
        );
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
        var _loc1_: number = Settings.user_id;
        if (_loc1_ > 0) {
            if (LevelBrowser.authorValues.indexOf(_loc1_) == -1) {
                LevelBrowser.authorValues.push(_loc1_);
                LevelBrowser.authorDisplay.push(Settings.username);
            }
        }
        var _loc2_: any[] = Settings.characterNames.concat("all", "any");
        var _loc3_ = new Array();
        var _loc4_: number = 0;
        while (_loc4_ < Settings.totalCharacters) {
            _loc3_.push(_loc4_ + 1);
            _loc4_++;
        }
        _loc3_ = _loc3_.concat(0, -1);
        trace(_loc3_);
        var _loc5_: any[] = ["newest", "oldest", "play count", "rating"];
        var _loc6_: any[] = ["newest", "oldest", "plays", "rating"];
        var _loc7_: any[] = ["today", "this week", "this month", "anytime"];
        var _loc8_: any[] = ["today", "week", "month", "anytime"];
        this.authorDropMenu = new DropMenu(
            "author:",
            LevelBrowser.authorDisplay,
            LevelBrowser.authorValues,
            LevelBrowser.savedDropSettings[0],
        );
        this.charDropMenu = new DropMenu(
            "playable character:",
            _loc2_,
            _loc3_,
            -1,
        );
        this.sortDropMenu = new DropMenu(
            "sort by:",
            _loc5_,
            _loc6_,
            LevelBrowser.savedDropSettings[1],
        );
        this.uploadDropMenu = new DropMenu(
            "uploaded:",
            _loc7_,
            _loc8_,
            LevelBrowser.savedDropSettings[2],
        );
        this.addChild(this.authorDropMenu);
        this.addChild(this.sortDropMenu);
        this.addChild(this.uploadDropMenu);
        var _loc9_ = this.shadow.y - 21;
        this.uploadDropMenu.y = this.shadow.y - 21;
        this.authorDropMenu.y =
            this.charDropMenu.y =
            this.sortDropMenu.y =
            _loc9_;
        this.authorDropMenu.addEventListener(
            DropMenu.ITEM_SELECTED,
            this.dropMenuSelected,
        );
        this.charDropMenu.addEventListener(
            DropMenu.ITEM_SELECTED,
            this.dropMenuSelected,
        );
        this.sortDropMenu.addEventListener(
            DropMenu.ITEM_SELECTED,
            this.dropMenuSelected,
        );
        this.uploadDropMenu.addEventListener(
            DropMenu.ITEM_SELECTED,
            this.dropMenuSelected,
        );
        this.dropMenuArray = [
            this.authorDropMenu,
            this.sortDropMenu,
            this.uploadDropMenu,
        ];
        _loc4_ = 0;
        while (_loc4_ < this.dropMenuArray.length) {
            LevelBrowser.currentDropStates[_loc4_] =
                LevelBrowser.savedDropStates[_loc4_];
            _loc4_++;
        }
        this.organizeDropMenus();
    }

    private organizeDropMenus() {
        var _loc3_: DropMenu = null;
        var _loc4_: number = 0;
        var _loc1_: number = this.shadow.width + this.shadow.x;
        var _loc2_ = int(this.dropMenuArray.length - 1);
        while (_loc2_ > -1) {
            _loc3_ = this.dropMenuArray[_loc2_];
            _loc4_ = int(LevelBrowser.currentDropStates[_loc2_]);
            if (_loc4_ == 1) {
                _loc3_.visible = true;
                _loc3_.xLeft = _loc1_ - _loc3_.width;
                _loc1_ = _loc3_.xLeft - LevelBrowser.dropMenuSpacing;
            } else {
                _loc3_.visible = false;
            }
            _loc2_--;
        }
    }

    private dropMenuSelected(param1: Event = null) {
        var _loc2_: number = 0;
        var _loc4_: DropMenu = null;
        if (param1 != null) {
            _loc4_ = param1.target as DropMenu;
        } else {
            _loc4_ = this.authorDropMenu;
        }
        var _loc3_: number = _loc4_.currentIndex;
        if (_loc4_ == this.authorDropMenu) {
            _loc2_ = 0;
            LevelBrowser.currentDropStates = _loc3_ > 0 ? [1, 0, 0] : [1, 1, 1];
        } else if (_loc4_ != this.charDropMenu) {
            if (_loc4_ == this.sortDropMenu) {
                _loc2_ = 1;
            } else {
                _loc2_ = 2;
            }
        }
        LevelBrowser.currentDropSettings[_loc2_] = _loc3_;
        this.organizeDropMenus();
        this.updateRefreshButton(param1 == null);
    }

    private updateRefreshButton(param1: boolean = false) {
        var _loc2_: number = 0;
        while (_loc2_ < this.dropMenuArray.length) {
            if (
                LevelBrowser.currentDropSettings[_loc2_] !=
                LevelBrowser.savedDropSettings[_loc2_]
            ) {
                param1 = true;
            }
            _loc2_++;
        }
        this.refreshButton.setGlow(param1);
    }

    private backPress(param1: MouseEvent) {
        Tracker.trackEvent(Tracker.LEVEL_BROWSER, Tracker.GOTO_MAIN_MENU);
        this.dispatchEvent(new NavigationEvent(NavigationEvent.MAIN_MENU));
    }

    private listFavorites(param1: MouseEvent) {
        if (LevelBrowser._favorites) {
            return;
        }
        if (this.searchTermButton) {
            this.removeSearchTerm();
        }
        Tracker.trackEvent(Tracker.LEVEL_BROWSER, Tracker.GET_FAVORITES);
        LevelBrowser._favorites = true;
        this.createSearchTermButton(3);
        this.loadData();
    }

    private openSearchMenu(param1: MouseEvent) {
        this.searchMenu = new SearchLevelMenu();
        var _loc2_: Window = this.searchMenu.window;
        this.addChild(_loc2_);
        _loc2_.center();
        this.searchMenu.addEventListener(
            SearchLevelMenu.SEARCH,
            this.beginSearch,
        );
        this.searchMenu.addEventListener(
            SearchLevelMenu.CANCEL,
            this.closeSearchMenu,
        );
    }

    private closeSearchMenu(param1: Event = null) {
        this.searchMenu.removeEventListener(
            SearchLevelMenu.SEARCH,
            this.beginSearch,
        );
        this.searchMenu.removeEventListener(
            SearchLevelMenu.CANCEL,
            this.closeSearchMenu,
        );
        this.searchMenu.die();
        this.searchMenu = null;
    }

    private beginSearch(param1: Event) {
        var _loc2_: string = this.searchMenu.searchTerm;
        var _loc3_: string = this.searchMenu.searchType;
        this.closeSearchMenu();
        if (this.searchTermButton) {
            this.removeSearchTerm();
        }
        if (_loc3_ == SearchLevelMenu.LEVEL_NAME) {
            LevelBrowser.savedTerm = _loc2_;
            this.createSearchTermButton(1);
            Tracker.trackEvent(
                Tracker.LEVEL_BROWSER,
                Tracker.LEVEL_SEARCH,
                _loc2_,
            );
            this.loadData();
        } else if (_loc3_ == SearchLevelMenu.AUTHOR_NAME) {
            LevelBrowser.savedTerm = _loc2_;
            this.createSearchTermButton(2);
            Tracker.trackEvent(
                Tracker.LEVEL_BROWSER,
                Tracker.AUTHOR_SEARCH,
                _loc2_,
            );
            this.loadData();
        }
    }

    private createSearchTermButton(param1: number) {
        var _loc2_ = null;
        var _loc3_: number = 0;
        var _loc4_: number = 0;
        if (param1 == 1) {
            LevelBrowser.levelSearch = LevelBrowser.savedTerm;
            _loc2_ = "level name: \'" + LevelBrowser.savedTerm + "\'";
            _loc3_ = 4032711;
            _loc4_ = 16777215;
        } else if (param1 == 2) {
            LevelBrowser.authorNameSearch = LevelBrowser.savedTerm;
            _loc2_ = "author name: \'" + LevelBrowser.savedTerm + "\'";
            _loc3_ = 16613761;
            _loc4_ = 16777215;
        } else if (param1 == 3) {
            _loc2_ = "favorites";
            _loc3_ = 16776805;
            _loc4_ = 6312772;
        }
        this.searchTermButton = new XButton(_loc2_, _loc3_, 120, _loc4_);
        this.addChild(this.searchTermButton);
        this.searchTermButton.x = this.shadow.x;
        this.searchTermButton.y = this.shadow.y - 27;
        LevelBrowser.currentDropStates = param1 == 3 ? [0, 0, 0] : [0, 1, 0];
        this.organizeDropMenus();
        this.searchTermButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.removeSearchTerm,
        );
    }

    private removeSearchTerm(param1: MouseEvent = null) {
        LevelBrowser.levelSearch = null;
        LevelBrowser.authorNameSearch = null;
        LevelBrowser._favorites = false;
        this.searchTermButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.removeSearchTerm,
        );
        this.removeChild(this.searchTermButton);
        this.searchTermButton = null;
        this.dropMenuSelected();
    }

    private editFavorites(param1: BrowserEvent) {
        var _loc7_: string = null;
        var _loc2_: boolean =
            param1.type == BrowserEvent.ADD_TO_FAVORITES ? true : false;
        if (Settings.user_id <= 0) {
            this.createPromptSprite(
                "You must be logged in to edit your favorite levels.  Login or register for free up there on the right.",
                "ok",
            );
            return;
        }
        if (Settings.disableUpload) {
            this.createPromptSprite(Settings.disableMessage, "OH FINE");
            return;
        }
        var _loc3_ = param1.extra as number;
        var _loc4_ = new URLRequest(Settings.siteURL + "user.hw");
        _loc4_.method = URLRequestMethod.POST;
        var _loc5_ = new URLVariables();
        _loc5_.level_id = _loc3_;
        _loc4_.data = _loc5_;
        if (_loc2_) {
            trace("ADD TO FAVORITES");
            _loc7_ = "adding level to favorites...";
            _loc5_.action = "set_favorite";
            this.favoriteId = _loc3_;
        } else {
            trace("REMOVE FROM FAVORITES");
            _loc7_ = "removing level from favorites...";
            _loc5_.action = "delete_favorite";
            this.favoriteId = -_loc3_;
        }
        this.statusSprite = new StatusSprite(_loc7_);
        var _loc6_: Window = this.statusSprite.window;
        this.addChild(_loc6_);
        _loc6_.center();
        this.loader = new URLLoader();
        this.loader.addEventListener(
            Event.COMPLETE,
            this.editFavoritesComplete,
        );
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

    private editFavoritesComplete(param1: Event) {
        var _loc5_: number = 0;
        trace("EDIT FAVORITES -- COMPLETE");
        this.statusSprite.die();
        this.removeLoaderListeners();
        var _loc2_ = this.loader.data.toString();
        var _loc3_: string = _loc2_.substr(0, 8);
        trace("dataString " + _loc3_);
        var _loc4_: any[] = _loc2_.split(":");
        if (_loc3_.indexOf("<html>") > -1) {
            this.createPromptSprite(
                "There was an unexpected system Error",
                "oh",
            );
        } else if (_loc4_[0] == "failure") {
            if (_loc4_[1] == "not_logged_in") {
                this.createPromptSprite(
                    "You must be logged in to edit your favorite levels.  Login or register for free up there on the right.",
                    "ok",
                );
            } else if (_loc4_[1] == "duplicate") {
                this.createPromptSprite(
                    "This level is already one of your favorite levels.",
                    "ok",
                );
            } else if (_loc4_[1] == "invalid_action") {
                this.createPromptSprite(
                    "An invalid action was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc4_[1] == "bad_param") {
                this.createPromptSprite(
                    "A bad parameter was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc4_[1] == "app_error") {
                this.createPromptSprite(
                    "Sorry, there was an application error. It was most likely database related. Please try again in a moment.",
                    "ok",
                );
            } else {
                this.createPromptSprite("An unknown Error has occurred.", "oh");
            }
        } else if (_loc4_[0] == "success") {
            this.createPromptSprite("Favorites list updated.", "ok");
            if (this.favoriteId > 0) {
                _loc5_ = int(
                    Settings.favoriteLevelIds.indexOf(this.favoriteId),
                );
                if (_loc5_ == -1) {
                    Settings.favoriteLevelIds.push(this.favoriteId);
                }
            } else if (this.favoriteId < 0) {
                _loc5_ = int(
                    Settings.favoriteLevelIds.indexOf(-this.favoriteId),
                );
                if (_loc5_ > -1) {
                    Settings.favoriteLevelIds.splice(_loc5_, 1);
                }
            }
        }
    }

    private flagLevel(param1: BrowserEvent) {
        trace("FLAG LEVEL");
        var _loc2_ = param1.extra as number;
        this.statusSprite = new StatusSprite("flagging level...");
        var _loc3_: Window = this.statusSprite.window;
        this.addChild(_loc3_);
        _loc3_.center();
        var _loc4_ = new URLRequest(Settings.siteURL + Settings.FLAG_LEVEL);
        var _loc5_ = new URLVariables();
        _loc5_.levelid = _loc2_;
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
        this.statusSprite.die();
        this.removeLoaderListeners();
        trace((this.loader.data as any).ToFlash);
        if ((this.loader.data as any).ToFlash != "error") {
            this.createPromptSprite("Level flagged, Thank you.", "ok");
        }
    }

    private updateAuthors(param1: string, param2: number) {
        if (LevelBrowser.authorValues.indexOf(param2) == -1) {
            LevelBrowser.authorValues.push(param2);
            LevelBrowser.authorDisplay.push(param1);
            this.authorDropMenu.addValue(param1, param2);
        }
    }

    private getLevelsFromAuthor(param1: BrowserEvent) {
        var _loc2_: LevelDataObject = param1.extra as LevelDataObject;
        this.updateAuthors(_loc2_.author_name, _loc2_.author_id);
        this.authorDropMenu.currentIndex = this.authorDropMenu.valueIndex(
            _loc2_.author_id,
        );
        LevelBrowser.currentDropSettings[0] = this.authorDropMenu.currentIndex;
        trace("searchtermbutton " + this.searchTermButton);
        if (this.searchTermButton) {
            this.removeSearchTerm();
        }
        LevelBrowser.currentDropStates = [1, 0, 0];
        this.organizeDropMenus();
        this.loadData();
    }

    private flipPage(param1: Event) {
        var _loc2_: number = LevelBrowser.currentSet;
        LevelBrowser.currentPage = this.pageFlipper.currentPage;
        LevelBrowser.currentSet = Math.ceil(
            (LevelBrowser.currentPage * LevelBrowser.pageLength) /
            LevelBrowser.setLength,
        );
        var _loc3_ = int(LevelBrowser.levelDataArray.length);
        if (
            LevelBrowser.currentSet > _loc2_ &&
            _loc3_ <= (LevelBrowser.currentSet - 1) * LevelBrowser.setLength
        ) {
            this.loadDataOffset();
        } else {
            this.killList();
            this.buildList();
        }
    }

    private buildList() {
        var _loc5_: boolean = false;
        var _loc1_: number =
            (LevelBrowser.currentPage - 1) * LevelBrowser.pageLength;
        var _loc2_: number = _loc1_ + LevelBrowser.pageLength;
        _loc2_ = Math.min(_loc2_, LevelBrowser.levelDataArray.length);
        var _loc3_: any[] = LevelBrowser.levelDataArray.slice(_loc1_, _loc2_);
        this.listContainer = new Sprite();
        this.list = new LevelList(
            _loc3_,
            LevelBrowser.lastLevelId,
            LevelBrowser.selectedCharacter,
        );
        LevelBrowser.lastLevelId = -1;
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
            LevelList.UPDATE_SCROLLER,
            this.updateScroller,
        );
        this.list.addEventListener(LevelList.FACE_SELECTED, this.faceSelected);
        this.list.addEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.list.addEventListener(
            NavigationEvent.EDITOR,
            this.cloneAndDispatchEvent,
        );
        this.list.addEventListener(
            NavigationEvent.REPLAY_BROWSER,
            this.cloneAndDispatchEvent,
        );
        this.list.addEventListener(BrowserEvent.USER, this.getLevelsFromAuthor);
        this.list.addEventListener(BrowserEvent.FLAG, this.flagLevel);
        this.list.addEventListener(
            BrowserEvent.ADD_TO_FAVORITES,
            this.editFavorites,
        );
        this.list.addEventListener(
            BrowserEvent.REMOVE_FROM_FAVORITES,
            this.editFavorites,
        );
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
        var _loc4_ = int(LevelBrowser.levelDataArray.length);
        if (_loc4_ == 0) {
            this.createPromptSprite(
                "no levels found using these parameters",
                "ok",
            );
        } else {
            _loc5_ = _loc4_ % LevelBrowser.setLength > 0 ? true : false;
            this.pageFlipper = new PageFlipperNew(
                LevelBrowser.currentPage,
                LevelBrowser.pageLength,
                _loc4_,
                _loc5_,
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
            LevelList.UPDATE_SCROLLER,
            this.updateScroller,
        );
        this.list.removeEventListener(
            LevelList.FACE_SELECTED,
            this.faceSelected,
        );
        this.list.removeEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.list.removeEventListener(
            NavigationEvent.EDITOR,
            this.cloneAndDispatchEvent,
        );
        this.list.removeEventListener(
            NavigationEvent.REPLAY_BROWSER,
            this.cloneAndDispatchEvent,
        );
        this.list.removeEventListener(
            BrowserEvent.USER,
            this.getLevelsFromAuthor,
        );
        this.list.removeEventListener(BrowserEvent.FLAG, this.flagLevel);
        this.list.removeEventListener(
            BrowserEvent.ADD_TO_FAVORITES,
            this.editFavorites,
        );
        this.list.removeEventListener(
            BrowserEvent.REMOVE_FROM_FAVORITES,
            this.editFavorites,
        );
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
        if (param1.levelDataObject) {
            LevelBrowser.lastLevelId = param1.levelDataObject.id;
        }
        var _loc2_: Event = param1.clone();
        this.dispatchEvent(_loc2_);
    }

    private faceSelected(param1: Event = null) {
        LevelBrowser.selectedCharacter = this.list.selectedCharacter;
        if (LevelBrowser.selectedCharacter > 0) {
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

    public die() {
        this.authorDropMenu.removeEventListener(
            DropMenu.ITEM_SELECTED,
            this.dropMenuSelected,
        );
        this.charDropMenu.removeEventListener(
            DropMenu.ITEM_SELECTED,
            this.dropMenuSelected,
        );
        this.sortDropMenu.removeEventListener(
            DropMenu.ITEM_SELECTED,
            this.dropMenuSelected,
        );
        this.uploadDropMenu.removeEventListener(
            DropMenu.ITEM_SELECTED,
            this.dropMenuSelected,
        );
        this.authorDropMenu.die();
        this.charDropMenu.die();
        this.sortDropMenu.die();
        this.uploadDropMenu.die();
        if (this.pageFlipper) {
            this.pageFlipper.die();
            this.pageFlipper.removeEventListener(
                PageFlipperNew.FLIP_PAGE,
                this.flipPage,
            );
        }
        this.searchButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.openSearchMenu,
        );
        this.favoritesButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.listFavorites,
        );
        this.backButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.backPress,
        );
        if (this.searchTermButton) {
            this.searchTermButton.removeEventListener(
                MouseEvent.MOUSE_UP,
                this.removeSearchTerm,
            );
        }
        this.refreshButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.loadData,
        );
        if (this.list) {
            this.killList();
        }
    }
}