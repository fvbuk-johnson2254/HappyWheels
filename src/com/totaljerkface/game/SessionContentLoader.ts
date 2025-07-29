import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import RecordLoader from "@/com/totaljerkface/game/RecordLoader";
import ReplayData from "@/com/totaljerkface/game/ReplayData";
import Settings from "@/com/totaljerkface/game/Settings";
import SwfLoader from "@/com/totaljerkface/game/SwfLoader";
import UserLevelLoader from "@/com/totaljerkface/game/UserLevelLoader";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import ErrorEvent from "flash/events/ErrorEvent";
import Event from "flash/events/Event";
import EventDispatcher from "flash/events/EventDispatcher";
import IOErrorEvent from "flash/events/IOErrorEvent";

@boundClass
export default class SessionContentLoader extends EventDispatcher {
    private userLevelLoader: UserLevelLoader;
    private characterLoader: SwfLoader;
    private levelLoader: SwfLoader;
    private _replayData: ReplayData;
    private _levelData: Sprite;
    private _levelVersion: number;
    private _characterData: Sprite;
    private _errorString: string;
    private levelDataObject: LevelDataObject;
    private replayId: number;
    private characterIndex: number;
    private incrementPlays: boolean;

    constructor(
        param1: LevelDataObject,
        param2: number,
        param3: number = -1,
        param4: boolean = false,
    ) {
        super();
        this.levelDataObject = param1;
        this.replayId = param3;
        this.characterIndex = param2;
        this.incrementPlays = param4;
    }

    public load() {
        this.loadData();
    }

    private loadData() {
        if (this.replayId > 0) {
            this.userLevelLoader = new RecordLoader(
                this.replayId,
                this.levelDataObject.id,
                this.levelDataObject.author_id,
            );
        } else {
            trace(
                "loading level " +
                this.levelDataObject.id +
                " playcount = " +
                this.incrementPlays,
            );
            this.userLevelLoader = new UserLevelLoader(
                this.levelDataObject.id,
                this.levelDataObject.author_id,
                this.incrementPlays,
            );
        }
        this.userLevelLoader.addEventListener(Event.COMPLETE, this.dataLoaded);
        this.userLevelLoader.addEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.userLevelLoader.addEventListener(
            ErrorEvent.ERROR,
            this.loadErrorHandler,
        );
        this.userLevelLoader.loadData();
    }

    private dataLoaded(param1: Event) {
        var _loc2_: RecordLoader = null;
        var _loc3_: string = null;
        var _loc4_ = null;
        this.userLevelLoader.removeEventListener(
            Event.COMPLETE,
            this.dataLoaded,
        );
        this.userLevelLoader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.userLevelLoader.removeEventListener(
            ErrorEvent.ERROR,
            this.loadErrorHandler,
        );
        if (this.userLevelLoader instanceof RecordLoader) {
            _loc2_ = this.userLevelLoader as RecordLoader;
            this._replayData = new ReplayData();
            this._replayData.byteArray = _loc2_.replayByteArray;
        }
        if (this.levelDataObject.id != 1) {
            this._levelData = this.userLevelLoader.buildLevelSourceObject();
            this._levelVersion = this.userLevelLoader.levelVersion;
            this.loadCharacter();
        } else {
            Settings.hideVehicle = false;
            _loc3_ = Settings.useCompressedTextures ? "_cmp" : "";
            _loc4_ =
                Settings.pathPrefix +
                Settings.levelPath +
                "level" +
                this.levelDataObject.id +
                _loc3_ +
                ".swf";
            this.levelLoader = new SwfLoader(_loc4_);
            this.levelLoader.addEventListener(Event.COMPLETE, this.levelLoaded);
            this.levelLoader.loadSWF();
        }
    }

    private IOErrorHandler(param1: Event) {
        trace("user level IO error");
        this.userLevelLoader.removeEventListener(
            Event.COMPLETE,
            this.dataLoaded,
        );
        this.userLevelLoader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.userLevelLoader.removeEventListener(
            ErrorEvent.ERROR,
            this.loadErrorHandler,
        );
        this.dispatchEvent(new Event(IOErrorEvent.IO_ERROR));
    }

    private loadErrorHandler(param1: Event) {
        trace("user level load error");
        this.userLevelLoader.removeEventListener(
            Event.COMPLETE,
            this.dataLoaded,
        );
        this.userLevelLoader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.userLevelLoader.removeEventListener(
            ErrorEvent.ERROR,
            this.loadErrorHandler,
        );
        this._errorString = this.userLevelLoader.errorString;
        this.dispatchEvent(new Event(ErrorEvent.ERROR));
    }

    private levelLoaded(param1: Event) {
        this.levelLoader.removeEventListener(Event.COMPLETE, this.levelLoaded);
        this.levelLoader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this._levelData = this.levelLoader.swfContent["levelData"];
        this.levelLoader.unLoadSwf();
        this.loadCharacter();
    }

    private loadCharacter() {
        trace("char index " + this.characterIndex);
        var _loc1_ =
            Settings.pathPrefix +
            Settings.characterPath +
            "character" +
            this.characterIndex +
            ".swf";
        this.characterLoader = new SwfLoader(_loc1_);
        this.characterLoader.addEventListener(
            Event.COMPLETE,
            this.characterLoaded,
        );
        this.characterLoader.addEventListener(
            IOErrorEvent.IO_ERROR,
            this.SWFIOErrorHandler,
        );
        this.characterLoader.loadSWF();
    }

    private SWFIOErrorHandler(param1: Event) {
        this.characterLoader.removeEventListener(
            Event.COMPLETE,
            this.characterLoaded,
        );
        this.characterLoader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.SWFIOErrorHandler,
        );
        this.dispatchEvent(new Event(IOErrorEvent.IO_ERROR));
    }

    private characterLoaded(param1: Event) {
        this.characterLoader.removeEventListener(
            Event.COMPLETE,
            this.characterLoaded,
        );
        this._characterData = this.characterLoader.swfContent as Sprite;
        this.characterLoader.unLoadSwf();
        this.dispatchEvent(new Event(Event.COMPLETE));
    }

    public get replayData(): ReplayData {
        return this._replayData;
    }

    public get levelData(): Sprite {
        return this._levelData;
    }

    public get levelVersion(): number {
        return this._levelVersion;
    }

    public get characterData(): Sprite {
        return this._characterData;
    }

    public get errorString(): string {
        return this._errorString;
    }
}