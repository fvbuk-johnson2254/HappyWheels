import Settings from "@/com/totaljerkface/game/Settings";
import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import LibraryButton from "@/com/totaljerkface/game/editor/ui/LibraryButton";
import BrowserEvent from "@/com/totaljerkface/game/events/BrowserEvent";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import TextUtils from "@/com/totaljerkface/game/utils/TextUtils";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";

/* [Embed(source="/_assets/assets.swf", symbol="symbol3012")] */
@boundClass
export default class LevelSelection extends Sprite {
    private static flaggedLevels: any[];
    public bg: Sprite;
    public shadow: Sprite;
    public maskSprite: Sprite;
    public descriptionText: TextField;
    public characterText: TextField;
    public commentsText: TextField;
    public avgRatingText: TextField;
    public wtdRatingText: TextField;
    public linkText: TextField;
    public playButton: LibraryButton;
    private comments: Sprite;
    private viewReplaysButton: GenericButton;
    private authorLevelsButton: GenericButton;
    private flagButton: GenericButton;
    private importButton: GenericButton;
    private favoriteButton: GenericButton;
    private _levelDataObject: LevelDataObject;
    public fullHeight: number = 154;

    constructor(param1: LevelDataObject) {
        super();
        this._levelDataObject = param1;
        this.shadow.mouseEnabled = false;
        this.descriptionText.autoSize = TextFieldAutoSize.LEFT;
        this.descriptionText.wordWrap = true;
        this.descriptionText.text = this._levelDataObject.comments;
        if (this._levelDataObject.forceChar) {
            this.characterText.text =
                Settings.characterNames[this._levelDataObject.character - 1];
        } else {
            this.characterText.text = "all";
        }
        this.avgRatingText.text = "" +
            TextUtils.setToHundredths(this._levelDataObject.average_rating) +
            " / 5.00 (" +
            this._levelDataObject.votes +
            " votes)";
        this.wtdRatingText.text = "" +
            TextUtils.setToHundredths(this._levelDataObject.weighted_rating) +
            " / 5.00 (" +
            this._levelDataObject.votes +
            " votes)";
        this.linkText.text = "http://www.totaljerkface.com/happy_wheels.tjf?level_id=" +
            this._levelDataObject.id;
        this.viewReplaysButton = new GenericButton(
            "view replays/records",
            16613761,
            166,
        );
        this.addChild(this.viewReplaysButton);
        this.viewReplaysButton.x = 548;
        this.viewReplaysButton.y = 57;
        this.authorLevelsButton = new GenericButton(
            "view levels by this author",
            16613761,
            166,
        );
        this.addChild(this.authorLevelsButton);
        this.authorLevelsButton.x = 548;
        this.authorLevelsButton.y = 89;
        this.flagButton = new GenericButton(
            "flag as inappropriate",
            13421772,
            166,
            6312772,
        );
        this.addChild(this.flagButton);
        this.flagButton.x = 548;
        this.flagButton.y = 121;
        this.flagButton.disabled = true;
        var _loc2_: boolean =
            Settings.favoriteLevelIds.indexOf(param1.id) > -1 ? true : false;
        var _loc3_: string = _loc2_ ? "remove favorite" : "add to favorites";
        this.favoriteButton = new GenericButton(_loc3_, 16776805, 120, 6312772);
        this.addChild(this.favoriteButton);
        this.favoriteButton.x = 258;
        this.favoriteButton.y = 89;
        this.importButton = new GenericButton(
            "<< open in editor",
            13421772,
            120,
            6312772,
        );
        this.importButton.x = 258;
        this.importButton.y = 57;
        if (!this._levelDataObject.importable) {
            this.importButton.visible = false;
        } else {
            this.importButton.addEventListener(
                MouseEvent.ROLL_OVER,
                this.importButtonRoll,
            );
        }
        this.comments = new Sprite();
        this.addChild(this.comments);
        this.comments.addChild(this.descriptionText);
        this.comments.addChild(this.commentsText);
        this.comments.graphics.beginFill(15724527, 1);
        this.comments.graphics.drawRect(0, 0, 250, this.comments.height);
        this.comments.graphics.endFill();
        if (this.comments.height > this.fullHeight) {
            this.addEventListener(Event.ENTER_FRAME, this.scroll);
        }
        this.addChild(this.shadow);
        this.maskSprite = new Sprite();
        this.addChild(this.maskSprite);
        this.maskSprite.graphics.beginFill(16711680);
        this.maskSprite.graphics.drawRect(
            0,
            0,
            this.shadow.width,
            this.shadow.height,
        );
        this.maskSprite.graphics.endFill();
        this.mask = this.maskSprite;
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }

