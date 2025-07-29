import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol2888")] */
@boundClass
export default class MuzzleFlare extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(22, this.frame23);
    }

    public frame23() {
        this.stop();
        this.parent.removeChild(this);
    }
}