import Tracker from "@/com/totaljerkface/game/utils/Tracker";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import URLRequest from "flash/net/URLRequest";

/* [Embed(source="/_assets/assets.swf", symbol="symbol454")] */
@boundClass
export default class AppLinkButton extends Sprite {
    public appButton: Sprite;
    public googlePlayAppButton: Sprite;
    public head: Sprite;

    constructor() {
        super();

        // @ts-ignore
        embedRecursive(this, {
            appButton: Sprite,
            googlePlayAppButton: Sprite,
            head: Sprite
        }, 454);

        this.appButton.buttonMode = true;
        this.googlePlayAppButton.buttonMode = true;
        this.appButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
            false,
            0,
            true,
        );
        this.googlePlayAppButton.addEventListener(
            MouseEvent.MOUSE_UP,
            this.googlePlayMouseUpHandler,
            false,
            0,
            true,
        );
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: string = "https://itunes.apple.com/us/app/happy-wheels/id648668184?mt=8";
        Tracker.trackEvent(Tracker.MAIN_MENU, Tracker.CLICK_IOS_LINK);
        var _loc3_ = new URLRequest(_loc2_);
        navigateToURL(_loc3_, "_blank");
    }

    private googlePlayMouseUpHandler(param1: MouseEvent) {
        var _loc2_: string = "https://play.google.com/store/apps/details?id=com.fancyforce.happywheels";
        Tracker.trackEvent(Tracker.MAIN_MENU, Tracker.CLICK_GOOGLEPLAY_LINK);
        var _loc3_ = new URLRequest(_loc2_);
        navigateToURL(_loc3_, "_blank");
    }
}