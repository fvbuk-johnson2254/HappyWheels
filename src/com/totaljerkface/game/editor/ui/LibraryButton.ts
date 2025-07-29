import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class LibraryButton extends Sprite {
    public bg: Sprite;
    public textSprite: Sprite;
    private _selected: boolean;
    private offAlpha: number = 0.8;

    constructor() {
        super();
        this.mouseChildren = false;
        this.buttonMode = true;
        this.tabEnabled = false;
        this.selected = false;
        this.addEventListener(
            MouseEvent.ROLL_OVER,
            this.rollOverHandler,
            false,
            0,
            true,
        );
        this.addEventListener(
            MouseEvent.ROLL_OUT,
            this.rollOutHandler,
            false,
            0,
            true,
        );
        this.addEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
            false,
            0,
            true,
        );
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(param1: boolean) {
        this._selected = param1;
        if (this._selected) {
            this.rollOverHandler();
        } else {
            this.rollOutHandler();
        }
    }

    private rollOverHandler(param1: MouseEvent = null) {
        this.textSprite.alpha = 1;
    }

    private rollOutHandler(param1: MouseEvent = null) {
        if (this._selected) {
            return;
        }
        this.textSprite.alpha = this.offAlpha;
    }

    private mouseUpHandler(param1: MouseEvent) {
        SoundController.instance.playSoundItem("MenuSelect");
    }
}