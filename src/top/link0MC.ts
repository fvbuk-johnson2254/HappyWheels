import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2708")] */
@boundClass
export default class link0MC extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1);
    }

    public frame1() {
        this.stop();
    }
}