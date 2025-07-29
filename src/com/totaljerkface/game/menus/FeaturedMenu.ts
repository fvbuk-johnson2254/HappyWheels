import Settings from "@/com/totaljerkface/game/Settings";
import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import LibraryButton from "@/com/totaljerkface/game/editor/ui/LibraryButton";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import FeaturedLevelButton from "@/com/totaljerkface/game/menus/FeaturedLevelButton";
import LevelBrowser from "@/com/totaljerkface/game/menus/LevelBrowser";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import VoteStars from "@/com/totaljerkface/game/menus/VoteStars";
import TextUtils from "@/com/totaljerkface/game/utils/TextUtils";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import TweenLite from "@/gs/TweenLite";
import Strong from "@/gs/easing/Strong";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import SecurityErrorEvent from "flash/events/SecurityErrorEvent";
import URLLoader from "flash/net/URLLoader";
import URLRequest from "flash/net/URLRequest";
import URLRequestMethod from "flash/net/URLRequestMethod";
import URLVariables from "flash/net/URLVariables";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";

/* [Embed(source="/_assets/assets.swf", symbol="symbol640")] */
@boundClass
export default class FeaturedMenu extends Sprite {
    private static levelDataArray: any[];
    private static lastItemIndex: number = -1;
    private static yVal: number = 10;
    public nameText: TextField;
    public authorText: TextField;
    public charText: TextField;
    public commentsText: TextField;
    public voteText: TextField;
    public playText: TextField;
    public commentsBg: Sprite;
    public voteStars: VoteStars;
    public hiliter: Sprite;
    public arrows: Sprite;
    public playBtn: LibraryButton;
    public viewReplaysBtn: LibraryButton;
    public backBtn: LibraryButton;
    public browserBtn: LibraryButton;
    public otherLevelsBtn: Sprite;
    private authorSprite: Sprite;
    private currentAuthorId: number;
    private currentAuthorName: string;
    private currentItem: FeaturedLevelButton;
    private featuredList: any[];
    private listMask: Sprite;
    private listHolder: Sprite;
    private listHitArea: Sprite;
    private list: Sprite;
    private listHeight: number;
    private commentMask: Sprite;
    private topY: number = 70;
    private listSpacing: number = 10;
    private scrollSpeed: number = 0;
    private scrollAccel: number = 1;
    private scrollMaxSpeed: number = 10;
    private loader: URLLoader;

    public init() {
        this.mouseChildren = false;
        this.formatTextFields();
        if (!FeaturedMenu.levelDataArray) {
            this.loadFeaturedData();
        } else {
            this.buildList();
        }
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.addEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
    }

    public activate() {
        this.mouseChildren = true;
    }

    private formatTextFields() {
        this.authorSprite = new Sprite();
        this.authorSprite.x = this.authorText.x;
        this.authorSprite.y = this.authorText.y;
        this.authorSprite.x = 0;
        this.authorSprite.y = 0;
        this.authorSprite.addChild(this.authorText);
        this.addChild(this.authorSprite);
        this.authorSprite.mouseChildren = false;
        this.authorSprite.buttonMode = true;
        this.nameText.selectable =
            this.authorText.selectable =
            this.charText.selectable =
            this.commentsText.selectable =
            this.voteText.selectable =
            this.playText.selectable =
            false;
        this.nameText.embedFonts =
            this.authorText.embedFonts =
            this.charText.embedFonts =
            this.commentsText.embedFonts =
            this.voteText.embedFonts =
            this.playText.embedFonts =
            true;
        this.nameText.autoSize =
            this.authorText.autoSize =
            this.charText.autoSize =
            this.commentsText.autoSize =
            this.voteText.autoSize =
            this.playText.autoSize =
            TextFieldAutoSize.LEFT;
        this.nameText.wordWrap =
            this.authorText.wordWrap =
            this.charText.wordWrap =
            this.voteText.wordWrap =
            this.playText.wordWrap =
            false;
        this.commentsText.wordWrap = true;
        this.commentsText.mouseEnabled = false;
        this.commentMask = new Sprite();
        this.commentMask.graphics.beginFill(16777215, 1);
        this.commentMask.graphics.drawRect(
            0,
            0,
            this.commentsBg.width,
            this.commentsBg.height,
        );
        this.commentMask.graphics.endFill();
        this.commentMask.x = this.commentsBg.x;
        this.commentMask.y = this.commentsBg.y;
        this.addChild(this.commentMask);
        this.commentsText.mask = this.commentMask;
    }

