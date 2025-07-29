import Settings from "@/com/totaljerkface/game/Settings";
import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import StatusSprite from "@/com/totaljerkface/game/editor/StatusSprite";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import VotingStars from "@/com/totaljerkface/game/menus/VotingStars";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import FullScreenButton from "@/top/FullScreenButton";
import MuteButton from "@/top/MuteButton";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import StageDisplayState from "flash/display/StageDisplayState";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import URLLoader from "flash/net/URLLoader";
import URLRequest from "flash/net/URLRequest";
import URLRequestMethod from "flash/net/URLRequestMethod";
import URLVariables from "flash/net/URLVariables";
import TextField from "flash/text/TextField";

/* [Embed(source="/_assets/assets.swf", symbol="symbol102")] */
@boundClass
export default class SessionMenu extends Sprite {
    public static RESTART_LEVEL: string;
    public static CHOOSE_CHARACTER: string = "choosecharacter";
    public static VIEW_REPLAY: string = "viewreplay";
    public static SAVE_REPLAY: string = "savereplay";
    public static ADD_LEVEL_TO_FAVORITES: string = "addleveltofavorites";
    public static EXIT: string = "exit";
    public static CANCEL: string = "cancel";
    public levelNameText: TextField;
    public authorText: TextField;
    private _window: Window;
    private levelDataObject: LevelDataObject;
    private votingStars: VotingStars;
    private restartButton: GenericButton;
    private replayButton: GenericButton;
    private saveButton: GenericButton;
    private editFavoritesButton: GenericButton;
    private characterButton: GenericButton;
    private exitButton: GenericButton;
    private cancelButton: GenericButton;
    private muteButton: MovieClip;
    private fullScreenButton: MovieClip;
    private isFavorite: boolean;
    private _disableSave: boolean;
    private _disableKeys: boolean;
    private statusSprite: StatusSprite;
    private promptSprite: PromptSprite;

    constructor(param1: LevelDataObject, param2: boolean = false) {
        super();
        this.levelDataObject = param1;
        this._disableSave = param2;
        this.buildWindow();
    }

