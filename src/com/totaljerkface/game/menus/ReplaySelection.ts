import Settings from "@/com/totaljerkface/game/Settings";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import LibraryButton from "@/com/totaljerkface/game/editor/ui/LibraryButton";
import BrowserEvent from "@/com/totaljerkface/game/events/BrowserEvent";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import ReplayDataObject from "@/com/totaljerkface/game/menus/ReplayDataObject";
import TextUtils from "@/com/totaljerkface/game/utils/TextUtils";
import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2971")] */
@boundClass
export default class ReplaySelection extends Sprite {
    private static flaggedReplays: any[];
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
    private flagButton: GenericButton;
    private _replayDataObject: ReplayDataObject;
    public fullHeight: number = 110;

    constructor(param1: ReplayDataObject) {
        super();
        this._replayDataObject = param1;
        this.shadow.mouseEnabled = false;
        this.descriptionText.autoSize = TextFieldAutoSize.LEFT;
        this.descriptionText.wordWrap = true;
        this.descriptionText.text = this._replayDataObject.comments;
        this.characterText.text =
            Settings.characterNames[this._replayDataObject.character - 1];
        this.avgRatingText.text = "" +
            TextUtils.setToHundredths(this._replayDataObject.average_rating) +
            " / 5.00 (" +
            this._replayDataObject.votes +
            " votes)";
        this.wtdRatingText.text = "" +
            TextUtils.setToHundredths(this._replayDataObject.weighted_rating) +
            " / 5.00 (" +
            this._replayDataObject.votes +
            " votes)";
        this.linkText.text = "http://www.totaljerkface.com/happy_wheels.tjf?replay_id=" +
            this._replayDataObject.id;
        this.flagButton = new GenericButton(
            "flag as inappropriate",
            13421772,
            188,
            6312772,
        );
        this.flagButton.x = 535;
        this.flagButton.y = 77;
        if (ReplaySelection.flaggedReplays.indexOf(param1.id) > -1) {
            this.flagButton.disabled = true;
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
        switch (param1.target) {
            case this.playButton:
                Tracker.trackEvent(
                    Tracker.REPLAY_BROWSER,
                    Tracker.LOAD_REPLAY,
                    "replayID_" + this._replayDataObject.id,
                );
                this.dispatchEvent(
                    new NavigationEvent(
                        NavigationEvent.SESSION,
                        null,
                        this._replayDataObject,
                    ),
                );
                break;
            case this.flagButton:
                this.dispatchEvent(
                    new BrowserEvent(
                        BrowserEvent.FLAG,
                        this._replayDataObject.id,
                    ),
                );
                ReplaySelection.flaggedReplays.push(this._replayDataObject.id);
                this.flagButton.disabled = true;
        }
    }

    public get replayDataObject(): ReplayDataObject {
        return this._replayDataObject;
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
    }
}