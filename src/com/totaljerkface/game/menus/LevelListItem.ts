import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
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

/* [Embed(source="/_assets/assets.swf", symbol="symbol3019")] */
@boundClass
export default class LevelListItem extends Sprite {
    public static BG_HEIGHT: number;
    public static FADE_VALUE: number = 0.5;
    public bg: MovieClip;
    public titleText: TextField;
    public authorText: TextField;
    public playsText: TextField;
    public createdText: TextField;
    public characterFaces: MovieClip;
    public voteStars: VoteStars;
    public authorBtn: Sprite;
    private _selected: boolean;
    private _faded: boolean;
    private _levelDataObject: LevelDataObject;

    constructor(param1: LevelDataObject) {
        super();
        this._levelDataObject = param1;
        this.buttonMode = true;
        this.bg.mouseEnabled =
            this.titleText.mouseEnabled =
            this.authorText.mouseEnabled =
            this.playsText.mouseEnabled =
            this.createdText.mouseEnabled =
            this.voteStars.mouseEnabled =
            false;
        this.titleText.embedFonts =
            this.authorText.embedFonts =
            this.playsText.embedFonts =
            this.createdText.embedFonts =
            true;
        this.titleText.selectable =
            this.authorText.selectable =
            this.playsText.selectable =
            this.createdText.selectable =
            false;
        this.titleText.text = this._levelDataObject.name;
        this.authorText.text = this._levelDataObject.author_name;
        this.playsText.text = TextUtils.addIntegerCommas(
            this._levelDataObject.plays,
        );
        this.createdText.text = TextUtils.shortenDate(
            this._levelDataObject.created,
        );
        this.voteStars.rating = this._levelDataObject.average_rating;
        this.characterFaces.gotoAndStop(this._levelDataObject.character);
        if (this._levelDataObject.character == 0) {
            this.characterFaces.gotoAndStop(Settings.totalCharacters + 1);
        }
        this.authorBtn.width = this.authorText.textWidth + 5;
        this.authorBtn.visible = false;
        this.authorBtn.addEventListener(
            MouseEvent.MOUSE_UP,
            this.authorPress,
            false,
            0,
            true,
        );
        this.rollOut();
    }

    private authorPress(param1: MouseEvent) {
        var _loc2_ = new URLRequest(
            "http://www.totaljerkface.com/profile.tjf?uid=" +
            this._levelDataObject.author_id,
        );
        navigateToURL(_loc2_, "_blank");
        Tracker.trackEvent(
            Tracker.LEVEL_BROWSER,
            Tracker.GOTO_USER_PAGE,
            "userID_" + this._levelDataObject.author_id,
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
        this.titleText.textColor =
            this.authorText.textColor =
            this.playsText.textColor =
            this.createdText.textColor =
            param1;
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(param1: boolean) {
        this._selected = param1;
        if (this._selected) {
            this.authorText.htmlText = "<u>" + this.authorText.text + "</u>";
            this.rollOver();
            this.authorBtn.visible = true;
            this.bg.alpha = 1;
            SoundController.instance.playSoundItem("MenuSelect2");
        } else {
            this.authorText.htmlText = this.authorText.text;
            this.rollOut();
            if (this._faded) {
                this.bg.alpha = LevelListItem.FADE_VALUE;
            }
            this.authorBtn.visible = false;
        }
    }

    public get faded(): boolean {
        return this._faded;
    }

    public set faded(param1: boolean) {
        this._faded = param1;
        if (this._faded && !this._selected) {
            this.bg.alpha = LevelListItem.FADE_VALUE;
        } else {
            this.bg.alpha = 1;
        }
    }

    public get levelDataObject(): LevelDataObject {
        return this._levelDataObject;
    }
}