import Base64 from "@/com/hurlant/util/Base64";
import ReplayData from "@/com/totaljerkface/game/ReplayData";
import Settings from "@/com/totaljerkface/game/Settings";
import PromptSprite from "@/com/totaljerkface/game/editor/PromptSprite";
import StatusSprite from "@/com/totaljerkface/game/editor/StatusSprite";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import BadWords from "@/com/totaljerkface/game/utils/BadWords";
import PostEncryption from "@/com/totaljerkface/game/utils/PostEncryption";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import URLLoader from "flash/net/URLLoader";
import URLRequest from "flash/net/URLRequest";
import URLRequestMethod from "flash/net/URLRequestMethod";
import URLVariables from "flash/net/URLVariables";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import ByteArray from "flash/utils/ByteArray";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2925")] */
@boundClass
export default class SaveReplayMenu extends Sprite {
    public static SAVE_COMPLETE: string;
    public static GENERIC_ERROR: string = "genericerror";
    public commentsText: TextField;
    public cCharsText: TextField;
    private APPLESAUCE: string = "7ab7657e5595b5c3486988c90728c6ae";
    private maxCommentChars: number = 200;
    private saveButton: GenericButton;
    private _window: Window;
    private loader: URLLoader;
    private _byteArray: ByteArray;
    private _completed: boolean;
    private _levelId: number;
    private _character: number;
    private _length: number;
    private _errorMessage: string;
    private _newReplayID: number;
    private statusSprite: StatusSprite;
    private errorPrompt: PromptSprite;

    constructor(param1: ReplayData, param2: number, param3: number) {
        super();
        this._byteArray = param1.byteArray;
        this._completed = param1.completed;
        this._length = param1.getLength();
        this._levelId = param2;
        this._character = param3;
        this.buildWindow();
        this.saveButton = new GenericButton("save", 16613761, 100);
        this.addChild(this.saveButton);
        this.saveButton.x = 70;
        this.saveButton.y = 153;
        this.saveButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.commentsText.autoSize = TextFieldAutoSize.NONE;
        this.commentsText.selectable = true;
        this.cCharsText.selectable = false;
        this.commentsText.embedFonts = this.cCharsText.embedFonts = true;
        this.commentsText.wordWrap = true;
        this.commentsText.multiline = true;
        this.commentsText.maxChars = this.maxCommentChars;
        this.commentsText.restrict = "a-z A-Z 0-9 !@#$%\\^&*()_+\\-=;\'|?/,.<> \"";
        this.addEventListener(Event.ENTER_FRAME, this.setCharText);
    }

    private setCharText(param1: Event) {
        var _loc2_: number = this.maxCommentChars - this.commentsText.length;
        this.cCharsText.text = _loc2_.toString() + " chars left";
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: Window = null;
        if (BadWords.containsBadWord(this.commentsText.text)) {
            this.errorPrompt = new PromptSprite(
                "Your replay comments contain some risky words. Please remove them. (sorry, I\'ve recently run the risk of losing advertising)",
                "ok",
            );
            _loc2_ = this.errorPrompt.window;
            this.stage.addChild(_loc2_);
            _loc2_.center();
            return;
        }
        trace("no bad words found in comments");
        this.save();
    }

    private createReplayQueryString(
        param1: number,
        param2: number,
        param3: string,
        param4: number,
        param5: number,
        param6: string,
    ): string {
        param6 = escape(param6);
        return (
            "id=" +
            param1 +
            "&pc=" +
            param2 +
            "&ar=" +
            param3 +
            "&ct=" +
            param4 +
            "&vr=" +
            param5 +
            "&uc=" +
            param6 +
            "&ui=" +
            Settings.user_id
        );
    }

