import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";

/* [Embed(source="/_assets/assets.swf", symbol="symbol686")] */
@boundClass
export default class Window extends Sprite {
    public static WINDOW_CLOSED: string;
    public frame: Sprite;
    public shadow: Sprite;
    public closeButton: Sprite;
    public content: Sprite;
    private verticalSpace: number = 17;
    private horizontalSpace: number = 4;
    private border: number = 2;
    private stageCover: Sprite;

    constructor(
        param1: boolean = true,
        param2: Sprite = null,
        param3: boolean = false,
    ) {
        super();
        if (param2) {
            this.populate(param2);
        }
        if (param3) {
            this.createStageCover();
        }
        if (!param1) {
            this.closeButton.visible = false;
        }
    }

    private addListeners() {
        this.frame.addEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.frame.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.closeButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.closeWindow,
        );
    }

    private removeListeners() {
        this.frame.removeEventListener(
            MouseEvent.MOUSE_DOWN,
            this.mouseDownHandler,
        );
        this.frame.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.closeButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.closeWindow,
        );
    }

    private mouseDownHandler(param1: Event) {
        this.startDrag();
    }

    private mouseUpHandler(param1: Event) {
        this.stopDrag();
    }

    public populate(param1: Sprite) {
        this.content = param1;
        this.addChild(param1);
        param1.x = this.horizontalSpace - this.border;
        param1.y = this.verticalSpace - this.border;
        this.resize();
        this.addListeners();
    }

    public resize() {
        this.frame.width =
            Math.max(10, this.content.width) + this.horizontalSpace;
        this.frame.height =
            Math.max(10, this.content.height) + this.verticalSpace;
        this.shadow.width = this.frame.width;
        this.shadow.height = this.frame.height;
        this.closeButton.x = this.frame.width - 11;
    }

    public setDimensions(param1: number, param2: number) {
        this.frame.width = Math.max(10, param1) + this.horizontalSpace;
        this.frame.height = Math.max(10, param2) + this.verticalSpace;
        this.shadow.width = this.frame.width;
        this.shadow.height = this.frame.height;
        this.closeButton.x = this.frame.width - 11;
    }

    public closeWindow(param1: MouseEvent = null) {
        if (this.content) {
            this.removeChild(this.content);
            this.content = null;
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.removeListeners();
        this.dispatchEvent(new Event(Window.WINDOW_CLOSED, true));
    }

    private createStageCover() {
        this.stageCover = new Sprite();
        this.addChildAt(this.stageCover, 0);
        this.stageCover.graphics.beginFill(0, 0.5);
        this.stageCover.graphics.drawRect(-1000, -500, 3000, 1500);
        this.stageCover.graphics.endFill();
    }

    // @ts-expect-error
    public override get width(): number {
        return this.frame.width;
    }

    // @ts-expect-error
    public override get height(): number {
        return this.frame.height;
    }

    public center() {
        this.x = Math.round((this.stage.stageWidth - this.frame.width) / 2);
        this.y = Math.round((this.stage.stageHeight - this.frame.height) / 2);
    }
}