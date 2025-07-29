import LibraryButton from "@/com/totaljerkface/game/editor/ui/LibraryButton";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class BasicMenu extends Sprite {
    public backButton: LibraryButton;

    constructor() {
        super();
        this.backButton.addEventListener(MouseEvent.MOUSE_UP, this.backPress);
    }

    private backPress(param1: MouseEvent) {
        trace("back press");
        this.dispatchEvent(new NavigationEvent(NavigationEvent.MAIN_MENU));
    }

    public die() {
        this.backButton.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.backPress,
        );
    }
}