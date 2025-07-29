import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import DropMenu from "@/com/totaljerkface/game/menus/DropMenu";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import TextField from "flash/text/TextField";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2996")] */
@boundClass
export default class LoadLevelMenu extends Sprite {
    public static REPLAY: string;
    public static LEVEL: string = "level";
    public static LOAD: string = "load";
    public static CANCEL: string = "cancel";
    private static index: number = 0;
    public searchText: TextField;
    public errorText: TextField;
    protected _window: Window;
    protected dropMenu: DropMenu;
    private loadButton: GenericButton;
    private cancelButton: GenericButton;

    constructor() {
        super();
        this.createWindow();
        this.dropMenu = new DropMenu(
            "load:",
            ["level", "replay"],
            [LoadLevelMenu.LEVEL, LoadLevelMenu.REPLAY],
            LoadLevelMenu.index,
            8947848,
        );
        this.addChild(this.dropMenu);
        this.dropMenu.xLeft = 64;
        this.dropMenu.y = 35;
        this.loadButton = new GenericButton("load", 16613761, 70);
        this.addChild(this.loadButton);
        this.loadButton.x = 25;
        this.loadButton.y = 114;
        this.cancelButton = new GenericButton("cancel", 10066329, 70);
        this.addChild(this.cancelButton);
        this.cancelButton.x = 105;
        this.cancelButton.y = 114;
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.searchText.addEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
    }

    protected createWindow() {
        this._window = new Window(false, this, true);
    }

    public get window(): Window {
        return this._window;
    }

    public get loadType(): string {
        return this.dropMenu.value;
    }

    public set loadID(param1: string) {
        this.searchText.text = param1;
    }

    public get loadID(): string {
        return this.searchText.text;
    }

    private keyDownHandler(param1: KeyboardEvent) {
        this.errorText.text = "";
        if (param1.keyCode == 13) {
            this.ifValidLoad();
        }
    }

    private ifValidLoad() {
        this.errorText.text = "";
        var _loc1_: boolean = true;
        var _loc2_: any[] = this.searchText.text.split("=");
        if (_loc2_.length == 1) {
            if (isNaN(Number(this.searchText.text))) {
                _loc1_ = false;
            }
            if (Number(this.searchText.text) < 1) {
                _loc1_ = false;
            }
        } else if (
            this.searchText.text.indexOf("level_id") == -1 &&
            this.searchText.text.indexOf("replay_id") == -1
        ) {
            _loc1_ = false;
        }
        if (_loc1_) {
            this.dispatchEvent(new Event(LoadLevelMenu.LOAD));
        } else {
            this.errorText.text = "ID is invalid.";
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.loadButton:
                this.ifValidLoad();
                break;
            case this.cancelButton:
                this.dispatchEvent(new Event(LoadLevelMenu.CANCEL));
        }
    }

    public die() {
        LoadLevelMenu.index = this.dropMenu.currentIndex;
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.searchText.removeEventListener(
            KeyboardEvent.KEY_DOWN,
            this.keyDownHandler,
        );
        this.dropMenu.die();
        this._window.closeWindow();
    }
}