import ReplayDataObject from "@/com/totaljerkface/game/menus/ReplayDataObject";
import VoteStars from "@/com/totaljerkface/game/menus/VoteStars";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import TextUtils from "@/com/totaljerkface/game/utils/TextUtils";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import URLRequest from "flash/net/URLRequest";
import TextField from "flash/text/TextField";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2952")] */
@boundClass
export default class ReplayListItem extends Sprite {
    public static BG_HEIGHT: number;
    public static FADE_VALUE: number = 0.5;
    public bg: MovieClip;
    public userText: TextField;
    public timeText: TextField;
    public viewsText: TextField;
    public createdText: TextField;
    public characterFaces: MovieClip;
    public voteStars: VoteStars;
    public userBtn: Sprite;
    public accurateMc: MovieClip;
    private _selected: boolean;
    private _faded: boolean;
    private _accurate: boolean;
    private _hidden: boolean;
    private _replayDataObject: ReplayDataObject;

    constructor(param1: ReplayDataObject) {
        super();
        this._replayDataObject = param1;
        this.buttonMode = true;
        this.bg.mouseEnabled =
            this.timeText.mouseEnabled =
            this.userText.mouseEnabled =
            this.viewsText.mouseEnabled =
            this.createdText.mouseEnabled =
            this.accurateMc.mouseEnabled =
            false;
        this.voteStars.mouseEnabled = false;
        this.timeText.embedFonts =
            this.userText.embedFonts =
            this.viewsText.embedFonts =
            this.createdText.embedFonts =
            true;
        this.timeText.selectable =
            this.userText.selectable =
            this.viewsText.selectable =
            this.createdText.selectable =
            false;
        this.userText.text = this._replayDataObject.user_name;
        this.timeText.text =
            this._replayDataObject.timeFrames < Settings.maxReplayFrames
                ? "" +
                TextUtils.setToHundredths(
                    this._replayDataObject.timeSeconds,
                ) +
                " seconds"
                : "---";
        this.viewsText.text = TextUtils.addIntegerCommas(
            this._replayDataObject.views,
        );
        this.createdText.text = TextUtils.shortenDate(
            this._replayDataObject.created,
        );
        this.voteStars.rating = this._replayDataObject.average_rating;
        this.characterFaces.gotoAndStop(this._replayDataObject.character);
        if (this._replayDataObject.character == 0) {
            this.characterFaces.gotoAndStop(Settings.totalCharacters + 1);
        }
        if (this._replayDataObject.architecture == Settings.architecture) {
            this.accurateMc.gotoAndStop(1);
            this._accurate = true;
        } else {
            this.accurateMc.gotoAndStop(2);
        }
        this.userBtn.width = this.userText.textWidth + 5;
        this.userBtn.visible = false;
        this.userBtn.addEventListener(
            MouseEvent.MOUSE_UP,
            this.userPress,
            false,
            0,
            true,
        );
        this.rollOut();
    }

    private userPress(param1: MouseEvent) {
        var _loc2_ = new URLRequest(
            "http://www.totaljerkface.com/profile.tjf?uid=" +
            this._replayDataObject.user_id,
        );
        navigateToURL(_loc2_, "_blank");
        Tracker.trackEvent(
            Tracker.REPLAY_BROWSER,
            Tracker.GOTO_USER_PAGE,
            "userID_" + this._replayDataObject.user_id,
        );
    }

    public rollOver() {
        this.bg.gotoAndStop(2);
        this.textColor = 4032711;
    }

    public rollOut() {
        if (this._selected) {
            this.rollOver();
            return;
        }
        this.bg.gotoAndStop(1);
        this.textColor = 8947848;
    }

    public mouseDown() {
        if (this._selected) {
            return;
        }
        this.bg.gotoAndStop(3);
        this.textColor = 16777215;
    }

    private set textColor(param1: number) {
        this.timeText.textColor =
            this.userText.textColor =
            this.viewsText.textColor =
            this.createdText.textColor =
            param1;
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(param1: boolean) {
        this._selected = param1;
        if (this._selected) {
            this.userText.htmlText = "<u>" + this.userText.text + "</u>";
            this.rollOver();
            this.userBtn.visible = true;
            this.bg.alpha = 1;
            SoundController.instance.playSoundItem("MenuSelect2");
        } else {
            this.userText.htmlText = this.userText.text;
            this.rollOut();
            if (this._faded) {
                this.bg.alpha = ReplayListItem.FADE_VALUE;
            }
            this.userBtn.visible = false;
        }
    }

    public get faded(): boolean {
        return this._faded;
    }

    public set faded(param1: boolean) {
        this._faded = param1;
        if (this._faded && !this._selected) {
            this.bg.alpha = ReplayListItem.FADE_VALUE;
        } else {
            this.bg.alpha = 1;
        }
    }

    public get hidden(): boolean {
        return this._hidden;
    }

    public set hidden(param1: boolean) {
        this.visible = !param1;
        this._hidden = param1;
    }

    public get accurate(): boolean {
        return this._accurate;
    }

    // @ts-expect-error
    public override get height(): number {
        if (this._hidden) {
            return 0;
        }
        return ReplayListItem.BG_HEIGHT;
    }

    public get replayDataObject(): ReplayDataObject {
        return this._replayDataObject;
    }
}