    public init() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        this.levelNameText.htmlText = "<b>" + this.levelDataObject.name + "</b>";
        this.authorText.text = this.levelDataObject.author_name;
        this.votingStars = new VotingStars(this.levelDataObject.average_rating);
        this.votingStars.x = 45;
        this.votingStars.y = 74;
        _loc1_ = 120;
        _loc2_ = (240 - _loc1_) / 2;
        this.restartButton = new GenericButton(
            "restart level",
            4032711,
            _loc1_,
        );
        this.restartButton.x = _loc2_;
        this.restartButton.y = 114;
        this.addChild(this.restartButton);
        this.characterButton = new GenericButton(
            "change character",
            4032711,
            _loc1_,
        );
        this.characterButton.x = _loc2_;
        this.characterButton.y = 144;
        this.addChild(this.characterButton);
        if (this.levelDataObject.forceChar) {
            this.characterButton.disabled = true;
        }
        this.replayButton = new GenericButton("view replay", 4032711, _loc1_);
        this.replayButton.x = _loc2_;
        this.replayButton.y = 174;
        this.addChild(this.replayButton);
        this.saveButton = new GenericButton("save replay", 4032711, _loc1_);
        this.saveButton.x = _loc2_;
        this.saveButton.y = 204;
        this.addChild(this.saveButton);
        this.disableSave = this._disableSave;
        this.isFavorite =
            Settings.favoriteLevelIds.indexOf(this.levelDataObject.id) > -1
                ? true
                : false;
        var _loc3_: string = this.isFavorite
            ? "remove favorite"
            : "add to favorites";
        this.editFavoritesButton = new GenericButton(
            _loc3_,
            16776805,
            _loc1_,
            0,
        );
        this.editFavoritesButton.x = _loc2_;
        this.editFavoritesButton.y = 234;
        this.addChild(this.editFavoritesButton);
        this.exitButton = new GenericButton("exit to menu", 16613761, _loc1_);
        this.exitButton.x = _loc2_;
        this.exitButton.y = 272;
        this.addChild(this.exitButton);
        this.cancelButton = new GenericButton("resume", 16613761, _loc1_);
        this.cancelButton.x = _loc2_;
        this.cancelButton.y = 303;
        this.addChild(this.cancelButton);
        this.muteButton = new MuteButton();
        if (SoundController.instance.isMuted) {
            this.muteButton.gotoAndStop(2);
        } else {
            this.muteButton.gotoAndStop(1);
        }
        this.muteButton.x = _loc2_ - 48;
        this.muteButton.y = 319;
        this.addChild(this.muteButton);
        this.muteButton.mouseChildren = false;
        this.muteButton.buttonMode = true;
        this.muteButton.tabEnabled = false;
        this.fullScreenButton = new FullScreenButton();
        if (
            this.stage.displayState == StageDisplayState.FULL_SCREEN_INTERACTIVE
        ) {
            this.fullScreenButton.gotoAndStop(2);
        } else {
            this.fullScreenButton.gotoAndStop(1);
        }
        this.fullScreenButton.x = _loc2_ + 153;
        this.fullScreenButton.y = 316;
        this.addChild(this.fullScreenButton);
        this.fullScreenButton.mouseChildren = false;
        this.fullScreenButton.buttonMode = true;
        this.fullScreenButton.tabEnabled = false;
        this.addChild(this.votingStars);
        this.addEventListener(MouseEvent.MOUSE_OVER, this.rollOverHandler);
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.stage.addEventListener(KeyboardEvent.KEY_UP, this.keyDownHandler);
        this.votingStars.addEventListener(
            VotingStars.RATING_SELECTED,
            this.vote,
        );
    }

    private buildWindow() {
        this._window = new Window(false, this, false);
    }

    public get window(): Window {
        return this._window;
    }

    public set disableSave(param1: boolean) {
        this._disableSave = param1;
        if (param1) {
            this.saveButton.disabled = true;
        } else {
            this.saveButton.disabled = false;
        }
    }

    public get disableKeys(): boolean {
        return this._disableKeys;
    }

    public set disableKeys(param1: boolean) {
        this._disableKeys = param1;
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: Window = null;
        switch (param1.target) {
            case this.restartButton:
                this.dispatchEvent(new Event(SessionMenu.RESTART_LEVEL));
                break;
            case this.characterButton:
                Tracker.trackEvent(
                    Tracker.LEVEL,
                    Tracker.CHANGE_CHARACTER,
                    "levelID_" + this.levelDataObject.id,
                );
                this.dispatchEvent(new Event(SessionMenu.CHOOSE_CHARACTER));
                break;
            case this.replayButton:
                this.dispatchEvent(new Event(SessionMenu.VIEW_REPLAY));
                break;
            case this.saveButton:
                if (Settings.user_id <= 0) {
                    this.promptSprite = new PromptSprite(
                        "You must be logged in to save replays.  Login or register for free up there on the right.",
                        "ok",
                    );
                    _loc2_ = this.promptSprite.window;
                    this._window.parent.addChild(_loc2_);
                    _loc2_.center();
                    return;
                }
                if (Settings.disableUpload) {
                    this.promptSprite = new PromptSprite(
                        Settings.disableMessage,
                        "OH FINE",
                    );
                    _loc2_ = this.promptSprite.window;
                    this._window.parent.addChild(_loc2_);
                    _loc2_.center();
                    return;
                }
                this.dispatchEvent(new Event(SessionMenu.SAVE_REPLAY));
                break;
            case this.editFavoritesButton:
                if (Settings.user_id <= 0) {
                    this.promptSprite = new PromptSprite(
                        "You must be logged in to edit your favorite levels.  Login or register for free up there on the right.",
                        "ok",
                    );
                    _loc2_ = this.promptSprite.window;
                    this._window.parent.addChild(_loc2_);
                    _loc2_.center();
                    return;
                }
                if (Settings.disableUpload) {
                    this.promptSprite = new PromptSprite(
                        Settings.disableMessage,
                        "OH FINE",
                    );
                    _loc2_ = this.promptSprite.window;
                    this._window.parent.addChild(_loc2_);
                    _loc2_.center();
                    return;
                }
                this.editFavorites();
                break;
            case this.exitButton:
                this.dispatchEvent(new Event(SessionMenu.EXIT));
                break;
            case this.cancelButton:
                this.dispatchEvent(new Event(SessionMenu.CANCEL));
                break;
            case this.muteButton:
                if (this.muteButton.currentFrame == 1) {
                    this.muteButton.gotoAndStop(2);
                    SoundController.instance.mute();
                    Tracker.trackEvent(Tracker.LEVEL, Tracker.MUTE);
                } else {
                    this.muteButton.gotoAndStop(1);
                    SoundController.instance.unMute();
                    Tracker.trackEvent(Tracker.LEVEL, Tracker.UNMUTE);
                }
                break;
            case this.fullScreenButton:
                if (
                    this.stage.displayState ==
                    StageDisplayState.FULL_SCREEN_INTERACTIVE
                ) {
                    this.stage.displayState = StageDisplayState.NORMAL;
                    if (this.stage.displayState == StageDisplayState.NORMAL) {
                        this.fullScreenButton.gotoAndStop(1);
                    }
                } else {
                    this.stage.displayState =
                        StageDisplayState.FULL_SCREEN_INTERACTIVE;
                    if (
                        this.stage.displayState ==
                        StageDisplayState.FULL_SCREEN_INTERACTIVE
                    ) {
                        this.fullScreenButton.gotoAndStop(2);
                    }
                }
        }
    }

    private rollOverHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.restartButton:
                MouseHelper.instance.show("(R)", this.restartButton);
                break;
            case this.fullScreenButton:
                MouseHelper.instance.show("Fullscreen", this.fullScreenButton);
                break;
            case this.muteButton:
                MouseHelper.instance.show("Mute / Unmute", this.muteButton);
        }
    }

    private keyDownHandler(param1: KeyboardEvent) {
        if (this._disableKeys) {
            return;
        }
        switch (param1.keyCode) {
            case 82:
                this.dispatchEvent(new Event(SessionMenu.RESTART_LEVEL));
        }
    }

    private editFavorites() {
        var _loc5_: string = null;
        var _loc1_ = new URLRequest(Settings.siteURL + "user.hw");
        _loc1_.method = URLRequestMethod.POST;
        var _loc2_ = new URLVariables();
        _loc2_.level_id = this.levelDataObject.id;
        _loc1_.data = _loc2_;
        if (!this.isFavorite) {
            trace("ADD TO FAVORITES");
            _loc5_ = "adding level to favorites...";
            _loc2_.action = "set_favorite";
        } else {
            trace("REMOVE FROM FAVORITES");
            _loc5_ = "removing level from favorites...";
            _loc2_.action = "delete_favorite";
        }
        this.statusSprite = new StatusSprite(_loc5_);
        var _loc3_: Window = this.statusSprite.window;
        this._window.parent.addChild(_loc3_);
        _loc3_.center();
        var _loc4_ = new URLLoader();
        _loc4_.addEventListener(Event.COMPLETE, this.editFavoritesComplete);
        _loc4_.load(_loc1_);
    }

    private editFavoritesComplete(param1: Event) {
        var _loc7_: number = 0;
        trace("EDIT FAVORITES -- COMPLETE");
        this.statusSprite.die();
        var _loc2_: URLLoader = param1.target as URLLoader;
        _loc2_.removeEventListener(Event.COMPLETE, this.editFavoritesComplete);
        var _loc3_ = _loc2_.data.toString();
        var _loc4_: string = _loc3_.substr(0, 8);
        trace("dataString " + _loc4_);
        var _loc5_: any[] = _loc3_.split(":");
        if (_loc4_.indexOf("<html>") > -1) {
            this.promptSprite = new PromptSprite(
                "There was an unexpected system Error",
                "oh",
            );
        } else if (_loc5_[0] == "failure") {
            if (_loc5_[1] == "not_logged_in") {
                this.promptSprite = new PromptSprite(
                    "You must be logged in to edit your favorite levels.  Login or register for free up there on the right.",
                    "ok",
                );
            } else if (_loc5_[1] == "duplicate") {
                this.promptSprite = new PromptSprite(
                    "This level is already one of your favorite levels.",
                    "ok",
                );
            } else if (_loc5_[1] == "invalid_action") {
                this.promptSprite = new PromptSprite(
                    "An invalid action was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc5_[1] == "bad_param") {
                this.promptSprite = new PromptSprite(
                    "A bad parameter was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc5_[1] == "app_error") {
                this.promptSprite = new PromptSprite(
                    "Sorry, there was an application error. It was most likely database related. Please try again in a moment.",
                    "ok",
                );
            } else {
                this.promptSprite = new PromptSprite(
                    "An unknown Error has occurred.",
                    "oh",
                );
            }
        } else if (_loc5_[0] == "success") {
            this.promptSprite = new PromptSprite(
                "Favorites list updated.",
                "ok",
            );
            _loc7_ = int(
                Settings.favoriteLevelIds.indexOf(this.levelDataObject.id),
            );
            if (!this.isFavorite) {
                Tracker.trackEvent(Tracker.LEVEL, Tracker.ADD_FAVORITE);
                if (_loc7_ == -1) {
                    Settings.favoriteLevelIds.push(this.levelDataObject.id);
                }
            } else {
                Tracker.trackEvent(Tracker.LEVEL, Tracker.REMOVE_FAVORITE);
                if (_loc7_ > -1) {
                    Settings.favoriteLevelIds.splice(_loc7_, 1);
                }
            }
            this.editFavoritesButton.disabled = true;
        } else {
            this.promptSprite = new PromptSprite(
                "Error: something dreadful has happened",
                "ok",
            );
        }
        var _loc6_: Window = this.promptSprite.window;
        this._window.parent.addChild(_loc6_);
        _loc6_.center();
    }

    private vote(param1: Event = null) {
        var _loc6_: Window = null;
        if (Settings.user_id <= 0) {
            this.promptSprite = new PromptSprite(
                "You must be logged in to vote.  Login or register for free up there on the right.",
                "ok",
            );
            _loc6_ = this.promptSprite.window;
            this._window.parent.addChild(_loc6_);
            _loc6_.center();
            return;
        }
        if (Settings.disableUpload) {
            this.promptSprite = new PromptSprite(
                Settings.disableMessage,
                "OH FINE",
            );
            _loc6_ = this.promptSprite.window;
            this._window.parent.addChild(_loc6_);
            _loc6_.center();
            return;
        }
        this.statusSprite = new StatusSprite("casting your vote...");
        var _loc2_: Window = this.statusSprite.window;
        this._window.parent.addChild(_loc2_);
        _loc2_.center();
        var _loc3_ = new URLRequest(Settings.siteURL + "set_level.hw");
        _loc3_.method = URLRequestMethod.POST;
        var _loc4_ = new URLVariables();
        _loc4_.level_id = this.levelDataObject.id;
        _loc4_.rating = this.votingStars.rating;
        _loc4_.action = "rate_level";
        _loc3_.data = _loc4_;
        var _loc5_ = new URLLoader();
        _loc5_.addEventListener(Event.COMPLETE, this.voteComplete);
        _loc5_.load(_loc3_);
    }

    private voteComplete(param1: Event) {
        this.statusSprite.die();
        var _loc2_: URLLoader = param1.target as URLLoader;
        _loc2_.removeEventListener(Event.COMPLETE, this.voteComplete);
        trace("VOTE COMPLETE");
        trace(_loc2_.data);
        var _loc3_ = _loc2_.data.toString();
        var _loc4_: string = _loc3_.substr(0, 8);
        var _loc5_: any[] = _loc3_.split(":");
        trace("dataString " + _loc4_);
        if (_loc4_.indexOf("<html>") > -1) {
            this.promptSprite = new PromptSprite(
                "There was an unexpected system Error",
                "oh",
            );
        } else if (_loc5_[0] == "failure") {
            if (_loc5_[1] == "invalid_action") {
                this.promptSprite = new PromptSprite(
                    "An invalid action was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc5_[1] == "duplicate_rating") {
                this.promptSprite = new PromptSprite(
                    "You\'ve already voted on this level.",
                    "ok",
                );
            } else if (_loc5_[1] == "illegal_argument") {
                this.promptSprite = new PromptSprite(
                    "Rating must be between 0 and 5.",
                    "ok",
                );
            } else if (_loc5_[1] == "bad_param") {
                this.promptSprite = new PromptSprite(
                    "A bad parameter was passed (you really shouldn\'t ever be seeing this).",
                    "ok",
                );
            } else if (_loc5_[1] == "app_error") {
                this.promptSprite = new PromptSprite(
                    "Sorry, there was an application error. It was most likely database related. Please try again in a moment.",
                    "ok",
                );
            } else if (_loc5_[1] == "not_logged_in") {
                this.promptSprite = new PromptSprite(
                    "You are not currently logged in.",
                    "alright",
                );
            } else {
                this.promptSprite = new PromptSprite(
                    "An unknown Error has occurred.",
                    "oh",
                );
            }
        } else if (_loc5_[0] == "success") {
            Tracker.trackEvent(
                Tracker.LEVEL,
                Tracker.VOTE,
                "rating_" + this.votingStars.rating,
            );
            this.promptSprite = new PromptSprite(
                "You voted! Good job.",
                "thanks",
            );
        } else {
            this.promptSprite = new PromptSprite(
                "Error: something dreadful has happened",
                "ok",
            );
        }
        var _loc6_: Window = this.promptSprite.window;
        this._window.parent.addChild(_loc6_);
        _loc6_.center();
    }

    public die() {
        this.votingStars.die();
        this.removeEventListener(MouseEvent.MOUSE_OVER, this.rollOverHandler);
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.stage.removeEventListener(
            KeyboardEvent.KEY_UP,
            this.keyDownHandler,
        );
        this.votingStars.removeEventListener(
            VotingStars.RATING_SELECTED,
            this.vote,
        );
        this._window.closeWindow();
    }
}