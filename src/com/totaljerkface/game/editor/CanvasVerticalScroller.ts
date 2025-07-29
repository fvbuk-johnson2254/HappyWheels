import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import Rectangle from "flash/geom/Rectangle";
import { boundClass } from 'autobind-decorator';

/* [Embed(source="/_assets/assets.swf", symbol="symbol826")] */
@boundClass
export default class CanvasVerticalScroller extends Sprite {
    public scrollTab: Sprite;
    public bg: Sprite;
    private container: Sprite;
    private canvasHolder: Sprite;
    private totalHeight: number = 500;
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
            this.canvasHolder.scaleY * Canvas.canvasHeight + this.spacing * 2;
        var _loc2_: number = this.totalHeight / _loc1_;
        if (_loc2_ > 1) {
            this.visible = false;
            return;
        }
        this.visible = true;
        this.scrollTab.height = _loc2_ * this.bg.height;
        this.scrollTab.y =
            ((this.canvasHolder.y - this.spacing) * -this.bg.height) / _loc1_;
    }

    private updateCanvas(param1: MouseEvent = null) {
        var _loc2_: number =
            this.canvasHolder.scaleY * Canvas.canvasHeight + this.spacing * 2;
        this.canvasHolder.y =
            (this.scrollTab.y * _loc2_) / -this.bg.height + this.spacing;
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
        if (this.bg.mouseY > this.scrollTab.y) {
            this.scrollTab.y += this.scrollTab.height;
            if (this.scrollTab.y + this.scrollTab.height > this.bg.height) {
                this.scrollTab.y = this.bg.height - this.scrollTab.height;
            }
        } else {
            this.scrollTab.y -= this.scrollTab.height;
            if (this.scrollTab.y < 0) {
                this.scrollTab.y = 0;
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
            new Rectangle(0, 0, 0, this.bg.height - this.scrollTab.height),
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