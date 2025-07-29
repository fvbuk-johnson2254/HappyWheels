import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";

/* [Embed(source="/_assets/assets.swf", symbol="symbol453")] */
@boundClass
export default class NewStar extends Sprite {
    public star: Sprite;

    constructor() {
        super();
        this.addEventListener(Event.ENTER_FRAME, this.rotate, false, 0, true);
    }

    public rotate(param1: Event) {
        this.star.rotation += 1;
    }
}