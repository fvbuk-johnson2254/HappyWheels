import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol65")] */
@boundClass
export default class MouseClickMC extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(15, this.frame16);
    }

    public frame16() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}