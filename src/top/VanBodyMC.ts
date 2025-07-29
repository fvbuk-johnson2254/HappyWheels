import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol680")] */
@boundClass
export default class VanBodyMC extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1);
    }

    public frame1() {
        this.stop();
    }
}