import Settings from "@/com/totaljerkface/game/Settings";
import UserLevelLoader from "@/com/totaljerkface/game/UserLevelLoader";
import LevelEncryptor from "@/com/totaljerkface/game/utils/LevelEncryptor";
import { boundClass } from 'autobind-decorator';
import ErrorEvent from "flash/events/ErrorEvent";
import Event from "flash/events/Event";
import IOErrorEvent from "flash/events/IOErrorEvent";
import URLLoader from "flash/net/URLLoader";
import URLLoaderDataFormat from "flash/net/URLLoaderDataFormat";
import URLRequest from "flash/net/URLRequest";
import URLRequestMethod from "flash/net/URLRequestMethod";
import URLVariables from "flash/net/URLVariables";
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class RecordLoader extends UserLevelLoader {
    protected replayId: number;
    protected _replayByteArray: ByteArray;

    constructor(param1: number, param2: number, param3: number) {
        super(param2, param3, false);
        this.replayId = param1;
    }

    public override loadData() {
        var _loc3_ = undefined;
        var _loc4_: URLLoader = null;
        var _loc1_ = new URLRequest(Settings.siteURL + "replay.hw");
        _loc1_.method = URLRequestMethod.POST;
        var _loc2_ = new URLVariables();
        _loc2_.replay_id = this.replayId;
        _loc2_.level_id = this.levelId;
        _loc2_.action = "get_cmb_records";
        _loc1_.data = _loc2_;
        trace("LOAD COMBINED RECORD");
        for (_loc3_ in _loc2_) {
            trace("urlVariables." + _loc3_ + " = " + _loc2_[_loc3_]);
        }
        _loc4_ = new URLLoader();
        _loc4_.dataFormat = URLLoaderDataFormat.BINARY;
        _loc4_.addEventListener(Event.COMPLETE, this.loadComplete);
        _loc4_.addEventListener(IOErrorEvent.IO_ERROR, this.IOErrorHandler);
        _loc4_.load(_loc1_);
    }

    protected override loadComplete(param1: Event) {
        var _loc9_: any[] = null;
        var _loc2_: URLLoader = param1.target as URLLoader;
        _loc2_.removeEventListener(Event.COMPLETE, this.loadComplete);
        _loc2_.removeEventListener(IOErrorEvent.IO_ERROR, this.IOErrorHandler);
        var _loc3_ = _loc2_.data.toString();
        var _loc4_: string = _loc3_.substr(0, 8);
        trace("dataString " + _loc4_);
        if (_loc4_.indexOf("<html>") > -1) {
            this._errorString = "system_error";
            this.dispatchEvent(new ErrorEvent(ErrorEvent.ERROR));
            return;
        }
        if (_loc4_.indexOf("failure") > -1) {
            _loc9_ = _loc3_.split(":");
            this._errorString = _loc9_[1];
            this.dispatchEvent(new ErrorEvent(ErrorEvent.ERROR));
            return;
        }
        var _loc5_ = _loc2_.data as ByteArray;
        var _loc6_: number = _loc5_.readInt();
        this._replayByteArray = new ByteArray();
        _loc5_.readBytes(this._replayByteArray, 0, _loc6_);
        var _loc7_ = new ByteArray();
        _loc5_.readBytes(_loc7_, 0, 0);
        LevelEncryptor.decryptByteArray(_loc7_, "eatshit" + this.authorId);
        _loc7_.uncompress();
        var _loc8_ = _loc7_.readUTFBytes(_loc7_.length);
        this._levelXML = new XML(_loc8_);
        this.dispatchEvent(new Event(Event.COMPLETE));
    }

    public get replayByteArray(): ByteArray {
        return this._replayByteArray;
    }
}