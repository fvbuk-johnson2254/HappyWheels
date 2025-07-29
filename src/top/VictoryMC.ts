import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

/* [Embed(source="/_assets/assets.swf", symbol="symbol86")] */
@boundClass
export default class VictoryMC extends MovieClip {
    public timeText: MovieClip;

    constructor() {
        super();
        this.addFrameScript(15, this.frame16);
    }

    public frame16() {
        this.stop();
    }
}