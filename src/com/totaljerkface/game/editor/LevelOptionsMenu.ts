import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import LevelOptionsColorInput from "@/com/totaljerkface/game/editor/ui/LevelOptionsColorInput";
import ValueEvent from "@/com/totaljerkface/game/editor/ui/ValueEvent";
import Window from "@/com/totaljerkface/game/editor/ui/Window";
import DropMenu from "@/com/totaljerkface/game/menus/DropMenu";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol787")] */
@boundClass
export default class LevelOptionsMenu extends Sprite {
    private static windowX: number;
    private static windowY: number = 250;
    private backdropDrop: DropMenu;
    private backgroundColorInput: LevelOptionsColorInput;
    private _window: Window;

    constructor() {
        super();
        this.init();
    }

    public init() {
        var _loc1_: any[] = ["blank", "green hills", "city"];
        var _loc2_: any[] = [0, 1, 2];
        this.backdropDrop = new DropMenu(
            "level backdrop:",
            _loc1_,
            _loc2_,
            Canvas.backDropIndex,
            16777215,
        );
        this.addChild(this.backdropDrop);
        this.backdropDrop.xLeft = 20;
        this.backdropDrop.y = 15;
        this.backdropDrop.addEventListener(
            DropMenu.ITEM_SELECTED,
            this.bdSelected,
        );
        this.backgroundColorInput = new LevelOptionsColorInput(
            "background color",
            "backgroundColor",
            true,
            true,
        );
        this.addChildAt(
            this.backgroundColorInput,
            this.getChildIndex(this.backdropDrop),
        );
        this.backgroundColorInput.x = 20;
        this.backgroundColorInput.y =
            this.backdropDrop.y + this.backdropDrop.height + 3;
        this.backgroundColorInput.setValue(Canvas.backgroundColor);
        this.backgroundColorInput.addEventListener(
            ValueEvent.VALUE_CHANGE,
            this.handleColorSelected,
        );
        this.buildWindow();
        this._window.resize();
    }

    private handleColorSelected(param1: Event) {
        if (Canvas.backgroundColor == this.backgroundColorInput.color) {
            return;
        }
        if (
            this.backgroundColorInput.color == -1 ||
            this.backgroundColorInput.color == 16777215
        ) {
            Canvas.backgroundColor = this.backgroundColorInput.color = 16777215;
        } else {
            this.backdropDrop.currentIndex = Canvas.backDropIndex = 0;
            Canvas.backgroundColor = this.backgroundColorInput.color;
        }
    }

    private bdSelected(param1: Event) {
        this.backgroundColorInput.color = Canvas.backgroundColor = 16777215;
        Canvas.backDropIndex = this.backdropDrop.currentIndex;
    }

    private buildWindow() {
        this._window = new Window(true, this, true);
        this._window.x = LevelOptionsMenu.windowX;
        this._window.y = LevelOptionsMenu.windowY;
        this._window.addEventListener(Window.WINDOW_CLOSED, this.windowClosed);
    }

    public get window(): Window {
        return this._window;
    }

    private windowClosed(param1: Event) {
        this.dispatchEvent(param1.clone());
    }

    public die() {
        this._window.removeEventListener(
            Window.WINDOW_CLOSED,
            this.windowClosed,
        );
        this._window.closeWindow();
        this.backdropDrop.removeEventListener(
            DropMenu.ITEM_SELECTED,
            this.bdSelected,
        );
        this.backdropDrop.die();
        this.backgroundColorInput.removeEventListener(
            ValueEvent.VALUE_CHANGE,
            this.handleColorSelected,
        );
        this.backgroundColorInput.die();
    }
}