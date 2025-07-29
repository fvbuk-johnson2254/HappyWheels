import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol195")] */
@boundClass
export default class Explosion2 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(47, this.frame48);
    }

    public frame48() {
        this.stop();
        this.parent.removeChild(this);
    }
}