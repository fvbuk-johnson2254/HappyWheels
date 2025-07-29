import StatusSprite from "@/com/totaljerkface/game/editor/StatusSprite";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import IOErrorEvent from "flash/events/IOErrorEvent";
import SecurityErrorEvent from "flash/events/SecurityErrorEvent";
import URLLoader from "flash/net/URLLoader";
import URLRequest from "flash/net/URLRequest";
import URLRequestMethod from "flash/net/URLRequestMethod";
import URLVariables from "flash/net/URLVariables";

@boundClass
export default class LevelLoader extends Sprite {
    public static ID_NOT_FOUND: string;
    public static LEVEL_LOADED: string = "levelloaded";
    public static LOAD_ERROR: string = "error";
    private _errorString: string;
    private statusSprite: StatusSprite;
    private loader: URLLoader;
    private _levelDataObject: LevelDataObject;

    public load(param1: number) {
        var _loc2_ = new URLRequest(Settings.siteURL + "get_level.hw");
        _loc2_.method = URLRequestMethod.POST;
        var _loc3_ = new URLVariables();
        _loc3_.level_id = param1;
        _loc3_.action = "get_level";
        _loc2_.data = _loc3_;
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
        this.loader.load(_loc2_);
    }

    private levelDataLoaded(param1: Event) {
        var _loc5_: any[] = null;
        var _loc6_: XML = null;
        trace("LOAD COMPLETE");
        this.removeLoaderListeners();
        trace(this.loader.data);
        var _loc2_ = this.loader.data.toString();
        var _loc3_: string = _loc2_.substr(0, 8);
        trace("dataString " + _loc3_);
        if (_loc3_.indexOf("<html>") > -1) {
            this._errorString = "system_error";
            this.dispatchEvent(new Event(LevelLoader.LOAD_ERROR));
            return;
        }
        if (_loc3_.indexOf("failure") > -1) {
            _loc5_ = _loc2_.split(":");
            this._errorString = _loc5_[1];
            this.dispatchEvent(new Event(LevelLoader.LOAD_ERROR));
            return;
        }
        var _loc4_ = new XML(this.loader.data.toString());
        if (_loc4_.lv.length() > 0) {
            _loc6_ = _loc4_.lv[0];
            this._levelDataObject = new LevelDataObject(
                _loc6_["id"],
                _loc6_["ln"],
                _loc6_["ui"],
                _loc6_["un"],
                _loc6_["rg"],
                _loc6_["vs"],
                _loc6_["ps"],
                _loc6_["dp"],
                _loc6_.uc,
                _loc6_["pc"],
                "1",
                "1",
                "1",
                _loc6_["dp"],
            );
            this.dispatchEvent(new Event(LevelLoader.LEVEL_LOADED));
        } else {
            this.dispatchEvent(new Event(LevelLoader.ID_NOT_FOUND));
        }
    }

    private removeLoaderListeners() {
        this.loader.removeEventListener(Event.COMPLETE, this.levelDataLoaded);
        this.loader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.loader.removeEventListener(
            SecurityErrorEvent.SECURITY_ERROR,
            this.securityErrorHandler,
        );
    }

    private IOErrorHandler(param1: IOErrorEvent) {
        trace(param1.text);
        this.removeLoaderListeners();
        this._errorString = "io_error";
        this.dispatchEvent(new Event(LevelLoader.LOAD_ERROR));
    }

    private securityErrorHandler(param1: SecurityErrorEvent) {
        trace(param1.text);
        this.removeLoaderListeners();
        this._errorString = "security_error";
        this.dispatchEvent(new Event(LevelLoader.LOAD_ERROR));
    }

    public get levelDataObject(): LevelDataObject {
        return this._levelDataObject;
    }

    public get errorString(): string {
        return this._errorString;
    }

    public die() {
        this.removeLoaderListeners();
    }
}