    public save() {
        this.statusSprite = new StatusSprite("Saving Replay...");
        var _loc1_: Window = this.statusSprite.window;
        this._window.parent.addChild(_loc1_);
        _loc1_.center();
        var _loc2_: string = this.createReplayQueryString(
            this._levelId,
            this._character,
            Settings.architecture,
            this._completed ? this._length : Settings.maxReplayFrames,
            Settings.CURRENT_VERSION,
            this.commentsText.text,
        );
        var _loc3_ = new PostEncryption(this.APPLESAUCE);
        var _loc4_: string = _loc3_.encrypt(_loc2_);
        var _loc5_: string = _loc3_.getIV();
        var _loc6_ = new ByteArray();
        _loc6_.writeBytes(this._byteArray);
        var _loc7_: string = Base64.encodeByteArray(_loc6_);
        var _loc8_ = Settings.siteURL + "replay.hw";
        var _loc9_ = new URLRequest(_loc8_);
        _loc9_.method = URLRequestMethod.POST;
        var _loc10_ = new URLVariables();
        _loc10_.action = "create";
        _loc10_.rr = _loc7_;
        _loc10_.em = _loc4_;
        _loc10_.ei = _loc5_;
        _loc9_.data = _loc10_;
        this.loader = new URLLoader();
        this.loader.addEventListener(Event.COMPLETE, this.replaySaved);
        this.loader.load(_loc9_);
    }

    private replaySaved(param1: Event) {
        trace("replay saved");
        this.statusSprite.die();
        this.loader.removeEventListener(Event.COMPLETE, this.replaySaved);
        var _loc2_ = this.loader.data.toString();
        var _loc3_: string = _loc2_.substr(0, 8);
        var _loc4_: any[] = _loc2_.split(":");
        trace("dataString " + _loc2_);
        if (_loc3_.indexOf("<html>") > -1) {
            this._errorMessage = "There was an unexpected system Error";
            this.dispatchEvent(new Event(SaveReplayMenu.GENERIC_ERROR));
        } else if (_loc4_[0] == "failure") {
            if (_loc4_[1] == "invalid_action") {
                this._errorMessage = "An invalid action was passed (you really shouldn\'t ever be seeing this).";
            } else if (_loc4_[1] == "time_lockout") {
                this._errorMessage = "You saved a replay too recently. Please wait a moment and try again.";
            } else if (_loc4_[1] == "hi_comp_time") {
                this._errorMessage = "Your replay is too long.";
            } else if (_loc4_[1] == "bad_param") {
                this._errorMessage = "A bad parameter was passed (you really shouldn\'t ever be seeing this).";
            } else if (_loc4_[1] == "app_error") {
                this._errorMessage = "Sorry, there was an application error. It was most likely database related. Please try again in a moment.";
            } else if (_loc4_[1] == "not_logged_in") {
                this._errorMessage = "You are not currently logged in.";
            } else {
                this._errorMessage = "An unknown Error has occurred.";
            }
            this.dispatchEvent(new Event(SaveReplayMenu.GENERIC_ERROR));
        } else if (_loc4_[0] == "success") {
            this._newReplayID = int(_loc4_[1]);
            this.dispatchEvent(new Event(SaveReplayMenu.SAVE_COMPLETE));
        } else {
            this._errorMessage = "Error: something dreadful has happened";
            this.dispatchEvent(new Event(SaveReplayMenu.GENERIC_ERROR));
        }
    }

    private buildWindow() {
        this._window = new Window(true, this, true);
        this._window.addEventListener(Window.WINDOW_CLOSED, this.windowClosed);
    }

    public get window(): Window {
        return this._window;
    }

    private windowClosed(param1: Event) {
        this.dispatchEvent(param1.clone());
    }

    public get errorMessage(): string {
        return this._errorMessage;
    }

    public get newReplayID(): number {
        return this._newReplayID;
    }

    public die() {
        this._window.removeEventListener(
            Window.WINDOW_CLOSED,
            this.windowClosed,
        );
        this._window.closeWindow();
        this.removeEventListener(Event.ENTER_FRAME, this.setCharText);
        this.saveButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
    }
}