    private scroll(param1: Event) {
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        if (
            this.mouseX > 0 &&
            this.mouseX < 250 &&
            this.mouseY > 0 &&
            this.mouseY < this.fullHeight
        ) {
            _loc2_ = this.fullHeight / 2;
            _loc3_ = _loc2_ - this.mouseY;
            _loc4_ = _loc3_ / _loc2_;
            _loc5_ = _loc4_ * 10;
            this.comments.y += _loc5_;
            if (this.comments.y + this.comments.height < this.fullHeight) {
                this.comments.y = this.fullHeight - this.comments.height;
            }
            if (this.comments.y > 0) {
                this.comments.y = 0;
            }
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: string = null;
        switch (param1.target) {
            case this.playButton:
                Tracker.trackEvent(
                    Tracker.LEVEL_BROWSER,
                    Tracker.LOAD_LEVEL,
                    "levelID_" + this._levelDataObject.id,
                );
                this.dispatchEvent(
                    new NavigationEvent(
                        NavigationEvent.SESSION,
                        this._levelDataObject,
                    ),
                );
                break;
            case this.authorLevelsButton:
                Tracker.trackEvent(
                    Tracker.LEVEL_BROWSER,
                    Tracker.GET_LEVELS_BY_AUTHOR,
                    "authorID_" + this._levelDataObject.author_id,
                );
                this.dispatchEvent(
                    new BrowserEvent(BrowserEvent.USER, this._levelDataObject),
                );
                break;
            case this.viewReplaysButton:
                Tracker.trackEvent(
                    Tracker.LEVEL_BROWSER,
                    Tracker.GOTO_REPLAY_BROWSER,
                    "levelID_" + this._levelDataObject.id,
                );
                this.dispatchEvent(
                    new NavigationEvent(
                        NavigationEvent.REPLAY_BROWSER,
                        this._levelDataObject,
                    ),
                );
                break;
            case this.importButton:
                break;
            case this.flagButton:
                this.dispatchEvent(
                    new BrowserEvent(
                        BrowserEvent.FLAG,
                        this._levelDataObject.id,
                    ),
                );
                LevelSelection.flaggedLevels.push(this._levelDataObject.id);
                this.flagButton.disabled = true;
                break;
            case this.favoriteButton:
                if (
                    Settings.favoriteLevelIds.indexOf(
                        this._levelDataObject.id,
                    ) > -1
                ) {
                    _loc2_ = BrowserEvent.REMOVE_FROM_FAVORITES;
                    Tracker.trackEvent(
                        Tracker.LEVEL_BROWSER,
                        Tracker.REMOVE_FAVORITE,
                    );
                } else {
                    _loc2_ = BrowserEvent.ADD_TO_FAVORITES;
                    Tracker.trackEvent(
                        Tracker.LEVEL_BROWSER,
                        Tracker.ADD_FAVORITE,
                    );
                }
                this.dispatchEvent(
                    new BrowserEvent(_loc2_, this._levelDataObject.id),
                );
                this.favoriteButton.disabled = true;
        }
    }

    private importButtonRoll(param1: MouseEvent) {
        MouseHelper.instance.show(
            "Importing has been abused, so I\'m disabling it for a while to see if things get better.",
            this.importButton,
        );
    }

    public get levelDataObject(): LevelDataObject {
        return this._levelDataObject;
    }

    public get maskHeight(): number {
        return this.maskSprite.height;
    }

    public set maskHeight(param1: number) {
        this.shadow.height = this.maskSprite.height = param1;
    }

    public die() {
        this.removeEventListener(Event.ENTER_FRAME, this.scroll);
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.importButton.removeEventListener(
            MouseEvent.ROLL_OVER,
            this.importButtonRoll,
        );
    }
}