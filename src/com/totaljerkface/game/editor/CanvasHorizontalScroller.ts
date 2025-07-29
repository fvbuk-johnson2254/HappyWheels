import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import Rectangle from "flash/geom/Rectangle";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol829")] */
@boundClass
export default class CanvasHorizontalScroller extends Sprite {
    public scrollTab: Sprite;
    public bg: Sprite;
    private container: Sprite;
    private canvasHolder: Sprite;
    private totalWidth: number = 900;
    private spacing: number;
    private dragging: boolean;

    constructor(param1: Sprite, param2: Sprite, param3: number) {
        super();
        this.container = param1;
        this.canvasHolder = param2;
        this.spacing = param3;
        this.updateScrollTab();
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
    }

    public updateScrollTab() {
        var _loc1_: number = NaN;
        _loc1_ =
            this.canvasHolder.scaleX * Canvas.canvasWidth + this.spacing * 2;
        var _loc2_: number = this.totalWidth / _loc1_;
        if (_loc2_ > 1) {
            this.visible = false;
            return;
        }
        this.visible = true;
        this.scrollTab.width = _loc2_ * this.bg.width;
        this.scrollTab.x =
            ((this.canvasHolder.x - this.spacing) * -this.bg.width) / _loc1_;
    }

    private updateCanvas(param1: MouseEvent = null) {
        var _loc2_: number =
            this.canvasHolder.scaleX * Canvas.canvasWidth + this.spacing * 2;
        this.canvasHolder.x =
            (this.scrollTab.x * _loc2_) / -this.bg.width + this.spacing;
    }

    private mouseDownHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.scrollTab:
                if (!this.dragging) {
                    this.startScrollDrag();
                }
                break;
            case this.bg:
                this.bgPress();
        }
    }

    private bgPress() {
        if (this.bg.mouseX > this.scrollTab.x) {
            this.scrollTab.x += this.scrollTab.width;
            if (this.scrollTab.x + this.scrollTab.width > this.bg.width) {
                this.scrollTab.x = this.bg.width - this.scrollTab.width;
            }
        } else {
            this.scrollTab.x -= this.scrollTab.width;
            if (this.scrollTab.x < 0) {
                this.scrollTab.x = 0;
            }
        }
        this.updateCanvas();
    }

    private mouseUpHandler(param1: MouseEvent) {
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.updateCanvas,
        );
        this.stopScrollDrag();
    }

    private startScrollDrag() {
        this.dragging = true;
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.updateCanvas);
        this.scrollTab.startDrag(
            false,
            new Rectangle(0, 0, this.bg.width - this.scrollTab.width, 0),
        );
    }

    private stopScrollDrag() {
        this.dragging = false;
        this.scrollTab.stopDrag();
    }

    public die() {
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.updateCanvas,
        );
        this.removeEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
    }
}