    private loadFeaturedData() {
        var _loc1_ = new URLRequest(Settings.siteURL + "get_level.hw");
        _loc1_.method = URLRequestMethod.POST;
        var _loc2_ = new URLVariables();
        _loc2_.action = "get_featured";
        _loc1_.data = _loc2_;
        trace("URL " + _loc1_.url);
        this.loader = new URLLoader();
        this.addLoaderListeners();
        this.loader.load(_loc1_);
    }

    private addLoaderListeners() {
        if (!this.loader) {
            return;
        }
        this.loader.addEventListener(Event.COMPLETE, this.dataLoadComplete);
        this.loader.addEventListener(
            SecurityErrorEvent.SECURITY_ERROR,
            this.securityErrorHandler,
        );
    }

    private removeLoaderListeners() {
        if (!this.loader) {
            return;
        }
        this.loader.removeEventListener(Event.COMPLETE, this.dataLoadComplete);
        this.loader.removeEventListener(
            SecurityErrorEvent.SECURITY_ERROR,
            this.securityErrorHandler,
        );
    }

    private dataLoadComplete(param1: Event) {
        var _loc4_: PromptSprite = null;
        var _loc11_: any[] = null;
        var _loc12_: Window = null;
        var _loc13_: XML = null;
        var _loc14_: LevelDataObject = null;
        trace("LOAD COMPLETE");
        this.removeLoaderListeners();
        var _loc2_ = this.loader.data.toString();
        var _loc3_: string = _loc2_.substr(0, 8);
        trace("dataString " + _loc3_);
        if (_loc3_.indexOf("<html>") > -1) {
            _loc4_ = new PromptSprite(
                "There was an unexpected system Error",
                "oh",
            );
        } else if (_loc3_.indexOf("failure") > -1) {
            _loc11_ = _loc2_.split(":");
            if (_loc11_[1] == "invalid_action") {
                _loc4_ = new PromptSprite(
                    "An invalid action was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc11_[1] == "bad_param") {
                _loc4_ = new PromptSprite(
                    "A bad parameter was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc11_[1] == "app_error") {
                _loc4_ = new PromptSprite(
                    "Sorry, there was an application error. It was most likely database related. Please try again in a moment.",
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
            _loc12_ = _loc4_.window;
            this.addChild(_loc12_);
            _loc12_.center();
            return;
        }
        var _loc5_ = new XML(this.loader.data.toString());
        FeaturedMenu.levelDataArray = new Array();
        var _loc6_ = new Array();
        var _loc7_ = new Array();
        var _loc8_ = new Date();
        var _loc9_ = int(_loc5_.lv.length());
        trace("LEN " + _loc9_);
        var _loc10_: number = 0;
        while (_loc10_ < _loc9_) {
            _loc13_ = _loc5_.lv[_loc10_];
            trace("______ " + _loc10_ + " " + _loc13_);
            _loc14_ = new LevelDataObject(
                _loc13_["id"],
                _loc13_["ln"],
                _loc13_["ui"],
                _loc13_["un"],
                _loc13_["rg"],
                _loc13_["vs"],
                _loc13_["ps"],
                _loc13_["dp"],
                _loc13_.uc,
                _loc13_["pc"],
                "1",
                "1",
                "1",
                _loc13_["df"],
            );
            if (
                (_loc8_.getTime() - _loc14_.date_featured.getTime()) /
                86400000 <
                14
            ) {
                _loc6_.push(_loc14_);
            } else {
                _loc7_.push(_loc14_);
            }
            _loc10_++;
        }
        FeaturedMenu.levelDataArray = _loc6_.concat(_loc7_);
        this.buildList();
    }

    private securityErrorHandler(param1: SecurityErrorEvent) {
        trace(param1.text);
        this.removeLoaderListeners();
    }

    private buildList() {
        var _loc1_: number = NaN;
        var _loc4_: LevelDataObject = null;
        var _loc5_: boolean = false;
        var _loc6_: FeaturedLevelButton = null;
        this.featuredList = new Array();
        this.list = new Sprite();
        this.list.y = this.listSpacing;
        this.listHolder = new Sprite();
        this.listMask = new Sprite();
        this.listHitArea = new Sprite();
        this.listHitArea.graphics.beginFill(65280);
        this.listHitArea.graphics.drawRect(0, 0, 400, 430);
        this.listHitArea.graphics.endFill();
        this.listMask.graphics.beginFill(16711680);
        this.listMask.graphics.drawRect(0, 0, 400, 430);
        this.listMask.graphics.endFill();
        this.listHolder.y = this.listMask.y = this.topY;
        this.listHolder.addChild(this.listHitArea);
        this.listHolder.addChild(this.list);
        this.addChild(this.listHolder);
        this.addChild(this.listMask);
        this.listHolder.mask = this.listMask;
        this.listHolder.hitArea = this.listHitArea;
        this.listHitArea.visible = false;
        _loc1_ = 0;
        var _loc2_ = new Date();
        var _loc3_: number = 0;
        while (_loc3_ < FeaturedMenu.levelDataArray.length) {
            _loc4_ = FeaturedMenu.levelDataArray[_loc3_];
            _loc5_ =
                (_loc2_.getTime() - _loc4_.date_featured.getTime()) / 86400000 <
                    14
                    ? true
                    : false;
            _loc6_ = new FeaturedLevelButton(_loc4_.name, _loc5_);
            _loc6_.x = 75;
            _loc6_.y = _loc1_;
            _loc1_ += _loc6_.height + this.listSpacing;
            this.list.addChild(_loc6_);
            this.featuredList.push(_loc6_);
            _loc3_++;
        }
        this.listHeight = this.list.height;
        this.list.addChildAt(this.arrows, 0);
        this.list.addChildAt(this.hiliter, 0);
        if (FeaturedMenu.lastItemIndex > -1) {
            this.selectItem(this.featuredList[FeaturedMenu.lastItemIndex]);
        } else {
            this.selectItem(this.featuredList[0]);
        }
        if (this.listHeight > this.listHitArea.height) {
            this.listHolder.addEventListener(
                MouseEvent.ROLL_OVER,
                this.startListScroll,
            );
            this.listHolder.addEventListener(
                MouseEvent.ROLL_OUT,
                this.stopListScroll,
            );
        }
        this.list.y = FeaturedMenu.yVal;
    }

    private startListScroll(param1: MouseEvent) {
        this.list.removeEventListener(Event.ENTER_FRAME, this.stopScroll);
        this.list.addEventListener(Event.ENTER_FRAME, this.listScroll);
    }

    private stopListScroll(param1: MouseEvent) {
        this.list.removeEventListener(Event.ENTER_FRAME, this.listScroll);
        this.list.addEventListener(Event.ENTER_FRAME, this.stopScroll);
    }

    private stopScroll(param1: Event) {
        if (this.scrollSpeed > 0) {
            --this.scrollSpeed;
        } else if (this.scrollSpeed < 0) {
            this.scrollSpeed += 1;
        } else {
            this.list.removeEventListener(Event.ENTER_FRAME, this.stopScroll);
        }
        this.list.y += this.scrollSpeed;
        this.checkScrollLimits();
    }

    private listScroll(param1: Event) {
        var _loc2_: number = this.listHitArea.mouseY / this.listHitArea.height;
        if (_loc2_ > 0.75 && this.scrollSpeed > -this.scrollMaxSpeed) {
            this.scrollSpeed -= this.scrollAccel;
        } else if (_loc2_ < 0.25 && this.scrollSpeed < this.scrollMaxSpeed) {
            this.scrollSpeed += this.scrollAccel;
        } else if (this.scrollSpeed > 0) {
            --this.scrollSpeed;
        } else if (this.scrollSpeed < 0) {
            this.scrollSpeed += 1;
        }
        this.list.y += this.scrollSpeed;
        this.checkScrollLimits();
    }

    private checkScrollLimits() {
        if (this.list.y > 0 + this.listSpacing) {
            this.list.y = 0 + this.listSpacing;
            this.scrollSpeed = 0;
        } else if (
            this.list.y <
            this.listHitArea.height - (this.listHeight + this.listSpacing)
        ) {
            this.list.y =
                this.listHitArea.height - (this.listHeight + this.listSpacing);
            this.scrollSpeed = 0;
        }
        FeaturedMenu.yVal = this.list.y;
    }

    private mouseUpHandler(param1: Event) {
        var _loc2_: number = 0;
        var _loc3_: LevelDataObject = null;
        var _loc4_: URLRequest = null;
        if (param1.target instanceof FeaturedLevelButton) {
            this.selectItem(param1.target as FeaturedLevelButton);
        } else {
            switch (param1.target) {
                case this.backBtn:
                    Tracker.trackEvent(
                        Tracker.FEATURED_BROWSER,
                        Tracker.GOTO_MAIN_MENU,
                    );
                    this.dispatchEvent(
                        new NavigationEvent(NavigationEvent.MAIN_MENU),
                    );
                    break;
                case this.browserBtn:
                    Tracker.trackEvent(
                        Tracker.FEATURED_BROWSER,
                        Tracker.GOTO_LEVEL_BROWSER,
                    );
                    this.dispatchEvent(
                        new NavigationEvent(NavigationEvent.LEVEL_BROWSER),
                    );
                    break;
                case this.playBtn:
                    if (!this.currentItem) {
                        return;
                    }
                    _loc2_ = int(
                        (FeaturedMenu.lastItemIndex = this.featuredList.indexOf(
                            this.currentItem,
                        )),
                    );
                    _loc3_ = FeaturedMenu.levelDataArray[_loc2_];
                    Tracker.trackEvent(
                        Tracker.FEATURED_BROWSER,
                        Tracker.LOAD_LEVEL,
                        "levelID_" + _loc3_.id,
                    );
                    this.dispatchEvent(
                        new NavigationEvent(NavigationEvent.SESSION, _loc3_),
                    );
                    break;
                case this.viewReplaysBtn:
                    if (!this.currentItem) {
                        return;
                    }
                    _loc2_ = int(
                        (FeaturedMenu.lastItemIndex = this.featuredList.indexOf(
                            this.currentItem,
                        )),
                    );
                    _loc3_ = FeaturedMenu.levelDataArray[_loc2_];
                    Tracker.trackEvent(
                        Tracker.FEATURED_BROWSER,
                        Tracker.GOTO_REPLAY_BROWSER,
                        "levelID_" + _loc3_.id,
                    );
                    this.dispatchEvent(
                        new NavigationEvent(
                            NavigationEvent.REPLAY_BROWSER,
                            _loc3_,
                        ),
                    );
                    break;
                case this.authorSprite:
                    if (this.currentAuthorId) {
                        _loc4_ = new URLRequest(
                            "http://www.totaljerkface.com/profile.tjf?uid=" +
                            this.currentAuthorId,
                        );
                        navigateToURL(_loc4_, "_blank");
                        Tracker.trackEvent(
                            Tracker.FEATURED_BROWSER,
                            Tracker.GOTO_USER_PAGE,
                            "userID_" + this.currentAuthorId,
                        );
                    }
                    break;
                case this.otherLevelsBtn:
                    if (this.currentAuthorId) {
                        LevelBrowser.importAuthor(
                            this.currentAuthorName,
                            this.currentAuthorId,
                        );
                        Tracker.trackEvent(
                            Tracker.FEATURED_BROWSER,
                            Tracker.GET_LEVELS_BY_AUTHOR,
                            "authorID_" + this.currentAuthorId,
                        );
                        this.dispatchEvent(
                            new NavigationEvent(NavigationEvent.LEVEL_BROWSER),
                        );
                    }
            }
        }
    }

    private mouseOverHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.otherLevelsBtn:
                if (this.currentAuthorId) {
                    MouseHelper.instance.show(
                        "view other levels by this author",
                        this.otherLevelsBtn,
                        5,
                    );
                }
        }
    }

    private selectItem(param1: FeaturedLevelButton) {
        if (this.currentItem) {
            this.currentItem.selected = false;
        }
        this.currentItem = param1;
        this.currentItem.selected = true;
        var _loc2_ = int(this.featuredList.indexOf(this.currentItem));
        var _loc3_: LevelDataObject = FeaturedMenu.levelDataArray[_loc2_];
        this.populateFields(_loc3_);
        TweenLite.to(this.hiliter, 0.85, {
            y: this.currentItem.y + 5,
            ease: Strong.easeInOut,
        });
        TweenLite.to(this.arrows, 1, {
            y: this.currentItem.y + 5,
            ease: Strong.easeInOut,
        });
    }

    private populateFields(param1: LevelDataObject) {
        this.currentAuthorId = param1.author_id;
        this.currentAuthorName = param1.author_name;
        this.nameText.htmlText = "<b>" + param1.name + "</b>";
        this.authorText.htmlText = "<b>" + param1.author_name + "</b>";
        this.voteText.htmlText = "<b>(" + param1.votes + " votes)</b>";
        var _loc2_: string = TextUtils.addIntegerCommas(param1.plays);
        this.playText.htmlText = "<b>played " + _loc2_ + " times";
        this.otherLevelsBtn.x = Math.round(
            this.authorText.x + this.authorText.textWidth + 10,
        );
        this.otherLevelsBtn.buttonMode = true;
        var _loc3_: string =
            param1.character > 0
                ? Settings.characterNames[param1.character - 1]
                : "any";
        this.charText.htmlText = "<b>playable character: " + _loc3_ + "</b>";
        this.voteStars.rating = param1.average_rating;
        this.commentsText.text = param1.comments;
        this.commentsBg.removeEventListener(
            Event.ENTER_FRAME,
            this.scrollComments,
        );
        this.commentsBg.removeEventListener(
            MouseEvent.ROLL_OVER,
            this.beginCommentScroll,
        );
        this.commentsBg.removeEventListener(
            MouseEvent.ROLL_OUT,
            this.endCommentScroll,
        );
        this.commentsText.y = this.commentsBg.y + 5;
        if (this.commentsText.height > this.commentsBg.height) {
            this.commentsBg.addEventListener(
                MouseEvent.ROLL_OVER,
                this.beginCommentScroll,
            );
            this.commentsBg.addEventListener(
                MouseEvent.ROLL_OUT,
                this.endCommentScroll,
            );
        }
    }

    private beginCommentScroll(param1: MouseEvent) {
        this.commentsBg.addEventListener(
            Event.ENTER_FRAME,
            this.scrollComments,
        );
    }

    private endCommentScroll(param1: MouseEvent) {
        this.commentsBg.removeEventListener(
            Event.ENTER_FRAME,
            this.scrollComments,
        );
    }

    private scrollComments(param1: Event) {
        var _loc2_: number = this.commentsBg.height / 2;
        var _loc3_: number = _loc2_ - this.commentsBg.mouseY;
        var _loc4_: number = _loc3_ / _loc2_;
        var _loc5_: number = _loc4_ * 10;
        this.commentsText.y += _loc5_;
        if (
            this.commentsText.y + this.commentsText.height <
            this.commentsBg.y + this.commentsBg.height
        ) {
            this.commentsText.y =
                this.commentsBg.y +
                this.commentsBg.height -
                this.commentsText.height;
        }
        if (this.commentsText.y > this.commentsBg.y + 5) {
            this.commentsText.y = this.commentsBg.y + 5;
        }
    }

    public die() {
        this.removeLoaderListeners();
        try {
            this.loader.close();
        } catch (error) {
            trace("catch error = " + Error);
        }
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.removeEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
        if (this.listHolder) {
            this.listHolder.removeEventListener(
                MouseEvent.ROLL_OVER,
                this.startListScroll,
            );
            this.listHolder.removeEventListener(
                MouseEvent.ROLL_OUT,
                this.stopListScroll,
            );
            this.list.removeEventListener(Event.ENTER_FRAME, this.stopScroll);
            this.list.removeEventListener(Event.ENTER_FRAME, this.listScroll);
        }
        this.commentsBg.removeEventListener(
            Event.ENTER_FRAME,
            this.scrollComments,
        );
        this.commentsBg.removeEventListener(
            MouseEvent.ROLL_OVER,
            this.beginCommentScroll,
        );
        this.commentsBg.removeEventListener(
            MouseEvent.ROLL_OUT,
            this.endCommentScroll,
        );
    }
}