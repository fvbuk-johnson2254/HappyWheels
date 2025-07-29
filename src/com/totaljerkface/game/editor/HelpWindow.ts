import SpecialListScroller from "@/com/totaljerkface/game/editor/ui/SpecialListScroller";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class HelpWindow extends Sprite {
    private static _instance: HelpWindow;
    private static windowX: number;
    private static windowY: number;
    private windowWidth: number = 200;
    private windowHeight: number = 155;
    private holder: Sprite;
    private maskSprite: Sprite;
    private textField: TextField;
    private scroller: SpecialListScroller;
    private _window: Window;

    constructor() {
        super();
        if (HelpWindow._instance) {
            throw new Error("help window already exists");
        }
        HelpWindow._instance = this;
        this.init();
    }

    public static get instance(): HelpWindow {
        return HelpWindow._instance;
    }

    private init() {
        this.createWindow();
        this.createShit();
    }

    public createWindow() {
        this._window = new Window(true, this);
        this._window.setDimensions(this.windowWidth, this.windowHeight);
        if (HelpWindow.windowX) {
            this._window.x = HelpWindow.windowX;
            this._window.y = HelpWindow.windowY;
        }
        this._window.addEventListener(Window.WINDOW_CLOSED, this.windowClosed);
    }

    public closeWindow() {
        HelpWindow.windowX = this._window.x;
        HelpWindow.windowY = this._window.y;
        this._window.removeEventListener(
            Window.WINDOW_CLOSED,
            this.windowClosed,
        );
        this._window.closeWindow();
        this._window = null;
    }

    private windowClosed(param1: Event) {
        HelpWindow.windowX = this._window.x;
        HelpWindow.windowY = this._window.y;
        this._window.removeEventListener(
            Window.WINDOW_CLOSED,
            this.windowClosed,
        );
        this._window = null;
        this.dispatchEvent(new Event(Window.WINDOW_CLOSED));
    }

    private createShit() {
        this.graphics.beginFill(16777215);
        this.graphics.drawRect(0, 0, this.windowWidth, this.windowHeight);
        this.graphics.endFill();
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std",
            12,
            0,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.textField = new TextField();
        this.textField.defaultTextFormat = _loc1_;
        this.textField.width = this.windowWidth - 12;
        this.textField.height = 20;
        this.textField.x = 0;
        this.textField.y = 0;
        this.textField.multiline = true;
        this.textField.autoSize = TextFieldAutoSize.LEFT;
        this.textField.wordWrap = true;
        this.textField.selectable = false;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.ADVANCED;
        this.holder = new Sprite();
        this.addChild(this.holder);
        this.holder.addChild(this.textField);
        this.maskSprite = new Sprite();
        this.maskSprite.graphics.beginFill(0);
        this.maskSprite.graphics.drawRect(
            0,
            0,
            this.windowWidth - 12,
            this.windowHeight,
        );
        this.maskSprite.graphics.endFill();
        this.addChild(this.maskSprite);
        this.holder.mask = this.maskSprite;
        this.scroller = new SpecialListScroller(
            this.holder,
            this.maskSprite,
            22,
        );
        this.addChild(this.scroller);
        this.scroller.x = this.windowWidth - 12;
    }

    public populate(param1: string) {
        this.textField.htmlText = param1;
        this.holder.y = 0;
        this.scroller.updateScrollTab();
    }

    public get window(): Window {
        return this._window;
    }

    public die() {
        HelpWindow._instance = null;
        this.scroller.die();
        if (this._window) {
            this._window.closeWindow();
        }
    }
}