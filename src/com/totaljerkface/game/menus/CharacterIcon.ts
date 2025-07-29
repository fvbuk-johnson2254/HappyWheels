import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import BlendMode from "flash/display/BlendMode";
import Loader from "flash/display/Loader";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import IOErrorEvent from "flash/events/IOErrorEvent";
import GlowFilter from "flash/filters/GlowFilter";
import URLRequest from "flash/net/URLRequest";

@boundClass
export default class CharacterIcon extends Sprite {
    private static fileString: string;
    public static iconWidth: number = 50;
    public static iconHeight: number = 50;
    private bg: Sprite;
    private _index: number;
    private loaderColor: Loader;
    private loaderBW: Loader;
    private _selected: boolean;
    private _selectable: boolean;
    private glowFilter: GlowFilter;

    constructor(param1: number) {
        super();
        this._index = param1;
        this.createBg();
        this.mouseChildren = false;
        if (param1 <= Settings.totalCharacters) {
            this.loadBitmaps();
            this.loaderBW.visible = true;
            this.loaderColor.visible = false;
            this._selectable = true;
            this.buttonMode = true;
        }
    }

    private createBg() {
        this.bg = new Sprite();
        this.addChild(this.bg);
        this.bg.graphics.beginFill(16777215, 0.1);
        this.bg.graphics.drawRect(
            0,
            0,
            CharacterIcon.iconWidth,
            CharacterIcon.iconHeight,
        );
        this.bg.graphics.drawRect(
            5,
            5,
            CharacterIcon.iconWidth - 10,
            CharacterIcon.iconHeight - 10,
        );
        this.bg.graphics.endFill();
        this.bg.graphics.beginFill(0, 0.1);
        this.bg.graphics.drawRect(
            5,
            5,
            CharacterIcon.iconWidth - 10,
            CharacterIcon.iconHeight - 10,
        );
        this.bg.graphics.endFill();
    }

    private loadBitmaps() {
        trace("loadBitmap");
        this.loaderBW = new Loader();
        this.loaderColor = new Loader();
        var _loc1_ = new URLRequest(
            Settings.pathPrefix +
            Settings.imagePath +
            CharacterIcon.fileString +
            this.index +
            "_bw.png",
        );
        var _loc2_ = new URLRequest(
            Settings.pathPrefix +
            Settings.imagePath +
            CharacterIcon.fileString +
            this.index +
            ".png",
        );
        trace("urlReq " + _loc1_.url);
        this.loaderBW.contentLoaderInfo.addEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
            false,
            0,
            true,
        );
        this.loaderColor.contentLoaderInfo.addEventListener(
            IOErrorEvent.IO_ERROR,
            this.IOErrorHandler,
            false,
            0,
            true,
        );
        this.loaderBW.load(_loc1_);
        this.loaderColor.load(_loc2_);
        this.loaderBW.x = this.loaderColor.x = 5;
        this.loaderBW.y = this.loaderColor.y = 5;
        this.addChild(this.loaderBW);
        this.addChild(this.loaderColor);
    }

    private bitmapLoaded(param1: Event) { }

    private IOErrorHandler(param1: IOErrorEvent) {
        trace(param1.text);
    }

    public get selected(): boolean {
        return this._selected;
    }

    public get selectable(): boolean {
        return this._selectable;
    }

    public set selected(param1: boolean) {
        if (param1 == this._selected) {
            return;
        }
        this._selected = param1;
        if (this._selected) {
            this.bg.graphics.clear();
            this.bg.graphics.beginFill(16777215, 1);
            this.bg.graphics.drawRect(
                0,
                0,
                CharacterIcon.iconWidth,
                CharacterIcon.iconHeight,
            );
            this.bg.graphics.drawRect(
                5,
                5,
                CharacterIcon.iconWidth - 10,
                CharacterIcon.iconHeight - 10,
            );
            this.bg.graphics.endFill();
            this.bg.graphics.beginFill(0, 0.7);
            this.bg.graphics.drawRect(
                5,
                5,
                CharacterIcon.iconWidth - 10,
                CharacterIcon.iconHeight - 10,
            );
            this.bg.graphics.endFill();
            this.bg.blendMode = BlendMode.OVERLAY;
            this.glowFilter = new GlowFilter(16777215, 1, 10, 10, 2, 3);
            this.bg.filters = [this.glowFilter];
            this.loaderBW.visible = false;
            this.loaderColor.visible = true;
        } else {
            this.bg.graphics.clear();
            this.bg.graphics.beginFill(16777215, 0.1);
            this.bg.graphics.drawRect(
                0,
                0,
                CharacterIcon.iconWidth,
                CharacterIcon.iconHeight,
            );
            this.bg.graphics.drawRect(
                5,
                5,
                CharacterIcon.iconWidth - 10,
                CharacterIcon.iconHeight - 10,
            );
            this.bg.graphics.endFill();
            this.bg.graphics.beginFill(0, 0.1);
            this.bg.graphics.drawRect(
                5,
                5,
                CharacterIcon.iconWidth - 10,
                CharacterIcon.iconHeight - 10,
            );
            this.bg.graphics.endFill();
            this.bg.blendMode = BlendMode.NORMAL;
            this.bg.filters = [];
            this.loaderBW.visible = true;
            this.loaderColor.visible = false;
        }
    }

    public get index(): number {
        return this._index;
    }
}