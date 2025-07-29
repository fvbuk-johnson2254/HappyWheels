import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import ColorTransform from "flash/geom/ColorTransform";
import URLRequest from "flash/net/URLRequest";

@boundClass
export default class CreditsLink extends Sprite {
    private textSprite: Sprite;
    private url: string;
    public colorTransform: ColorTransform;

    constructor(param1: Sprite, param2: string) {
        super();
        this.textSprite = param1;
        this.url = param2;
        this.buttonMode = true;
        this.tabEnabled = false;
        this.colorTransform = new ColorTransform(
            1,
            1,
            1,
            1,
            253,
            -129,
            -129,
            0,
        );
        this.x = param1.x;
        this.y = param1.y;
        param1.parent.addChild(this);
        param1.x = 0;
        param1.y = 0;
        this.addChild(param1);
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

    private rollOverHandler(param1: MouseEvent) {
        this.transform.colorTransform = this.colorTransform;
    }

    private rollOutHandler(param1: MouseEvent) {
        this.transform.colorTransform = new ColorTransform(
            1,
            1,
            1,
            1,
            0,
            0,
            0,
            0,
        );
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_ = new URLRequest(this.url);
        navigateToURL(_loc2_, "_blank");
    }

    public die() {
        this.removeEventListener(MouseEvent.ROLL_OVER, this.rollOverHandler);
        this.removeEventListener(MouseEvent.ROLL_OUT, this.rollOutHandler);
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }
}