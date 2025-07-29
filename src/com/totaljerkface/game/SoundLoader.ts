import Settings from "@/com/totaljerkface/game/Settings";
import DisplayObject from "flash/display/DisplayObject";
import Loader from "flash/display/Loader";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import IOErrorEvent from "flash/events/IOErrorEvent";
import ProgressEvent from "flash/events/ProgressEvent";
import URLLoader from "flash/net/URLLoader";
import URLLoaderDataFormat from "flash/net/URLLoaderDataFormat";
import URLRequest from "flash/net/URLRequest";
import ApplicationDomain from "flash/system/ApplicationDomain";
import LoaderContext from "flash/system/LoaderContext";
import TextField from "flash/text/TextField";
import ByteArray from "flash/utils/ByteArray";
// import { audios } from "./audios.json";
import { boundClass } from 'autobind-decorator';
// import symbol369 from '@assets/json/369.json';
import assets from '@assets/json/assets.json';

const symbol369 = (assets as any).tags.find((tag) => tag.id === 369);

/* [Embed(source="/_assets/assets.swf", symbol="symbol369")] */
@boundClass
export default class SoundLoader extends Sprite {
    public loadText: TextField;
    private urlLoader: URLLoader;
    private loader: Loader;
    private domain: ApplicationDomain;
    private context: LoaderContext;
    private _content: DisplayObject;

    constructor() {
        super();

        // this.loadText = new TextField();
        // this.loadText.text = 'load';
        // console.log(symbol369);
        // this.loadText.x = symbol369.tags[0].matrix.translate_x / 20;
        // this.loadText.y = symbol369.tags[0].matrix.translate_y / 20;
        // this.loadText.textColor = 0xff0000;
        // this.loadText.width = 200;
        // this.addChild(this.loadText);

        // @ts-ignore
        embedRecursive(this, {
            loadText: TextField
        }, 369);

        console.log(this.loadText);
        this.loadText.textColor = 0xff0000;

        // console.log(1, this.width, this.height);
        // console.log(2, this.loadText.width, this.loadText.height);
    }

    public loadSound(param1: string) {
        var _loc2_ = new URLRequest(
            Settings.pathPrefix + "happy_sounds_v1_72.swf",
        );
        this.urlLoader = new URLLoader();
        this.urlLoader.dataFormat = URLLoaderDataFormat.BINARY;
        this.urlLoader.addEventListener(
            Event.COMPLETE,
            this.bytesComplete,
            false,
            0,
            true,
        );
        this.urlLoader.addEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
            false,
            0,
            true,
        );
        this.urlLoader.addEventListener(
            ProgressEvent.PROGRESS,
            this.loadProgress,
            false,
            0,
            true,
        );
        this.urlLoader.load(_loc2_);
    }

    private bytesComplete(param1: Event) {
        this.urlLoader.removeEventListener(Event.COMPLETE, this.bytesComplete);
        this.urlLoader.removeEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
        );
        this.urlLoader.removeEventListener(
            ProgressEvent.PROGRESS,
            this.loadProgress,
        );
        var _loc2_ = this.urlLoader.data as ByteArray;
        this.loader = new Loader();
        this.loader.contentLoaderInfo.addEventListener(
            Event.COMPLETE,
            this.loadComplete,
        );
        var _loc3_ = ApplicationDomain.currentDomain;
        var _loc4_ = new LoaderContext(false, _loc3_);
        this.loader.loadBytes(_loc2_, _loc4_);
        console.log('bytesComplete');
        this.loader.contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE));
    }

    private loadProgress(param1: ProgressEvent) {
        var _loc2_: number = Math.round(
            (param1.bytesLoaded / param1.bytesTotal) * 100,
        );
        this.loadText.text = "loading sounds ... " + _loc2_ + " %";
        console.log(this.loadText.text);
    }

    private loadComplete(param1: Event) {
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
        console.log('loadComplete');
    }

    public IOErrorHandler(param1: IOErrorEvent) {
        trace(param1.text);
    }

    public unLoadSwf() {
        this.loader.unloadAndStop();
    }
}