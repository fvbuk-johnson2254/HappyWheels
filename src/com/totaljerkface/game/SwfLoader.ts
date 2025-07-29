import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Loader from "flash/display/Loader";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import EventDispatcher from "flash/events/EventDispatcher";
import IOErrorEvent from "flash/events/IOErrorEvent";
import ProgressEvent from "flash/events/ProgressEvent";
import URLRequest from "flash/net/URLRequest";
import ApplicationDomain from "flash/system/ApplicationDomain";
import LoaderContext from "flash/system/LoaderContext";

@boundClass
export default class SwfLoader extends EventDispatcher {
    public swf: string;
    public loader: Loader;
    private domain: ApplicationDomain;
    private context: LoaderContext;
    private _content: DisplayObject;

    constructor(param1: string) {
        super();
        this.swf = param1;
    }

    public loadSWF() {
        this.loader = new Loader();
        var _loc1_ = new URLRequest(this.swf);
        trace("LoadSWF " + _loc1_.url);
        this.loader.load(_loc1_);
        this.loader.contentLoaderInfo.addEventListener(
            ProgressEvent.PROGRESS,
            this.loadProgress,
            false,
            0,
            true,
        );
        this.loader.contentLoaderInfo.addEventListener(
            Event.COMPLETE,
            this.loadComplete,
            false,
            0,
            true,
        );
        this.loader.contentLoaderInfo.addEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
            false,
            0,
            true,
        );
    }

    public loadProgress(param1: ProgressEvent) { }

    public loadComplete(param1: Event) {
        this.loader.contentLoaderInfo.removeEventListener(
            ProgressEvent.PROGRESS,
            this.loadProgress,
        );
        this.loader.contentLoaderInfo.removeEventListener(
            Event.COMPLETE,
            this.loadComplete,
        );
        this.loader.contentLoaderInfo.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.dispatchEvent(new Event(Event.COMPLETE));
    }

    public IOErrorHandler(param1: IOErrorEvent) {
        trace("SwfLoader: " + param1.text);
        this.loader.contentLoaderInfo.removeEventListener(
            ProgressEvent.PROGRESS,
            this.loadProgress,
        );
        this.loader.contentLoaderInfo.removeEventListener(
            Event.COMPLETE,
            this.loadComplete,
        );
        this.loader.contentLoaderInfo.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.dispatchEvent(new Event(IOErrorEvent.IO_ERROR));
    }

    public get swfContent(): DisplayObject {
        var _loc1_ = new Sprite();
        var _loc2_: DisplayObject = this.loader.content;
        _loc1_.addChild(this.loader.content);
        return _loc2_;
    }

    public unLoadSwf() {
        this.loader.unloadAndStop();
    }

    public cancelLoad() {
        if (this.loader.contentLoaderInfo.hasEventListener(Event.COMPLETE)) {
            this.loader.contentLoaderInfo.removeEventListener(
                ProgressEvent.PROGRESS,
                this.loadProgress,
            );
            this.loader.contentLoaderInfo.removeEventListener(
                Event.COMPLETE,
                this.loadComplete,
            );
            this.loader.contentLoaderInfo.removeEventListener(
                IOErrorEvent.IO_ERROR,
                this.IOErrorHandler,
            );
            if (this.loader.contentLoaderInfo.bytesLoaded > 4) {
                if (
                    this.loader.contentLoaderInfo.bytesLoaded <
                    this.loader.contentLoaderInfo.bytesTotal
                ) {
                    try {
                        this.loader.close();
                    } catch (error) {
                        trace("catch error = " + Error);
                    }
                }
            }
        }
    }
}