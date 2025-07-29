import Settings from "@/com/totaljerkface/game/Settings";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import StatusSprite from "@/com/totaljerkface/game/editor/StatusSprite";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import ReplayDataObject from "@/com/totaljerkface/game/menus/ReplayDataObject";
import VotingStars from "@/com/totaljerkface/game/menus/VotingStars";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import URLLoader from "flash/net/URLLoader";
import URLRequest from "flash/net/URLRequest";
import URLRequestMethod from "flash/net/URLRequestMethod";
import URLVariables from "flash/net/URLVariables";
import TextField from "flash/text/TextField";

/* [Embed(source="/_assets/assets.swf", symbol="symbol92")] */
@boundClass
export default class SessionReplayMenu extends Sprite {
    public static RESTART_REPLAY: string;
    public static CHOOSE_CHARACTER: string = "choosecharacter";
    public static PLAY_LEVEL: string = "playlevel";
    public static EXIT: string = "exit";
    public static CANCEL: string = "cancel";
    public userText: TextField;
    private _window: Window;
    private replayDataObject: ReplayDataObject;
    private votingStars: VotingStars;
    private restartButton: GenericButton;
    private playButton: GenericButton;
    private exitButton: GenericButton;
    private cancelButton: GenericButton;
    private statusSprite: StatusSprite;
    private promptSprite: PromptSprite;

    constructor(param1: ReplayDataObject) {
        super();
        this.replayDataObject = param1;
        this.init();
    }

    private init() {
        this.buildWindow();
        this.userText.text = this.replayDataObject.user_name;
        this.votingStars = new VotingStars(
            this.replayDataObject.average_rating,
        );
        this.votingStars.x = 45;
        this.votingStars.y = 65;
        var _loc1_: number = 120;
        var _loc2_: number = (240 - _loc1_) / 2;
        this.restartButton = new GenericButton(
            "view replay again",
            4032711,
            _loc1_,
        );
        this.restartButton.x = _loc2_;
        this.restartButton.y = 107;
        this.addChild(this.restartButton);
        this.playButton = new GenericButton("play this level", 4032711, _loc1_);
        this.playButton.x = _loc2_;
        this.playButton.y = 137;
        this.addChild(this.playButton);
        this.exitButton = new GenericButton("exit to menu", 16613761, _loc1_);
        this.exitButton.x = _loc2_;
        this.exitButton.y = 177;
        this.addChild(this.exitButton);
        this.cancelButton = new GenericButton("resume", 16613761, _loc1_);
        this.cancelButton.x = _loc2_;
        this.cancelButton.y = 207;
        this.addChild(this.cancelButton);
        this.addChild(this.votingStars);
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.votingStars.addEventListener(
            VotingStars.RATING_SELECTED,
            this.ratingSelected,
        );
    }

    private ratingSelected(param1: Event) {
        if (this.votingStars.rating > -1) {
            this.vote();
        }
    }

    private buildWindow() {
        this._window = new Window(false, this, false);
    }

    public get window(): Window {
        return this._window;
    }

    private mouseUpHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.restartButton:
                this.dispatchEvent(new Event(SessionReplayMenu.RESTART_REPLAY));
                break;
            case this.playButton:
                if (this.replayDataObject.version != Settings.CURRENT_VERSION) {
                    this.dispatchEvent(
                        new Event(SessionReplayMenu.CHOOSE_CHARACTER),
                    );
                } else {
                    this.dispatchEvent(new Event(SessionReplayMenu.PLAY_LEVEL));
                }
                break;
            case this.exitButton:
                this.dispatchEvent(new Event(SessionReplayMenu.EXIT));
                break;
            case this.cancelButton:
                this.dispatchEvent(new Event(SessionReplayMenu.CANCEL));
        }
    }

    private vote() {
        var _loc5_: Window = null;
        if (Settings.user_id <= 0) {
            this.promptSprite = new PromptSprite(
                "You must be logged in to vote.  Login or register for free up there on the right.",
                "ok",
            );
            _loc5_ = this.promptSprite.window;
            this._window.parent.addChild(_loc5_);
            _loc5_.center();
            return;
        }
        if (Settings.disableUpload) {
            this.promptSprite = new PromptSprite(
                Settings.disableMessage,
                "OH FINE",
            );
            _loc5_ = this.promptSprite.window;
            this._window.parent.addChild(_loc5_);
            _loc5_.center();
            return;
        }
        if (this.replayDataObject.architecture != Settings.architecture) {
            this.promptSprite = new PromptSprite(
                "You may only vote on replays you can see 100% accurately.",
                "ok",
            );
            _loc5_ = this.promptSprite.window;
            this._window.parent.addChild(_loc5_);
            _loc5_.center();
            return;
        }
        this.statusSprite = new StatusSprite("casting your vote...");
        var _loc1_: Window = this.statusSprite.window;
        this._window.parent.addChild(_loc1_);
        _loc1_.center();
        var _loc2_ = new URLRequest(Settings.siteURL + "replay.hw");
        _loc2_.method = URLRequestMethod.POST;
        var _loc3_ = new URLVariables();
        _loc3_.replay_id = this.replayDataObject.id;
        _loc3_.rating = this.votingStars.rating;
        _loc3_.action = "rate_replay";
        _loc2_.data = _loc3_;
        var _loc4_ = new URLLoader();
        _loc4_.addEventListener(Event.COMPLETE, this.voteComplete);
        _loc4_.load(_loc2_);
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
                Tracker.REPLAY,
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
        this._window.closeWindow();
        this.votingStars.die();
        this.votingStars.removeEventListener(
            VotingStars.RATING_SELECTED,
            this.ratingSelected,
        );
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }
}