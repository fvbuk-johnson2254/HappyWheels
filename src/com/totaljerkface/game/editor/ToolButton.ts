import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import GlowFilter from "flash/filters/GlowFilter";

@boundClass
export default class ToolButton extends Sprite {
    public icon: Sprite;
    public bg: MovieClip;
    private glowFilter = new GlowFilter(4032711, 1, 10, 10, 2, 3, true);
    private _selected: boolean;
    private iconY: number;

    constructor() {
        super();
        this.init();
    }

    private init() {
        this.iconY = this.icon.y;
        this.mouseChildren = false;
        this.addEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
        this.addEventListener(MouseEvent.MOUSE_OUT, this.mouseOutHandler);
    }

    private mouseOverHandler(param1: MouseEvent) {
        if (this._selected) {
            return;
        }
        this.bg.gotoAndStop(2);
    }

    private mouseOutHandler(param1: MouseEvent) {
        if (this._selected) {
            return;
        }
        this.bg.gotoAndStop(1);
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(param1: boolean) {
        this._selected = param1;
        if (param1) {
            this.bg.gotoAndStop(3);
            this.icon.filters = [this.glowFilter];
        } else {
            this.bg.gotoAndStop(1);
            this.icon.filters = [];
        }
    }
}