import Settings from "@/com/totaljerkface/game/Settings";
import LibraryButton from "@/com/totaljerkface/game/editor/ui/LibraryButton";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import BasicMenu from "@/com/totaljerkface/game/menus/BasicMenu";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";

/* [Embed(source="/_assets/assets.swf", symbol="symbol496")] */
@boundClass
export default class ControlsMenu extends BasicMenu {
    public customizeControlsButton: LibraryButton;
    public message: Sprite;
    private keys: any[] = [
        "accelerate",
        "decelerate",
        "leanForward",
        "leanBack",
        "primaryAction",
        "secondaryAction1",
        "secondaryAction2",
        "eject",
        "switchCamera",
    ];

    constructor() {
        super();
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        var _loc1_: boolean = true;
        var _loc2_: number = 0;
        while (_loc2_ < this.keys.length) {
            if (
                Settings[this.keys[_loc2_] + "DefaultCode"] !=
                Settings[this.keys[_loc2_] + "Code"]
            ) {
                trace(this.keys[_loc2_] + " is not the default");
                _loc1_ = false;
                break;
            }
            _loc2_++;
        }
        trace("hi");
        this.message.visible = _loc1_ ? false : true;
    }

    private mouseUpHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.customizeControlsButton:
                this.dispatchEvent(
                    new NavigationEvent(NavigationEvent.CUSTOMIZE_CONTROLS),
                );
        }
    }

    public override die() {
        super.die();
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
    }
}